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
import { getDocs, query, collection, where } from 'firebase/firestore'
import { db } from '@/config'
import { usersFirebase } from '@/services/firebase/usersFirebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<FirebaseUser | null>(null)
  const userStore = useUserStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  loading.value = true
  const router = useRouter()

onAuthStateChanged(auth, async (currentUser) => {
  if (currentUser) {
    const userDocs = await getDocs(
      query(collection(db, 'users'),
      where('id', '==', currentUser.uid))
    )

    if (!userDocs.empty) {
      const userData = userDocs.docs[0].data()
      if (!userData.active) {
        await signOut(auth)
        user.value = null
        NotificationService.push({
          title: 'Sesión cerrada',
          description: 'Tu cuenta ha sido desactivada. Contacta al administrador.',
          type: 'warning'
        })
        await router.push({ name: 'home' })
        loading.value = false
        return
      }
    }
  }

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

    await signInWithEmailAndPassword(auth, email.toLowerCase(), password)

    const uid = auth.currentUser?.uid
    const userDocs = await getDocs(
      query(collection(db, 'users'),
      where('id', '==', uid))
    )

    if (userDocs.empty) {
      await signOut(auth)
      error.value = 'Usuario no encontrado'
      NotificationService.push({
        title: 'Error al iniciar sesión',
        description: 'Usuario no encontrado en el sistema.',
        type: 'error'
      })
      return false
    }

    const userData = userDocs.docs[0].data()

    if (!userData.active) {
      await signOut(auth)
      error.value = 'Usuario inactivo'
      NotificationService.push({
        title: 'Acceso denegado',
        description: 'Tu cuenta está inactiva. Contacta al administrador.',
        type: 'error'
      })
      return false
    }

    await usersFirebase.updateLastLogin(uid!)

    NotificationService.push({
      title: 'Inicio de sesión exitoso',
      description: 'Has iniciado sesión exitosamente',
      type: 'success'
    })
    await router.push({ name: 'admin', query: { tab: 'advanced-quotes' } })
    return true

  } catch (e: any) {
    error.value = e.message
    NotificationService.push({
      title: 'Error al iniciar sesión',
      description: 'Credenciales incorrectas. Por favor, intenta nuevamente.',
      type: 'error'
    })
    await router.push({ name: 'home' })
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
      await router.push({ name: 'home' })
    }
  }

    const isAuthenticated = () => {
    return !!user.value
  }

  const userRole = computed(() => {
    if (!user.value) return null;
    const currentUser = userStore.users.find(u => u.email === user.value?.email?.toLowerCase());
    return currentUser?.role || null;
  })

  const isAdmin = computed(() => {
    return userRole.value === UserRole.ADMIN;
  })

  const currenLoggingUser = computed(() => {
    if (!user.value) return null
    const currentUser = userStore.users.find(u => u.email === user.value?.email?.toLowerCase())
    return currentUser || null
  })

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    userRole,
    isAdmin,
    currenLoggingUser
  }
})
