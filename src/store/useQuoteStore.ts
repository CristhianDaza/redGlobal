import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Quote, QuoteItem, QuoteState, User } from '../types/common.d'
import { QuoteStatus } from '../types/common.d'
import { useAuthStore } from './useAuthStore'
import { useUserStore } from './useUserStore'
import { firebaseService } from '../services/firebaseService'
import { NotificationService } from '../components/Notification/NotificationService';

export const useQuoteStore = defineStore('quote', () => {
  const authStore = useAuthStore()
  const state = ref<QuoteState>({
    quotes: [],
    currentQuote: [],
    isLoadingQuotes: false,
    lastUpdateQuotes: null
  })

  // Getters
  const quotes = computed(() => state.value.quotes)
  const currentQuote = computed(() => state.value.currentQuote)
  const isLoadingQuotes = computed(() => state.value.isLoadingQuotes)
  const pendingQuotes = computed(() => 
    state.value.quotes.filter(q => q.status === QuoteStatus.PENDING)
  )
  const completedQuotes = computed(() => 
    state.value.quotes.filter(q => q.status === QuoteStatus.COMPLETED)
  )
  const totalItems = computed(() => 
    state.value.currentQuote.reduce((total, item) => total + item.quantity, 0)
  )

  // Local Storage
  const STORAGE_KEY = 'currentQuote'
  
  const loadCurrentQuoteFromStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        state.value.currentQuote = JSON.parse(stored)
      } catch (error) {
        console.error('Error loading quote from storage:', error)
        state.value.currentQuote = []
      }
      NotificationService.push({
        title: 'Cotización cargada',
        description: 'La cotización ha sido cargada exitosamente',
        type: 'success'
      })
    }
  }

  const saveCurrentQuoteToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value.currentQuote))
    NotificationService.push({
      title: 'Cotización guardada',
      description: 'La cotización ha sido guardada exitosamente',
      type: 'success'
    })
  }

  // Actions
  const addItemToQuote = async (item: QuoteItem) => {
    const existingIndex = state.value.currentQuote.findIndex(
      i => i.productId === item.productId && i.color === item.color
    )

    if (existingIndex >= 0) {
      // Actualizar cantidad si ya existe
      state.value.currentQuote[existingIndex].quantity += item.quantity
      if (state.value.currentQuote[existingIndex].quantity > item.maxQuantity) {
        state.value.currentQuote[existingIndex].quantity = item.maxQuantity
      }
    } else {
      // Agregar nuevo item
      state.value.currentQuote.push(item)
    }

    saveCurrentQuoteToStorage()
    NotificationService.push({
      title: 'Item agregado',
      description: 'El item ha sido agregado exitosamente',
      type: 'success'
    })
  }

  const updateQuoteItem = (index: number, item: Partial<QuoteItem>) => {
    if (index >= 0 && index < state.value.currentQuote.length) {
      state.value.currentQuote[index] = {
        ...state.value.currentQuote[index],
        ...item
      }
      saveCurrentQuoteToStorage()
      NotificationService.push({
        title: 'Item actualizado',
        description: 'El item ha sido actualizado exitosamente',
        type: 'success'
      })
    }
  }

  const removeQuoteItem = (index: number) => {
    state.value.currentQuote.splice(index, 1)
    saveCurrentQuoteToStorage()
    NotificationService.push({
      title: 'Item eliminado',
      description: 'El item ha sido eliminado exitosamente',
      type: 'success'
    })
  }

  const clearQuote = () => {
    state.value.currentQuote = []
    localStorage.removeItem(STORAGE_KEY)
    NotificationService.push({
      title: 'Cotización limpiada',
      description: 'La cotización ha sido limpiada exitosamente',
      type: 'success'
    })
  }

  const submitQuote = async () => {
    if (!authStore.user || state.value.currentQuote.length === 0) return

    const userStore = useUserStore()
    const currentUser = userStore.users.find((user: User) => user.email === authStore.user?.email)

    const quote: Omit<Quote, 'id'> = {
      userId: authStore.user.uid,
      userName: currentUser?.name || 'Usuario',
      userEmail: authStore.user.email || '',
      status: QuoteStatus.PENDING,
      items: [...state.value.currentQuote],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await firebaseService.createQuote(quote)
    clearQuote()
    NotificationService.push({
      title: 'Cotización creada',
      description: 'La cotización ha sido creada exitosamente',
      type: 'success'
    })
  }

  const getQuotes = async () => {
    state.value.isLoadingQuotes = true
    try {
      state.value.quotes = await firebaseService.getQuotes()
      state.value.lastUpdateQuotes = new Date().toISOString()
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      state.value.isLoadingQuotes = false
    }
  }

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      await firebaseService.updateQuoteStatus(id, status)
      await getQuotes() // Recargar las cotizaciones
      NotificationService.push({
        title: 'Cotización actualizada',
        description: 'La cotización ha sido actualizada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating quote status:', error)
      NotificationService.push({
        title: 'Error al actualizar la cotización',
        description: 'Hubo un error al actualizar la cotización. Por favor, intenta nuevamente.',
        type: 'error'
      })
      throw error
    }
  }

  const canDeleteQuote = (quote: Quote) => {
    const currentUser = authStore.user
    if (!currentUser) return false

    // Si es el creador de la cotización
    if (quote.userId === currentUser.uid) return true

    // Si es admin y la cotización está completada
    const isAdmin = authStore.isAdmin
    return isAdmin && quote.status === QuoteStatus.COMPLETED
  }

  const deleteQuote = async (id: string) => {
    const quote = state.value.quotes.find(q => q.id === id)
    if (!quote) throw new Error('Cotización no encontrada')

    if (!canDeleteQuote(quote)) {
      NotificationService.push({
        title: 'Error al eliminar la cotización',
        description: 'No tienes permisos para eliminar esta cotización. Por favor, intenta nuevamente.',
        type: 'error'
      })
      throw new Error('No tienes permisos para eliminar esta cotización')
    }

    try {
      await firebaseService.deleteQuote(id)
      NotificationService.push({
        title: 'Cotización eliminada',
        description: 'La cotización ha sido eliminada exitosamente',
        type: 'success'
      })
      await getQuotes() // Recargar las cotizaciones
    } catch (error) {
      console.error('Error deleting quote:', error)
      NotificationService.push({
        title: 'Error al eliminar la cotización',
        description: 'Hubo un error al eliminar la cotización. Por favor, intenta nuevamente.',
        type: 'error'
      })
      throw error
    }
  }

  // Inicializar
  loadCurrentQuoteFromStorage()

  return {
    quotes,
    currentQuote,
    isLoadingQuotes,
    pendingQuotes,
    completedQuotes,
    totalItems,
    addItemToQuote,
    updateQuoteItem,
    removeQuoteItem,
    clearQuote,
    submitQuote,
    getQuotes,
    updateQuoteStatus,
    deleteQuote,
    canDeleteQuote
  }
})
