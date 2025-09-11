import { Advisor } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config'

export const advisorsFirebase = {
  async getAdvisors(): Promise<Advisor[]> {
    try {
      const advisorsRef = collection(db, 'advisors')
      const snapshot = await getDocs(advisorsRef)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          nombre: data.nombre,
          telefono: data.telefono
        }
      })
    } catch (error) {
      console.error('Error getting advisors:', error)
      return []
    }
  },

  async createAdvisor(advisor: Advisor) {
    try {
      const advisorsRef = collection(db, 'advisors')
      await addDoc(advisorsRef, {
        ...advisor
      })
    } catch (error) {
      console.error('Error creating advisor:', error)
      throw error
    }
  },

  async updateAdvisor(id: string, advisor: Partial<Advisor>): Promise<void> {
    try {
      const advisorRef = doc(db, 'advisors', id)
      await updateDoc(advisorRef, advisor)
    } catch (error) {
      console.error('Error updating advisor:', error)
      throw error
    }
  },

  async deleteAdvisor(id: string): Promise<void> {
    try {
      const advisorRef = doc(db, 'advisors', id)
      await deleteDoc(advisorRef)
    } catch (error) {
      console.error('Error deleting advisor: ', error)
      throw error
    }
  },
}
