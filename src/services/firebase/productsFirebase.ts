import type { ProductsRedGlobal } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '@/config'
import { getDay } from '@/utils'

export const productsFirebase = {
  async saveProducts(allProducts: ProductsRedGlobal[]): Promise<void> {
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
  },

  async getAllProducts(): Promise<ProductsRedGlobal[]> {
    const docRef = await getDocs(collection(db, 'productsRedGlobal'))
    const allProducts = docRef.docs.flatMap(doc => {
      const data = doc.data()
      return data.products || []
    })
    return allProducts.sort((a, b) => a.name.localeCompare(b.name))
  },

  async getLastUpdate(): Promise<string> {
    const querySnapshot = await getDocs(collection(db, 'lastedUpdatedProducts'))
    if (querySnapshot.empty) return ''
    const data = querySnapshot.docs[0].data()
    const lastUpdate = new Date(data.lastUpdate)
    localStorage.setItem('lastUpdate', lastUpdate.toISOString())
    return lastUpdate.toISOString()
  },

  async updateLastUpdate(): Promise<void> {
    try {
      localStorage.removeItem('lastUpdate')
      await addDoc(collection(db, 'lastedUpdatedProducts'), {
        lastUpdate: new Date().toISOString()
      })
      localStorage.setItem('lastUpdate', new Date().toISOString())
    } catch (error) {
      console.error('Error updating last update:', error)
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
      console.error('Error deleting products:', error)
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
