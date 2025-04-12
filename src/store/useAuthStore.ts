import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '../config/firebase'
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth'
import { useUserStore } from './useUserStore'
import { UserRole } from '../types/common.d'
import { NotificationService } from '../components/Notification/NotificationService'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<FirebaseUser | null>(null)
  const userStore = useUserStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Establecer loading inicial
  loading.value = true
  const router = useRouter()

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
      NotificationService.push({
        title: 'Inicio de sesión exitoso',
        description: 'Has iniciado sesión exitosamente',
        type: 'success'
      })
      router.push({ name: 'admin' })
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
      router.push({ name: 'home' })
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
