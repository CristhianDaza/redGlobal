import type { ProductsRedGlobal } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '@/config'
import { getDay } from '@/utils'
import { cacheService, API_CACHE_CONFIG, logger } from '@/services'

export const productsFirebase = {
  async saveProducts(allProducts: ProductsRedGlobal[]): Promise<void> {
    logger.info(`Saving ${allProducts.length} products to Firebase`, 'productsFirebase');
    
    const batchSize = 500
    await this.deleteAllProducts()

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize).map(product => {
        return JSON.parse(JSON.stringify(product, (_key, value) =>
          value === undefined ? null : value
        ))
      })
      await addDoc(collection(db, 'productsRedGlobal'), { products: batch })
    }
    
    await this.updateLastUpdate()
    
    // Clear cache after saving new products
    cacheService.delete('api:FIREBASE_PRODUCTS:');
    cacheService.delete('api:FIREBASE_LAST_UPDATE:');
    
    logger.info('Products successfully saved to Firebase and cache cleared', 'productsFirebase');
  },

  async getAllProducts(): Promise<ProductsRedGlobal[]> {
    const cache = cacheService.cacheApiCall<ProductsRedGlobal[]>(
      'FIREBASE_PRODUCTS',
      {},
      API_CACHE_CONFIG.FIREBASE_PRODUCTS.ttl
    );

    return await cache.getOrSet(async () => {
      logger.info('Fetching products from Firebase', 'productsFirebase');
      
      const docRef = await getDocs(collection(db, 'productsRedGlobal'))
      const allProducts = docRef.docs.flatMap(doc => {
        const data = doc.data()
        return data.products || []
      })
      
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
      
      const querySnapshot = await getDocs(collection(db, 'lastedUpdatedProducts'))
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
      localStorage.removeItem('lastUpdate')
      await addDoc(collection(db, 'lastedUpdatedProducts'), {
        lastUpdate: new Date().toISOString()
      })
      localStorage.setItem('lastUpdate', new Date().toISOString())
    } catch (error) {
      logger.error('Error updating last update', 'productsFirebase', error);
      throw error
    }
  },

  async deleteAllProducts(): Promise<void> {
    try {
      const productsRef = await getDocs(collection(db, 'productsRedGlobal'))
      const lastUpdateRef = await getDocs(collection(db, 'lastedUpdatedProducts'))

      const deleteLastUpdate = lastUpdateRef.docs.map(document =>
        deleteDoc(doc(db, 'lastedUpdatedProducts', document.id))
      )

      const deleteProducts = productsRef.docs.map(document =>
        deleteDoc(doc(db, 'productsRedGlobal', document.id))
      )

      if (deleteProducts.length === 0 && deleteLastUpdate.length === 0) return

      await Promise.all([...deleteProducts, ...deleteLastUpdate])
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
