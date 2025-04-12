import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CategoryCard, CategoryCardCreate } from '../types/common'
import { firebaseService } from '../services/firebaseService'
import { NotificationService } from '../components/Notification/NotificationService';

export const useCategoryStore = defineStore('category', () => {
  const categoryCards = ref<CategoryCard[]>([])
  const isLoadingCards = ref(false)

  const getCategoryCards = async () => {
    try {
      isLoadingCards.value = true
      categoryCards.value = await firebaseService.getCategoryCards()
    } catch (error) {
      console.error('Error getting category cards:', error)
      NotificationService.push({
        title: 'Error al cargar las categorías',
        description: 'Hubo un error al cargar las categorías. Por favor, intenta nuevamente.',
        type: 'error'
      })
    } finally {
      isLoadingCards.value = false
    }
  }

  const createCategoryCard = async (card: CategoryCardCreate) => {
    await firebaseService.createCategoryCard(card)
    await getCategoryCards()
    NotificationService.push({
      title: 'Categoría creada',
      description: 'La categoría ha sido creada exitosamente',
      type: 'success'
    })
  }

  const updateCategoryCard = async (id: string, card: Partial<CategoryCard>) => {
    await firebaseService.updateCategoryCard(id, card)
    await getCategoryCards()
    NotificationService.push({
      title: 'Categoría actualizada',
      description: 'La categoría ha sido actualizada exitosamente',
      type: 'success'
    })
  }

  const deleteCategoryCard = async (id: string) => {
    await firebaseService.deleteCategoryCard(id)
    await getCategoryCards()
    NotificationService.push({
      title: 'Categoría eliminada',
      description: 'La categoría ha sido eliminada exitosamente',
      type: 'success'
    })
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
