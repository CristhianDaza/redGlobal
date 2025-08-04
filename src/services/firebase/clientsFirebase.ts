import type { OurClients } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config'

export const clientsFirebase = {
  async getOurClients(): Promise<OurClients[]> {
    try {
      const ourClientsRef = collection(db, 'ourClients')
      const snapshot = await getDocs(ourClientsRef)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          imageUrl: data.imageUrl,
        }
      })
    } catch (error) {
      console.error('Error getting our clients:', error)
      return []
    }
  },

  async createOurClient(client: OurClients) {
    try {
      const ourClientsRef = collection(db, 'ourClients')
      await addDoc(ourClientsRef, {
        ...client
      })
    } catch (error) {
      console.error('Error creating our client:', error)
      throw error
    }
  },

  async updateOurClient(id: string, client: Partial<OurClients>): Promise<void> {
    try {
      const ourClientsRef = doc(db, 'ourClients', id)
      await updateDoc(ourClientsRef, client)
    } catch (error) {
      console.error('Error updating our client:', error)
      throw error
    }
  },

  async deleteOurClient(id: string): Promise<void> {
    try {
      const ourClientsRef = doc(db, 'ourClients', id)
      await deleteDoc(ourClientsRef)
    } catch (error) {
      console.error('Error deleting our client: ', error)
      throw error
    }
  },
}
