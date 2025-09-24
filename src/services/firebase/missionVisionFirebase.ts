import type { MissionVisionImage } from '@/types/common.d'
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore'
import { db } from '@/config'

export const missionVisionFirebase = {
  async getMissionVisionImages(): Promise<MissionVisionImage[]> {
    try {
      const missionVisionRef = collection(db, 'missionVision')
      const snapshot = await getDocs(missionVisionRef)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          type: data.type,
          imageUrl: data.imageUrl,
          uploadedAt: data.uploadedAt,
          uploadedBy: data.uploadedBy
        }
      })
    } catch (error) {
      console.error('Error getting mission vision images:', error)
      return []
    }
  },

  async getMissionVisionImageByType(type: 'mission' | 'vision'): Promise<MissionVisionImage | null> {
    try {
      const missionVisionRef = collection(db, 'missionVision')
      const q = query(missionVisionRef, where('type', '==', type))
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return null
      }

      const doc = snapshot.docs[0]
      const data = doc.data()
      return {
        id: doc.id,
        type: data.type,
        imageUrl: data.imageUrl,
        uploadedAt: data.uploadedAt,
        uploadedBy: data.uploadedBy
      }
    } catch (error) {
      console.error(`Error getting ${type} image:`, error)
      return null
    }
  },

  async setMissionVisionImage(type: 'mission' | 'vision', imageUrl: string, uploadedBy: string): Promise<void> {
    try {
      const docRef = doc(db, 'missionVision', type)
      await setDoc(docRef, {
        type,
        imageUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy
      })
    } catch (error) {
      console.error(`Error setting ${type} image:`, error)
      throw error
    }
  },

  async deleteMissionVisionImage(type: 'mission' | 'vision'): Promise<void> {
    try {
      const docRef = doc(db, 'missionVision', type)
      await deleteDoc(docRef)
    } catch (error) {
      console.error(`Error deleting ${type} image:`, error)
      throw error
    }
  }
}
