import { Catalog } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config'

export const catalogsFirebase = {
  async getCatalogs(): Promise<Catalog[]> {
    try {
      const cardsRef = collection(db, 'catalogs')
      const snapshot = await getDocs(cardsRef)
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
      console.error('Error getting catalogs:', error)
      return []
    }
  },

  async createCatalog(catalog: Catalog) {
    try {
      const cardsRef = collection(db, 'catalogs')
      await addDoc(cardsRef, {
        ...catalog
      })
    } catch (error) {
      console.error('Error creating catalog:', error)
      throw error
    }
  },

  async updateCatalog(id: string, catalog: Partial<Catalog>): Promise<void> {
    try {
      const cardRef = doc(db, 'catalogs', id)
      await updateDoc(cardRef, catalog)
    } catch (error) {
      console.error('Error updating catalog:', error)
      throw error
    }
  },

  async deleteCatalog(id: string): Promise<void> {
    try {
      const cardRef = doc(db, 'catalogs', id)
      await deleteDoc(cardRef)
    } catch (error) {
      console.error('Error deleting catalog: ', error)
      throw error
    }
  },
}
