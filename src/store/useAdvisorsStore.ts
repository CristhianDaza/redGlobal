import type { Advisor } from '@/types/common.d'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { advisorsFirebase } from '@/services/firebase/advisorsFirebase'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useAdvisorsStore = defineStore('advisors', () => {
  const advisors = ref<Advisor[]>([])
  const isLoadingAdvisors = ref(false)

  const getAdvisors = async () => {
    try {
      isLoadingAdvisors.value = true
      advisors.value = await advisorsFirebase.getAdvisors()
    } catch (error) {
      console.error('Error getting advisors:', error)
      NotificationService.push({
        title: 'Error al cargar los asesores',
        description: 'Hubo un error al cargar los asesores. Por favor, intenta nuevamente.',
        type: 'error'
      })
    } finally {
      isLoadingAdvisors.value = false
    }
  }

  const createAdvisor = async (advisor: Advisor) => {
    try {
      await advisorsFirebase.createAdvisor(advisor)
      await getAdvisors()
      NotificationService.push({
        title: 'Asesor creado',
        description: 'El asesor ha sido creado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating advisor:', error)
      NotificationService.push({
        title: 'Error al crear el asesor',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const updateAdvisor = async (id: string, advisor: Partial<Advisor>) => {
    try {
      await advisorsFirebase.updateAdvisor(id, advisor)
      await getAdvisors()
      NotificationService.push({
        title: 'Asesor actualizado',
        description: 'El asesor ha sido actualizado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating advisor:', error)
      NotificationService.push({
        title: 'Error al actualizar el asesor',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const deleteAdvisor = async (id: string) => {
    try {
      await advisorsFirebase.deleteAdvisor(id)
      await getAdvisors()
      NotificationService.push({
        title: 'Asesor eliminado',
        description: 'El asesor ha sido eliminado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting advisor:', error)
      NotificationService.push({
        title: 'Error al eliminar el asesor',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
}

  return {
    advisors,
    isLoadingAdvisors,
    getAdvisors,
    createAdvisor,
    updateAdvisor,
    deleteAdvisor
  }
})
