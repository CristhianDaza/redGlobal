import type { HeroImage } from '@/types/common.d'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { firebaseService } from '@/services'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useHeroStore = defineStore('hero', () => {
  const hero = ref<HeroImage[]>()
  const isLoadingHero = ref(false)

  const getHero = async () => {
    try {
      isLoadingHero.value = true
      hero.value = await firebaseService.getHero()
    } catch (error) {
      console.error('Error getting hero:', error)
      NotificationService.push({
        title: 'Error al cargar la imagen principal',
        description: 'Hubo un error al cargar la imagen principal. Por favor, intenta nuevamente.',
        type: 'error'
      })
    } finally {
      isLoadingHero.value = false
    }
  }

  const createHero = async (hero: HeroImage) => {
    try {
      await firebaseService.createHero(hero)
      await getHero()
      NotificationService.push({
        title: 'Imagen principal creada',
        description: 'La imagen principal ha sido creada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating hero:', error)
      NotificationService.push({
        title: 'Error al crear la imagen principal',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const updateHero = async (id: string, hero: Partial<HeroImage>) => {
    try {
      await firebaseService.updateHero(id, hero)
      await getHero()
      NotificationService.push({
        title: 'Imagen principal actualizada',
        description: 'La imagen principal ha sido actualizada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating hero:', error)
      NotificationService.push({
        title: 'Error al actualizar la imagen principal',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const deleteHero = async (id: string) => {
    try {
      await firebaseService.deleteHero(id)
      await getHero()
      NotificationService.push({
        title: 'Imagen principal eliminada',
        description: 'La imagen principal ha sido eliminada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting hero:', error)
      NotificationService.push({
        title: 'Error al eliminar la imagen principal',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
}

  return {
    hero,
    isLoadingHero,
    getHero,
    createHero,
    updateHero,
    deleteHero
  }
})
