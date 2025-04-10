import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CategoryCard, CategoryCardCreate } from '../types/common'
import { firebaseService } from '../services/firebaseService'

export const useCategoryStore = defineStore('category', () => {
  const categoryCards = ref<CategoryCard[]>([])
  const isLoadingCards = ref(false)

  const getCategoryCards = async () => {
    try {
      isLoadingCards.value = true
      categoryCards.value = await firebaseService.getCategoryCards()
    } catch (error) {
      console.error('Error getting category cards:', error)
    } finally {
      isLoadingCards.value = false
    }
  }

  const createCategoryCard = async (card: CategoryCardCreate) => {
    await firebaseService.createCategoryCard(card)
    await getCategoryCards()
  }

  const updateCategoryCard = async (id: string, card: Partial<CategoryCard>) => {
    await firebaseService.updateCategoryCard(id, card)
    await getCategoryCards()
  }

  const deleteCategoryCard = async (id: string) => {
    await firebaseService.deleteCategoryCard(id)
    await getCategoryCards()
  }

  return {
    categoryCards,
    isLoadingCards,
    getCategoryCards,
    createCategoryCard,
    updateCategoryCard,
    deleteCategoryCard
  }
})
