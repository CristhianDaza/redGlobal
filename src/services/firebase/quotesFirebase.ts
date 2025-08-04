import type { Quote } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '@/config'

export const quotesFirebase = {
  async getQuotes(): Promise<Quote[]> {
    try {
      const quotesRef = collection(db, 'quotes')
      const snapshot = await getDocs(quotesRef)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        idDoc: doc.id,
      })) as Quote[]
    } catch (error) {
      console.error('Error getting quotes:', error)
      return []
    }
  },

  async createQuote(quote: Omit<Quote, 'id'>): Promise<void> {
    try {
      const cleanQuote = JSON.parse(JSON.stringify(quote, (_, value) => {
        return value === undefined ? null : value;
      }));

      await addDoc(collection(db, 'quotes'), cleanQuote);
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  },

  async updateQuoteStatus(id: string, status: string): Promise<void> {
    try {
      const quoteRef = doc(db, 'quotes', id)
      await updateDoc(quoteRef, {
        status,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating quote status:', error)
      throw error
    }
  },

  async deleteQuote(id: string): Promise<void> {
    try {
      const quoteRef = doc(db, 'quotes', id)
      await deleteDoc(quoteRef)
    } catch (error) {
      console.error('Error deleting quote:', error)
      throw error
    }
  },

  async deleteMultipleQuotes(ids: string[]): Promise<void> {
    const batch = writeBatch(db);
    try {
      ids.forEach(id => {
        const docRef = doc(db, 'quotes', id);
        batch.delete(docRef);
      });
      await batch.commit();
    } catch (error) {
      console.error('Error deleting multiple quotes:', error);
      throw error;
    }
  },
}
