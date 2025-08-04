import type { CategoryCard } from '@/types/common.d'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config'

export const categoriesFirebase = {
  async getCategoryCards(): Promise<CategoryCard[]> {
    try {
      const cardsRef = collection(db, 'categoryCards')
      const snapshot = await getDocs(cardsRef)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          imageUrl: data.imageUrl,
          buttonText: data.buttonText,
          backgroundColor: data.backgroundColor,
          active: data.active ?? true,
          buttonColor: '',
          url: data.url,
          order: 0,
          textColor: data.textColor || '#333333'
        }
      })
    } catch (error) {
      console.error('Error getting category cards:', error)
      return []
    }
  },

  async createCategoryCard(card: Omit<CategoryCard, 'id' | 'buttonColor' | 'order'>): Promise<void> {
    try {
      const cardsRef = collection(db, 'categoryCards')
      await addDoc(cardsRef, {
        ...card,
        active: true
      })
    } catch (error) {
      console.error('Error creating category card:', error)
      throw error
    }
  },

  async updateCategoryCard(id: string, card: Partial<CategoryCard>): Promise<void> {
    try {
      if (card.active === false) {
        const cards = await this.getCategoryCards()
        const currentCard = cards.find(c => c.id === id)
        if (currentCard?.active) {
          const activeCards = cards.filter(c => c.active && c.id !== id)
          if (activeCards.length < 3) {
            throw new Error('Debe haber al menos 3 categorías activas')
          }
        }
      }

      const cardRef = doc(db, 'categoryCards', id)
      await updateDoc(cardRef, card)
    } catch (error) {
      console.error('Error updating category card:', error)
      throw error
    }
  },

  async deleteCategoryCard(id: string): Promise<void> {
    try {
      const cards = await this.getCategoryCards()
      const cardToDelete = cards.find(c => c.id === id)

      if (cardToDelete?.active) {
        const activeCards = cards.filter(c => c.active && c.id !== id)
        if (activeCards.length < 3) {
          throw new Error('No se puede eliminar una categoría activa cuando hay solo 3 activas')
        }
      }

      const cardRef = doc(db, 'categoryCards', id)
      await deleteDoc(cardRef)
    } catch (error) {
      console.error('Error deleting category card:', error)
      throw error
    }
  },
}
