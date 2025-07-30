import type { OurClients } from '@/types/common.d'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { firebaseService } from '@/services'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useOurClientsStore = defineStore('ourClients', () => {
  const ourClients = ref<OurClients[]>([])
  const isLoadingOurClients = ref(false)

  const getOurClients = async () => {
    try {
      isLoadingOurClients.value = true
      ourClients.value = await firebaseService.getOurClients()
    } catch (error) {
      console.error('Error getting our clients:', error)
      NotificationService.push({
        title: 'Error al cargar las imágenes de nuestros clientes',
        description: 'Hubo un error al cargar las imágenes de nuestros clientes. Intenta nuevamente más tarde.',
        type: 'error'
      })
    } finally {
      isLoadingOurClients.value = false
    }
  }

  const createOurClient = async (ourClient: OurClients) => {
    try {
      await firebaseService.createOurClient(ourClient)
      await getOurClients()
      NotificationService.push({
        title: 'Imagen de cliente creada',
        description: 'La imagen de cliente ha sido creada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating our client:', error)
      NotificationService.push({
        title: 'Error al crear la imagen de cliente',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const updateOurClient = async (id: string, ourClient: Partial<OurClients>) => {
    try {
      await firebaseService.updateOurClient(id, ourClient)
      await getOurClients()
      NotificationService.push({
        title: 'Imagen de cliente actualizada',
        description: 'La imagen de cliente ha sido actualizada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating our client:', error)
      NotificationService.push({
        title: 'Error al actualizar la imagen de cliente',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const deleteOurClient = async (id: string) => {
    try {
      await firebaseService.deleteOurClient(id)
      await getOurClients()
      NotificationService.push({
        title: 'Imagen de cliente eliminada',
        description: 'La imagen de cliente ha sido eliminada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting our client:', error)
      NotificationService.push({
        title: 'Error al eliminar la imagen de cliente',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
}

  return {
    ourClients,
    isLoadingOurClients,
    getOurClients,
    createOurClient,
    updateOurClient,
    deleteOurClient
  }
})
