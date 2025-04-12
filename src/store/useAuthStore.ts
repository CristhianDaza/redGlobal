import { UserRole } from '@/types/common.d'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/config'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth'
import { useUserStore } from '@/store'
import { NotificationService } from '@/components/Notification/NotificationService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<FirebaseUser | null>(null)
  const userStore = useUserStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  loading.value = true
  const router = useRouter()

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    loading.value = false
  })

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
      NotificationService.push({
        title: 'Inicio de sesión exitoso',
        description: 'Has iniciado sesión exitosamente',
        type: 'success'
      })
      await router.push({ name: 'admin' })
      return true
    } catch (e: any) {
      error.value = e.message
      NotificationService.push({
        title: 'Error al iniciar sesión',
        description: 'Hubo un error al iniciar sesión. Por favor, intenta nuevamente.',
        type: 'error'
      })
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
      NotificationService.push({
        title: 'Cierre de sesión exitoso',
        description: 'Has cerrado sesión exitosamente',
        type: 'success'
      })
      await router.push({ name: 'home' })
      return true
    } catch (e: any) {
      error.value = e.message
      NotificationService.push({
        title: 'Error al cerrar sesión',
        description: 'Hubo un error al cerrar sesión. Por favor, intenta nuevamente.',
        type: 'error'
      })
      return false
    } finally {
      loading.value = false
    }
  }

    const isAuthenticated = () => {
    return !!user.value
  }

  const userRole = computed(() => {
    if (!user.value) return null;
    const currentUser = userStore.users.find(u => u.email === user.value?.email);
    return currentUser?.role || null;
  })

  const isAdmin = computed(() => {
    return userRole.value === UserRole.ADMIN;
  })

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    userRole,
    isAdmin
  }
})
