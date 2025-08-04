import type { ColorItem } from '@/types/common.d'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { colorFirebase } from '@/services/firebase'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useColorStore = defineStore('color', () => {
  const color = ref<ColorItem[]>([])
  const isLoadingColor = ref(false)

  const getColor = async () => {
    try {
      isLoadingColor.value = true
      color.value = await colorFirebase.getColor()
    } catch (error) {
      console.error('Error getting color:', error)
      NotificationService.push({
        title: 'Error al cargar el color principal',
        description: 'Hubo un error al cargar el color principal. Intenta nuevamente.',
        type: 'error'
      })
    } finally {
      isLoadingColor.value = false
    }
  }

  const createColor = async (color: ColorItem) => {
    try {
      await colorFirebase.createColor(color)
      await getColor()
      NotificationService.push({
        title: 'Color principal creado',
        description: 'El color principal ha sido creado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating color:', error)
      NotificationService.push({
        title: 'Error al crear el color principal',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const updateColor = async (id: string, color: Partial<ColorItem>) => {
    try {
      await colorFirebase.updateColor(id, color)
      await getColor()
      NotificationService.push({
        title: 'Color principal actualizado',
        description: 'El color principal ha sido actualizado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating color:', error)
      NotificationService.push({
        title: 'Error al actualizar el color principal',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const deleteColor = async (id: string) => {
    try {
      await colorFirebase.deleteColor(id)
      await getColor()
      NotificationService.push({
        title: 'Imagen de cliente eliminada',
        description: 'La imagen de cliente ha sido eliminada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting color:', error)
      NotificationService.push({
        title: 'Error al eliminar la imagen de cliente',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
}

  return {
    color,
    isLoadingColor,
    getColor,
    createColor,
    updateColor,
    deleteColor
  }
})
