import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config'

export const maintenanceFirebase = {
  async getMaintenanceMode(): Promise<boolean> {
    try {
      const docRef = await getDocs(collection(db, 'maintenanceMode'))
      if (docRef.empty) {
        return false
      }
      const data = docRef.docs[0].data()
      return data.isMaintenanceMode || false
    } catch (error) {
      console.error('Error getting maintenance mode:', error)
      return false
    }
  },
}
