import type { CategoryCard, CategoryCardCreate } from '@/types/common.d'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { firebaseService } from '@/services'
import { NotificationService } from '@/components/Notification/NotificationService';

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
    try {
      await firebaseService.createCategoryCard(card)
      await getCategoryCards()
      NotificationService.push({
        title: 'Categoría creada',
        description: 'La categoría ha sido creada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating category card:', error)
      NotificationService.push({
        title: 'Error al crear la categoría',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const updateCategoryCard = async (id: string, card: Partial<CategoryCard>) => {
    try {
      await firebaseService.updateCategoryCard(id, card)
      await getCategoryCards()
      NotificationService.push({
        title: 'Categoría actualizada',
        description: 'La categoría ha sido actualizada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating category card:', error)
      NotificationService.push({
        title: 'Error al actualizar la categoría',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const deleteCategoryCard = async (id: string) => {
    try {
      await firebaseService.deleteCategoryCard(id)
      await getCategoryCards()
      NotificationService.push({
        title: 'Categoría eliminada',
        description: 'La categoría ha sido eliminada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting category card:', error)
      NotificationService.push({
        title: 'Error al eliminar la categoría',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
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
