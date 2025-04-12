import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, UserFormData } from '../types/common'
import { NotificationService } from '../components/Notification/NotificationService';
import { firebaseService } from '../services/firebaseService'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const isLoadingUsers = ref(false)
  const lastUpdateUsers = ref<string | null>(null)

  const getUsers = async () => {
    try {
      isLoadingUsers.value = true
      const fetchedUsers = await firebaseService.getUsers()
      users.value = fetchedUsers
      lastUpdateUsers.value = new Date().toISOString()
    } catch (error) {
      console.error('Error getting users:', error)
      NotificationService.push({
        title: 'Error al cargar los usuarios',
        description: 'Hubo un error al cargar los usuarios. Por favor, intenta nuevamente.',
        type: 'error'
      })
    } finally {
      isLoadingUsers.value = false
    }
  }

  const createUser = async (user: Omit<UserFormData, 'logo'> & { id: string, logo?: string }) => {
    try {
      await firebaseService.createUser(user)
      await getUsers()
      NotificationService.push({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating user:', error)
      NotificationService.push({
        title: 'Error al crear el usuario',
        description: 'Hubo un error al crear el usuario. Por favor, intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const updateUser = async (id: string, user: Partial<User>) => {
    try {
      await firebaseService.updateUser(id, user)
      await getUsers()
      NotificationService.push({
        title: 'Usuario actualizado',
        description: 'El usuario ha sido actualizado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating user:', error)
      NotificationService.push({
        title: 'Error al actualizar el usuario',
        description: 'Hubo un error al actualizar el usuario. Por favor, intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await firebaseService.deleteUser(id)
      await getUsers()
      NotificationService.push({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      NotificationService.push({
        title: 'Error al eliminar el usuario',
        description: 'Hubo un error al eliminar el usuario. Por favor, intenta nuevamente.',
        type: 'error'
      })
    }
  }

  return {
    users,
    isLoadingUsers,
    lastUpdateUsers,
    getUsers,
    createUser,
    updateUser,
    deleteUser
  }
})
