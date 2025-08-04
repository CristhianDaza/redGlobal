import type { ColorItem } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config'

export const colorFirebase = {
  async getColor(): Promise<ColorItem[]> {
    try {
      const colorRef = collection(db, 'color')
      const snapshot = await getDocs(colorRef)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          hex: data.hex,
        }
      })
    } catch (error) {
      console.error('Error getting our color:', error)
      return []
    }
  },

  async createColor(color: ColorItem) {
    try {
      const colorRef = collection(db, 'color')
      await addDoc(colorRef, {
        ...color
      })
    } catch (error) {
      console.error('Error creating color:', error)
      throw error
    }
  },

  async updateColor(id: string, color: Partial<ColorItem>): Promise<void> {
    try {
      const colorRef = doc(db, 'color', id)
      await updateDoc(colorRef, color)
    } catch (error) {
      console.error('Error updating color:', error)
      throw error
    }
  },

  async deleteColor(id: string): Promise<void> {
    try {
      const colorRef = doc(db, 'color', id)
      await deleteDoc(colorRef)
    } catch (error) {
      console.error('Error deleting color: ', error)
      throw error
    }
  },
}
