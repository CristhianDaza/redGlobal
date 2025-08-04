import type { CarouselItem } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config'

export const carouselsFirebase = {
  async getCarousel(): Promise<CarouselItem[]> {
    try {
      const carouselRef = collection(db, 'carousel')
      const snapshot = await getDocs(carouselRef)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          imageUrl: data.imageUrl,
          toRoute: data.toRoute
        }
      })
    } catch (error) {
      console.error('Error getting carousel:', error)
      return []
    }
  },

  async createCarousel(carousel: CarouselItem) {
    try {
      const carouselRef = collection(db, 'carousel')
      await addDoc(carouselRef, {
        ...carousel
      })
    } catch (error) {
      console.error('Error creating carousel:', error)
      throw error
    }
  },

  async updateCarousel(id: string, carousel: Partial<CarouselItem>): Promise<void> {
    try {
      const carouselRef = doc(db, 'carousel', id)
      await updateDoc(carouselRef, carousel)
    } catch (error) {
      console.error('Error updating carousel', error)
      throw error
    }
  },

  async deleteCarousel(id: string): Promise<void> {
    try {
      const carouselRef = doc(db, 'carousel', id)
      await deleteDoc(carouselRef)
    } catch (error) {
      console.error('Error deleting carousel: ', error)
      throw error
    }
  },
}
