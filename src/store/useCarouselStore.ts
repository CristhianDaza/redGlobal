import type { CarouselItem } from '@/types/common.d'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { carouselsFirebase } from '@/services/firebase'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useCarouselStore = defineStore('carousel', () => {
  const carousel = ref<CarouselItem[]>()
  const isLoadingCarousel = ref(false)

  const getCarousel = async () => {
    try {
      isLoadingCarousel.value = true
      carousel.value = await carouselsFirebase.getCarousel()
    } catch (error) {
      console.error('Error getting carousel:', error)
      NotificationService.push({
        title: 'Error al cargar el carousel',
        description: 'Hubo un error al cargar el carousel. Intenta nuevamente.',
        type: 'error'
      })
    } finally {
      isLoadingCarousel.value = false
    }
  }

  const createCarousel = async (carousel: CarouselItem) => {
    try {
      await carouselsFirebase.createCarousel(carousel)
      await getCarousel()
      NotificationService.push({
        title: 'Carousel creado',
        description: 'El carousel ha sido creado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating carousel:', error)
      NotificationService.push({
        title: 'Error al crear el carousel',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const updateCarousel = async (id: string, carousel: Partial<CarouselItem>) => {
    try {
      await carouselsFirebase.updateCarousel(id, carousel)
      await getCarousel()
      NotificationService.push({
        title: 'Carousel actualizado',
        description: 'El carousel ha sido actualizado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating carousel:', error)
      NotificationService.push({
        title: 'Error al actualizar el carousel',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const deleteCarousel = async (id: string) => {
    try {
      await carouselsFirebase.deleteCarousel(id)
      await getCarousel()
      NotificationService.push({
        title: 'Carousel eliminado',
        description: 'El carousel ha sido eliminado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting carousel:', error)
      NotificationService.push({
        title: 'Error al eliminar el carousel',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
}

  return {
    carousel,
    isLoadingCarousel,
    getCarousel,
    createCarousel,
    updateCarousel,
    deleteCarousel
  }
})
