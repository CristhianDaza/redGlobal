import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types/common'
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
    } finally {
      isLoadingUsers.value = false
    }
  }

  const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }) => {
    try {
      await firebaseService.createUser(user)
      await getUsers()
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const updateUser = async (id: string, user: Partial<User>) => {
    try {
      await firebaseService.updateUser(id, user)
      await getUsers()
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await firebaseService.deleteUser(id)
      await getUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
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
