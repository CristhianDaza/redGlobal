import type { ColorItem } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config'
import { cacheService, API_CACHE_CONFIG, logger } from '@/services'

export const colorFirebase = {
  async getColor(): Promise<ColorItem[]> {
    const cache = cacheService.cacheApiCall<ColorItem[]>(
      'FIREBASE_COLORS',
      {},
      API_CACHE_CONFIG.FIREBASE_COLORS.ttl
    );

    return await cache.getOrSet(async () => {
      try {
        logger.info('Fetching colors from Firebase', 'colorFirebase');
        
        const colorRef = collection(db, 'color')
        const snapshot = await getDocs(colorRef)
        const colors = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            hex: data.hex,
          }
        })
        
        logger.info(`Successfully fetched ${colors.length} colors from Firebase`, 'colorFirebase');
        return colors;
      } catch (error) {
        logger.error('Error getting colors from Firebase', 'colorFirebase', error);
        return []
      }
    });
  },

  async createColor(color: ColorItem) {
    try {
      const colorRef = collection(db, 'color')
      await addDoc(colorRef, {
        ...color
      })
      
      cacheService.delete('api:FIREBASE_COLORS:');
      logger.info('Color created and cache cleared', 'colorFirebase');
    } catch (error) {
      logger.error('Error creating color', 'colorFirebase', error);
      throw error
    }
  },

  async updateColor(id: string, color: Partial<ColorItem>): Promise<void> {
    try {
      const colorRef = doc(db, 'color', id)
      await updateDoc(colorRef, color)
      
      cacheService.delete('api:FIREBASE_COLORS:');
      logger.info('Color updated and cache cleared', 'colorFirebase');
    } catch (error) {
      logger.error('Error updating color', 'colorFirebase', error);
      throw error
    }
  },

  async deleteColor(id: string): Promise<void> {
    try {
      const colorRef = doc(db, 'color', id)
      await deleteDoc(colorRef)
      
      cacheService.delete('api:FIREBASE_COLORS:');
      logger.info('Color deleted and cache cleared', 'colorFirebase');
    } catch (error) {
      logger.error('Error deleting color', 'colorFirebase', error);
      throw error
    }
  },
}
