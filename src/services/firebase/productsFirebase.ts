import type { ProductsRedGlobal } from '@/types/common.d'
import { collection, doc, getDocs, setDoc, query, orderBy, limit, writeBatch } from 'firebase/firestore'
import { db } from '@/config'
import { getDay } from '@/utils'
import { logger } from '@/services'

const CHUNK_SIZE = 100;
const BATCH_LIMIT = 450;
const sanitize = (obj: any) => JSON.parse(JSON.stringify(obj, (_k, v) => v === undefined ? null : v));

export const productsFirebase = {
  async saveProductsForApi(apiName: string, products: ProductsRedGlobal[]): Promise<{ chunks: number }> {
    logger.info(`Saving ${products.length} products for API '${apiName}' (no cache layer)`, 'productsFirebase');
    if (!apiName) throw new Error('apiName is required');

    if (!products.length) {
      logger.warn(`No products to save for API '${apiName}'. Previous data retained.`, 'productsFirebase');
      return { chunks: 0 };
    }

    await this.deleteProductsForApi(apiName);

    let batch = writeBatch(db);
    let opsInBatch = 0;
    let chunksSaved = 0;
    const timestamp = Date.now();

    const commitBatch = async () => {
      if (opsInBatch === 0) return;
      await batch.commit();
      logger.debug(`Committed batch (${opsInBatch} ops) for API '${apiName}'`, 'productsFirebase');
      batch = writeBatch(db);
      opsInBatch = 0;
    };

    for (let i = 0; i < products.length; i += CHUNK_SIZE) {
      const chunkIndex = Math.floor(i / CHUNK_SIZE);
      const chunk = products.slice(i, i + CHUNK_SIZE).map(sanitize);
      const docId = `api_${apiName}_chunk_${String(chunkIndex).padStart(4, '0')}_${timestamp}`;
      const ref = doc(db, 'productsRedGlobal', docId);
      batch.set(ref, { products: chunk, api: apiName, createdAt: timestamp });
      opsInBatch++;
      chunksSaved++;
      if (opsInBatch >= BATCH_LIMIT) {
        await commitBatch();
      }
    }
    await commitBatch();

    logger.info(`Saved ${chunksSaved} chunk docs for API '${apiName}'`, 'productsFirebase');
    return { chunks: chunksSaved };
  },

  async deleteProductsForApi(apiName: string): Promise<number> {
    const snapshot = await getDocs(collection(db, 'productsRedGlobal'));
    let batch = writeBatch(db);
    let ops = 0;
    let deleted = 0;

    const commitBatch = async () => {
      if (ops === 0) return;
      await batch.commit();
      batch = writeBatch(db);
      ops = 0;
    };

    for (const d of snapshot.docs) {
      const id = d.id;
      if (id.startsWith(`api_${apiName}_chunk_`)) {
        batch.delete(doc(db, 'productsRedGlobal', id));
        ops++;
        deleted++;
        if (ops >= BATCH_LIMIT) {
          await commitBatch();
        }
      }
    }

    await commitBatch();
    if (deleted > 0) {
      logger.debug(`Deleted ${deleted} existing chunk docs for API '${apiName}'`, 'productsFirebase');
    }
    return deleted;
  },

  async hasApiData(apiName: string): Promise<boolean> {
    const snapshot = await getDocs(collection(db, 'productsRedGlobal'));
    return snapshot.docs.some(docSnap => docSnap.id.startsWith(`api_${apiName}_chunk_`) || docSnap.id.startsWith('chunk_'));
  },

  async saveProducts(allProducts: ProductsRedGlobal[]): Promise<void> {
    logger.warn('saveProducts (legacy) called. Prefer saveProductsForApi per API.', 'productsFirebase');
    logger.info(`Saving ${allProducts.length} products to Firebase (legacy full replace, no cache)`, 'productsFirebase');
    await this.deleteAllProducts();

    let batch = writeBatch(db);
    let opsInBatch = 0;
    let chunksSaved = 0;
    const timestamp = Date.now();

    const commitBatch = async () => {
      if (opsInBatch === 0) return;
      await batch.commit();
      logger.debug(`Committed batch with ${opsInBatch} ops (legacy)`, 'productsFirebase');
      batch = writeBatch(db);
      opsInBatch = 0;
    };

    for (let i = 0; i < allProducts.length; i += CHUNK_SIZE) {
      const chunkIndex = Math.floor(i / CHUNK_SIZE);
      const chunk = allProducts.slice(i, i + CHUNK_SIZE).map(sanitize);
      const docId = `chunk_${String(chunkIndex).padStart(4, '0')}_${timestamp}`;
      batch.set(doc(db, 'productsRedGlobal', docId), { products: chunk, legacy: true, createdAt: timestamp });
      opsInBatch++;
      chunksSaved++;
      if (opsInBatch >= BATCH_LIMIT) {
        await commitBatch();
      }
    }
    await commitBatch();

    if (chunksSaved > 0) {
      await this.updateLastUpdate();
      logger.info(`Products successfully saved (legacy) ${chunksSaved} chunks`, 'productsFirebase');
    } else {
      logger.warn('Legacy save produced 0 chunks', 'productsFirebase');
    }
  },

  async getAllProducts(): Promise<ProductsRedGlobal[]> {
    logger.info('Fetching aggregated products from Firebase (no cache)', 'productsFirebase');
    const snapshot = await getDocs(collection(db, 'productsRedGlobal'));

    const docs = snapshot.docs.slice().sort((a, b) => {
      const tsA = Number(a.id.split('_').pop() || 0);
      const tsB = Number(b.id.split('_').pop() || 0);
      return tsA - tsB;
    });

    const map = new Map<string, ProductsRedGlobal>();

    for (const docSnap of docs) {
      const data: any = docSnap.data();
      const arr: ProductsRedGlobal[] = Array.isArray(data?.products) ? data.products : [data as ProductsRedGlobal];
      for (const p of arr) {
          map.set(p.id, p);
      }
    }

    const merged = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    logger.info(`Aggregated ${merged.length} unique products from ${docs.length} chunk docs`, 'productsFirebase');
    return merged;
  },

  async getLastUpdate(): Promise<string> {
    logger.debug('Fetching last update from Firebase (no cache)', 'productsFirebase');

    const q = query(collection(db, 'lastedUpdatedProducts'), orderBy('lastUpdate', 'desc'), limit(1));
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return ''

    const data = querySnapshot.docs[0].data()
    const lastUpdate = new Date(data.lastUpdate).toISOString();

    localStorage.setItem('lastUpdate', lastUpdate)

    logger.debug(`Last update retrieved: ${lastUpdate}`, 'productsFirebase');

    return lastUpdate;
  },

  async updateLastUpdate(): Promise<void> {
    try {
      const nowISO = new Date().toISOString();
      await setDoc(doc(db, 'lastedUpdatedProducts', 'current'), {
        lastUpdate: nowISO
      })
      localStorage.setItem('lastUpdate', nowISO)
      logger.debug('Global last update stored (no cache)', 'productsFirebase');
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
      logger.warn('All product chunks deleted (full wipe)', 'productsFirebase');
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
