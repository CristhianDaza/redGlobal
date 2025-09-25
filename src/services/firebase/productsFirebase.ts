import type { ProductsRedGlobal } from '@/types/common.d'
import { collection, doc, getDocs, setDoc, query, orderBy, limit, writeBatch } from 'firebase/firestore'
import { db } from '@/config'
import { getDay } from '@/utils'
import { cacheService, API_CACHE_CONFIG, logger } from '@/services'

export const productsFirebase = {
  async saveProducts(allProducts: ProductsRedGlobal[]): Promise<void> {
    logger.info(`Saving ${allProducts.length} products to Firebase`, 'productsFirebase');
    await this.deleteAllProducts()
    const CHUNK_SIZE = 100;
    const BATCH_LIMIT = 450;

    const sanitize = (obj: any) => JSON.parse(JSON.stringify(obj, (_k, v) => v === undefined ? null : v));

    let batch = writeBatch(db);
    let opsInBatch = 0;
    let chunksSaved = 0;

    const commitBatch = async () => {
      if (opsInBatch === 0) return;
      await batch.commit();
      batch = writeBatch(db);
      opsInBatch = 0;
    };

    const timestamp = Date.now();
    for (let i = 0; i < allProducts.length; i += CHUNK_SIZE) {
      const chunkIndex = Math.floor(i / CHUNK_SIZE);
      const chunk = allProducts.slice(i, i + CHUNK_SIZE).map(sanitize);
      const docId = `chunk_${String(chunkIndex).padStart(4, '0')}_${timestamp}`;
      const ref = doc(db, 'productsRedGlobal', docId);
      batch.set(ref, { products: chunk });
      opsInBatch++;
      chunksSaved++;
      if (opsInBatch >= BATCH_LIMIT) {
        await commitBatch();
      }
    }

    await commitBatch();

    if (chunksSaved > 0) {
      await this.updateLastUpdate();
      cacheService.delete('api:FIREBASE_PRODUCTS:');
      cacheService.delete('api:FIREBASE_LAST_UPDATE:');
      logger.info(`Products successfully saved to Firebase (${chunksSaved} chunk docs) and cache cleared`, 'productsFirebase');
    } else {
      logger.warn('No products were saved to Firebase; last update not modified', 'productsFirebase');
    }
  },

  async getAllProducts(): Promise<ProductsRedGlobal[]> {
    const cache = cacheService.cacheApiCall<ProductsRedGlobal[]>(
      'FIREBASE_PRODUCTS',
      {},
      API_CACHE_CONFIG.FIREBASE_PRODUCTS.ttl
    );

    return await cache.getOrSet(async () => {
      logger.info('Fetching products from Firebase', 'productsFirebase');

      const snapshot = await getDocs(collection(db, 'productsRedGlobal'))
      const allProducts: ProductsRedGlobal[] = snapshot.docs.flatMap(docSnap => {
        const data: any = docSnap.data();
        if (Array.isArray(data?.products)) {
          return data.products as ProductsRedGlobal[];
        }
        return [data as ProductsRedGlobal];
      });

      const sortedProducts = allProducts.sort((a, b) => a.name.localeCompare(b.name));
      logger.info(`Successfully fetched ${sortedProducts.length} products from Firebase`, 'productsFirebase');

      return sortedProducts;
    });
  },

  async getLastUpdate(): Promise<string> {
    const cache = cacheService.cacheApiCall<string>(
      'FIREBASE_LAST_UPDATE',
      {},
      2 * 60 * 1000
    );

    return await cache.getOrSet(async () => {
      logger.debug('Fetching last update from Firebase', 'productsFirebase');

      const q = query(collection(db, 'lastedUpdatedProducts'), orderBy('lastUpdate', 'desc'), limit(1));
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return ''

      const data = querySnapshot.docs[0].data()
      const lastUpdate = new Date(data.lastUpdate)
      const lastUpdateISO = lastUpdate.toISOString();

      localStorage.setItem('lastUpdate', lastUpdateISO)
      logger.debug(`Last update retrieved: ${lastUpdateISO}`, 'productsFirebase');

      return lastUpdateISO;
    });
  },

  async updateLastUpdate(): Promise<void> {
    try {
      const nowISO = new Date().toISOString();
      localStorage.removeItem('lastUpdate')
      await setDoc(doc(db, 'lastedUpdatedProducts', 'current'), {
        lastUpdate: nowISO
      })
      localStorage.setItem('lastUpdate', nowISO)
    } catch (error) {
      logger.error('Error updating last update', 'productsFirebase', error);
      throw error
    }
  },

  async deleteAllProducts(): Promise<void> {
    try {
      const productsRef = await getDocs(collection(db, 'productsRedGlobal'))

      let batch = writeBatch(db);
      let ops = 0;
      const BATCH_LIMIT = 450;

      for (const document of productsRef.docs) {
        batch.delete(doc(db, 'productsRedGlobal', document.id));
        ops++;
        if (ops >= BATCH_LIMIT) {
          await batch.commit();
          batch = writeBatch(db);
          ops = 0;
        }
      }

      if (ops > 0) {
        await batch.commit();
      }
    } catch (error) {
      logger.error('Error deleting products', 'productsFirebase', error);
      throw error
    }
  },

  async shouldUpdate(): Promise<boolean> {
    const lastUpdate = await this.getLastUpdate()
    if (!lastUpdate) return true
    const now = new Date()
    return getDay(lastUpdate) !== getDay(now.toISOString())
  },
}
