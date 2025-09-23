import type { Quote, QuoteItem, QuoteState, User, QuoteStatus as QuoteStatusType, QuoteComment } from '@/types/common.d'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { QuoteStatus } from '@/types/common.d'
import { useAuthStore, useUserStore } from '@/store'
import { emailService } from '@/services'
import { quotesFirebase } from '@/services/firebase'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useQuoteStore = defineStore('quote', () => {
  const authStore = useAuthStore()
  const state = ref<QuoteState>({
    quotes: [],
    currentQuote: [],
    isLoadingQuotes: false,
    lastUpdateQuotes: null
  })

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
    state.value.currentQuote.length
  )

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

  const saveCurrentQuoteToStorage = (isUpdate = false) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value.currentQuote))
      if (isUpdate) return
      NotificationService.push({
        title: 'Producto agregado',
        description: 'El producto ha sido agregado exitosamente a la cotización',
        type: 'success'
      })
    } catch (error ) {
      console.error('Error saving quote to storage:', error)
      NotificationService.push({
        title: 'Error al guardar la cotización',
        description: 'Hubo un error al guardar la cotización. Por favor, intenta nuevamente.',
        type: 'error'
      })
      throw error
    }
  }

  const addItemToQuote = async (item: QuoteItem) => {
    state.value.currentQuote.push(item)
    saveCurrentQuoteToStorage()
  }

  const updateQuoteItem = (index: number, item: Partial<QuoteItem>) => {
    if (index >= 0 && index < state.value.currentQuote.length) {
      state.value.currentQuote[index] = {
        ...state.value.currentQuote[index],
        ...item
      }
      saveCurrentQuoteToStorage(true)
      NotificationService.push({
        title: 'Producto actualizado',
        description: 'El producto ha sido actualizado exitosamente',
        type: 'success'
      })
    }
  }

  const removeQuoteItem = (index: number) => {
    state.value.currentQuote.splice(index, 1)
    saveCurrentQuoteToStorage(true)
    NotificationService.push({
      title: 'Producto eliminado',
      description: 'El producto ha sido eliminado de la cotización',
      type: 'success'
    })
  }

  const clearQuote = (isSend = false) => {
    state.value.currentQuote = []
    localStorage.removeItem(STORAGE_KEY)
    if (isSend) return
    NotificationService.push({
      title: 'Has limpiado la cotización',
      description: 'La cotización ha sido limpiada exitosamente',
      type: 'success'
    })
  }

  const submitQuote = async () => {
    try {
      if (!authStore.user || state.value.currentQuote.length === 0) return

      const userStore = useUserStore()
      const currentUser = userStore.users.find((user: User) => user.email === authStore.user?.email?.toLowerCase())

      const quote: Quote = {
        userId: authStore.user.uid,
        userName: currentUser?.name || 'Usuario',
        userEmail: authStore.user.email?.toLowerCase() || '',
        status: QuoteStatus.PENDING,
        items: [...state.value.currentQuote],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: crypto.randomUUID(),
        idDoc: '',
      }

      const emailData = {
        name: currentUser?.name || 'Usuario',
        email: authStore.user.email?.toLowerCase() || '',
        id: quote.id,
      }

      await emailService.sendQuote(emailData)
      await quotesFirebase.createQuote(quote)
      clearQuote(true)
      NotificationService.push({
        title: 'Cotización enviada',
        description: 'La cotización se ha enviado correctamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error submitting quote:', error)
      NotificationService.push({
        title: 'Error al enviar la cotización',
        description: 'Hubo un error al enviar la cotización. Por favor, intenta nuevamente.',
        type: 'error'
      })
      throw error
    }
  }

  const getQuotes = async () => {
    state.value.isLoadingQuotes = true
    try {
      state.value.quotes = await quotesFirebase.getQuotes()
      state.value.lastUpdateQuotes = new Date().toISOString()
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      state.value.isLoadingQuotes = false
    }
  }

  const updateQuoteStatus = async (id: string, status: QuoteStatus) => {
    try {
      await quotesFirebase.updateQuoteStatus(id, status)
      await getQuotes()
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

    if (quote.userId === currentUser.uid) return true

    const isAdmin = authStore.isAdmin
    return isAdmin && quote.status === QuoteStatus.COMPLETED
  }

  const deleteQuote = async (id: string) => {
    const quote = state.value.quotes.find(q => q.idDoc === id)
    if (!quote) {
      NotificationService.push({
        title: 'Error al eliminar la cotización',
        description: 'No se encontró la cotización. Por favor, intenta nuevamente.',
        type: 'error'
      })
      throw new Error('No se encontró la cotización')
    }

    if (!canDeleteQuote(quote)) {
      NotificationService.push({
        title: 'Error al eliminar la cotización',
        description: 'No tienes permisos para eliminar esta cotización. Por favor, intenta nuevamente.',
        type: 'error'
      })
      throw new Error('No tienes permisos para eliminar esta cotización')
    }

    try {
      await quotesFirebase.deleteQuote(id)
      NotificationService.push({
        title: 'Cotización eliminada',
        description: 'La cotización ha sido eliminada exitosamente',
        type: 'success'
      })
      await getQuotes()
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

  const deleteAllCompletedQuotes = async () => {
    try {
      const completed = state.value.quotes.filter(q => q.status === QuoteStatus.COMPLETED);
      const completedIds = completed.map(q => q.idDoc);

      if (completedIds.length === 0) {
        NotificationService.push({
          title: 'Sin cotizaciones completadas',
          description: 'No hay cotizaciones completadas para eliminar.',
          type: 'info'
        });
        return;
      }

      await quotesFirebase.deleteMultipleQuotes(completedIds);

      NotificationService.push({
        title: 'Cotizaciones eliminadas',
        description: `${completedIds.length} cotizaciones completadas han sido eliminadas.`,
        type: 'success'
      });

      await getQuotes();
    } catch (error) {
      console.error('Error deleting completed quotes:', error);
      NotificationService.push({
        title: 'Error al eliminar',
        description: 'No se pudieron eliminar las cotizaciones completadas.',
        type: 'error'
      });
    }
  };

  const updateQuoteField = async (id: string, field: string, value: any) => {
    try {
      await quotesFirebase.updateQuoteField(id, field, value)
      
      // Actualizar estado local
      const quoteIndex = state.value.quotes.findIndex(q => q.id === id)
      if (quoteIndex !== -1) {
        ;(state.value.quotes[quoteIndex] as any)[field] = value
        state.value.quotes[quoteIndex].updatedAt = new Date().toISOString()
      }
      
      NotificationService.push({
        title: 'Campo actualizado',
        description: `El campo ${field} ha sido actualizado exitosamente`,
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating quote field:', error)
      NotificationService.push({
        title: 'Error al actualizar campo',
        description: 'No se pudo actualizar el campo de la cotización.',
        type: 'error'
      })
    }
  }

  const getQuoteStats = async () => {
    try {
      return await quotesFirebase.getQuoteStats()
    } catch (error) {
      console.error('Error getting quote stats:', error)
      return {
        total: 0,
        byStatus: {},
        byPriority: {},
        avgValue: 0,
        conversionRate: 0
      }
    }
  }

  const searchQuotes = async (searchTerm: string) => {
    try {
      state.value.isLoadingQuotes = true
      const results = await quotesFirebase.searchQuotes(searchTerm)
      state.value.quotes = results
    } catch (error) {
      console.error('Error searching quotes:', error)
      NotificationService.push({
        title: 'Error en la búsqueda',
        description: 'No se pudo realizar la búsqueda de cotizaciones.',
        type: 'error'
      })
    } finally {
      state.value.isLoadingQuotes = false
    }
  }

  const exportQuotes = async (filters?: any) => {
    try {
      const exportData = await quotesFirebase.exportQuotes(filters)
      
      // Convertir a CSV y descargar
      const csvContent = convertQuotesToCSV(exportData)
      downloadCSV(csvContent, 'cotizaciones.csv')

      NotificationService.push({
        title: 'Exportación exitosa',
        description: `Se exportaron ${exportData.length} cotizaciones`,
        type: 'success'
      })
    } catch (error) {
      console.error('Error exporting quotes:', error)
      NotificationService.push({
        title: 'Error al exportar',
        description: 'No se pudieron exportar las cotizaciones.',
        type: 'error'
      })
    }
  }

  const convertQuotesToCSV = (quotes: Quote[]): string => {
    const headers = [
      'ID',
      'Cliente',
      'Email',
      'Estado',
      'Prioridad',
      'Valor Estimado',
      'Fecha Creación',
      'Última Actualización'
    ]

    const rows = quotes.map(quote => [
      quote.id,
      quote.userName,
      quote.userEmail,
      quote.status,
      quote.priority || 'medium',
      quote.estimatedValue || 0,
      quote.createdAt,
      quote.updatedAt
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
    deleteAllCompletedQuotes,
    clearQuote,
    submitQuote,
    getQuotes,
    updateQuoteStatus,
    deleteQuote,
    canDeleteQuote,
    updateQuoteField,
    getQuoteStats,
    searchQuotes,
    exportQuotes
  }
})
