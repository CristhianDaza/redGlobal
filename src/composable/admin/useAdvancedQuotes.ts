import type { Quote, QuoteStatus, QuoteComment } from '@/types/common.d'
import { ref, computed } from 'vue'
import { quotesFirebase } from '@/services/firebase/quotesFirebase'
import { useAuthStore } from '@/store'
import { NotificationService } from '@/components/Notification/NotificationService'

export function useAdvancedQuotes() {
  const authStore = useAuthStore()
  
  // Estados reactivos
  const quotes = ref<Quote[]>([])
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const selectedQuote = ref<Quote | null>(null)
  const quoteComments = ref<QuoteComment[]>([])
  const quoteStats = ref({
    total: 0,
    byStatus: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
    avgValue: 0,
    conversionRate: 0
  })

  // Computadas
  const currentUser = computed(() => authStore.currenLoggingUser)
  
  const quotesTotals = computed(() => {
    const total = quotes.value.length
    const pending = quotes.value.filter(q => q.status === 'pending').length
    const completed = quotes.value.filter(q => q.status === 'completed').length
    const inReview = quotes.value.filter(q => q.status === 'in_review').length
    const quoted = quotes.value.filter(q => q.status === 'quoted').length
    const negotiating = quotes.value.filter(q => q.status === 'negotiating').length
    const approved = quotes.value.filter(q => q.status === 'approved').length
    const cancelled = quotes.value.filter(q => q.status === 'cancelled').length
    const expired = quotes.value.filter(q => q.status === 'expired').length

    return {
      total,
      pending,
      completed,
      inReview,
      quoted,
      negotiating,
      approved,
      cancelled,
      expired
    }
  })

  // Funciones principales
  const loadQuotes = async () => {
    try {
      isLoading.value = true
      quotes.value = await quotesFirebase.getQuotes()
    } catch (error) {
      console.error('Error loading quotes:', error)
      NotificationService.push({
        title: 'Error al cargar cotizaciones',
        description: 'No se pudieron cargar las cotizaciones. Intenta nuevamente.',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const loadQuoteStats = async () => {
    try {
      quoteStats.value = await quotesFirebase.getQuoteStats()
    } catch (error) {
      console.error('Error loading quote stats:', error)
    }
  }

  const updateQuoteStatus = async (quoteId: string, status: QuoteStatus, notes?: string) => {
    try {
      isUpdating.value = true
      const changedBy = currentUser.value?.name || 'Admin'
      
      await quotesFirebase.updateQuoteStatus(quoteId, status, notes, changedBy)
      
      // Actualizar el estado local
      const quoteIndex = quotes.value.findIndex(q => q.id === quoteId)
      if (quoteIndex !== -1) {
        quotes.value[quoteIndex].status = status
        quotes.value[quoteIndex].updatedAt = new Date().toISOString()
      }

      NotificationService.push({
        title: 'Estado actualizado',
        description: `La cotización ha sido actualizada a ${status}`,
        type: 'success'
      })

      // Recargar estadísticas
      await loadQuoteStats()
    } catch (error) {
      console.error('Error updating quote status:', error)
      NotificationService.push({
        title: 'Error al actualizar estado',
        description: 'No se pudo actualizar el estado de la cotización.',
        type: 'error'
      })
    } finally {
      isUpdating.value = false
    }
  }

  const updateQuotePriority = async (quoteId: string, priority: string) => {
    try {
      isUpdating.value = true
      const updatedBy = currentUser.value?.name || 'Admin'
      
      // Encontrar la cotización para obtener el idDoc
      const quote = quotes.value.find(q => q.id === quoteId)
      if (!quote) {
        throw new Error('Cotización no encontrada')
      }
      
      await quotesFirebase.updateQuoteField(quote.idDoc, 'priority', priority, updatedBy)
      
      // Actualizar el estado local
      const quoteIndex = quotes.value.findIndex(q => q.id === quoteId)
      if (quoteIndex !== -1) {
        quotes.value[quoteIndex].priority = priority as any
        quotes.value[quoteIndex].updatedAt = new Date().toISOString()
      }

      NotificationService.push({
        title: 'Prioridad actualizada',
        description: `La prioridad ha sido actualizada a ${priority}`,
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating quote priority:', error)
      NotificationService.push({
        title: 'Error al actualizar prioridad',
        description: 'No se pudo actualizar la prioridad de la cotización.',
        type: 'error'
      })
    } finally {
      isUpdating.value = false
    }
  }

  const updateQuoteField = async (quoteId: string, field: string, value: any) => {
    try {
      isUpdating.value = true
      const updatedBy = currentUser.value?.name || 'Admin'
      
      // Encontrar la cotización para obtener el idDoc
      const quote = quotes.value.find(q => q.id === quoteId)
      if (!quote) {
        throw new Error('Cotización no encontrada')
      }
      
      await quotesFirebase.updateQuoteField(quote.idDoc, field, value, updatedBy)
      
      // Actualizar el estado local
      const quoteIndex = quotes.value.findIndex(q => q.id === quoteId)
      if (quoteIndex !== -1) {
        ;(quotes.value[quoteIndex] as any)[field] = value
        quotes.value[quoteIndex].updatedAt = new Date().toISOString()
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
    } finally {
      isUpdating.value = false
    }
  }

  const deleteQuote = async (quoteId: string) => {
    try {
      isUpdating.value = true
      await quotesFirebase.deleteQuote(quoteId)
      
      // Remover del estado local
      quotes.value = quotes.value.filter(q => q.id !== quoteId)

      NotificationService.push({
        title: 'Cotización eliminada',
        description: 'La cotización ha sido eliminada exitosamente',
        type: 'success'
      })

      // Recargar estadísticas
      await loadQuoteStats()
    } catch (error) {
      console.error('Error deleting quote:', error)
      NotificationService.push({
        title: 'Error al eliminar cotización',
        description: 'No se pudo eliminar la cotización.',
        type: 'error'
      })
    } finally {
      isUpdating.value = false
    }
  }

  // Funciones de comentarios
  const loadQuoteComments = async (quoteId: string) => {
    try {
      quoteComments.value = await quotesFirebase.getQuoteComments(quoteId)
    } catch (error) {
      console.error('Error loading quote comments:', error)
    }
  }

  const addQuoteComment = async (quoteId: string, comment: string, isInternal: boolean) => {
    try {
      const commentData = {
        quoteId,
        userId: currentUser.value?.id || '',
        userName: currentUser.value?.name || 'Admin',
        comment,
        isInternal
      }

      await quotesFirebase.addQuoteComment(quoteId, commentData)
      
      // Recargar comentarios
      await loadQuoteComments(quoteId)

      NotificationService.push({
        title: 'Comentario agregado',
        description: 'El comentario ha sido agregado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error adding quote comment:', error)
      NotificationService.push({
        title: 'Error al agregar comentario',
        description: 'No se pudo agregar el comentario.',
        type: 'error'
      })
    }
  }

  // Funciones de búsqueda y filtrado
  const searchQuotes = async (searchTerm: string) => {
    try {
      isLoading.value = true
      quotes.value = await quotesFirebase.searchQuotes(searchTerm)
    } catch (error) {
      console.error('Error searching quotes:', error)
      NotificationService.push({
        title: 'Error en la búsqueda',
        description: 'No se pudo realizar la búsqueda de cotizaciones.',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const getQuotesByStatus = async (status: QuoteStatus) => {
    try {
      isLoading.value = true
      quotes.value = await quotesFirebase.getQuotesByStatus(status)
    } catch (error) {
      console.error('Error getting quotes by status:', error)
      NotificationService.push({
        title: 'Error al filtrar cotizaciones',
        description: 'No se pudieron filtrar las cotizaciones por estado.',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const getQuotesByUser = async (userId: string) => {
    try {
      isLoading.value = true
      quotes.value = await quotesFirebase.getQuotesByUser(userId)
    } catch (error) {
      console.error('Error getting quotes by user:', error)
      NotificationService.push({
        title: 'Error al filtrar cotizaciones',
        description: 'No se pudieron filtrar las cotizaciones por usuario.',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  // Funciones de exportación
  const exportQuotes = async (filters?: {
    status?: QuoteStatus;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    try {
      const exportData = await quotesFirebase.exportQuotes(filters)
      
      // Convertir a CSV
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

  // Funciones auxiliares
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

  // Funciones de utilidad
  const setSelectedQuote = (quote: Quote | null) => {
    selectedQuote.value = quote
    if (quote) {
      loadQuoteComments(quote.id)
    }
  }

  const refreshData = async () => {
    await Promise.all([
      loadQuotes(),
      loadQuoteStats()
    ])
  }

  return {
    // Estados
    quotes,
    isLoading,
    isUpdating,
    selectedQuote,
    quoteComments,
    quoteStats,
    quotesTotals,
    
    // Funciones principales
    loadQuotes,
    loadQuoteStats,
    updateQuoteStatus,
    updateQuotePriority,
    updateQuoteField,
    deleteQuote,
    
    // Comentarios
    loadQuoteComments,
    addQuoteComment,
    
    // Búsqueda y filtrado
    searchQuotes,
    getQuotesByStatus,
    getQuotesByUser,
    
    // Exportación
    exportQuotes,
    
    // Utilidades
    setSelectedQuote,
    refreshData
  }
}
