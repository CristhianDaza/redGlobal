import type { MenuItem } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config'
import { cacheService, API_CACHE_CONFIG, logger } from '@/services'

export const menusFirebase = {
  async getMenu(): Promise<MenuItem[]> {
    const cache = cacheService.cacheApiCall<MenuItem[]>(
      'FIREBASE_MENU',
      {},
      API_CACHE_CONFIG.FIREBASE_MENU.ttl
    );

    return await cache.getOrSet(async () => {
      logger.info('Fetching menu from Firebase', 'menusFirebase');
      
      const docRef = await getDocs(collection(db, 'menu'))
      const menu = docRef.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as MenuItem[]
      
      const sortedMenu = menu.sort((a, b) => a.order - b.order);
      logger.info(`Successfully fetched ${sortedMenu.length} menu items from Firebase`, 'menusFirebase');
      
      return sortedMenu;
    });
  },

  async createMenuItem(menuItem: MenuItem): Promise<void> {
    const { id, ...menuData } = menuItem
    await addDoc(collection(db, 'menu'), menuData)
    
    cacheService.delete('api:FIREBASE_MENU:');
    logger.info('Menu item created and cache cleared', 'menusFirebase');
  },

  async updateMenuItem(menuItem: MenuItem): Promise<void> {
    const { id, ...menuData } = menuItem
    const menuRef = doc(db, 'menu', id)
    await updateDoc(menuRef, menuData)
    
    cacheService.delete('api:FIREBASE_MENU:');
    logger.info('Menu item updated and cache cleared', 'menusFirebase');
  },

  async deleteMenuItem(id: string): Promise<void> {
    const menuRef = doc(db, 'menu', id)
    await deleteDoc(menuRef)
    
    cacheService.delete('api:FIREBASE_MENU:');
    logger.info('Menu item deleted and cache cleared', 'menusFirebase');
  },
}
