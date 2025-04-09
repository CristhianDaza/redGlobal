import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '../config/firebase'
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Establecer loading inicial
  loading.value = true

  // Inicializar el listener de estado de autenticación
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    loading.value = false
  })

  // Verificar el estado inicial de autenticación
  const currentUser = auth.currentUser
  if (currentUser) {
    user.value = currentUser
    loading.value = false
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      error.value = null
      await signOut(auth)
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  const isAuthenticated = () => {
    return !!user.value
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  }
})
