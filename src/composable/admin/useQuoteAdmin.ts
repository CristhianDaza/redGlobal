import type { QuoteAdmin } from '@/types/common.d'
import { ref, computed } from 'vue';
import * as XLSX from 'xlsx'
import { useQuoteStore, useAuthStore } from '@/store';
import { useRouter, useRoute } from 'vue-router';
import { NotificationService } from '@/components/Notification/NotificationService.ts';

const quoteStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export function useQuoteAdmin(isAdmin: boolean) {
  const quoteStore = useQuoteStore();
  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();
  const isLoading = ref(false);
  const showQuoteDetailsModal = ref(false);
  const selectedQuote = ref<QuoteAdmin | null>(null);

  const loadQuotes = async () => {
    await quoteStore.getQuotes();
  };

  const filteredQuotes = computed(() => {
    const userEmail = authStore.user?.email
    if (isAdmin) {
      return quoteStore.quotes
    }
    return quoteStore.quotes.filter(quote => quote.userEmail === userEmail)
  })


  const totalQuotes = computed(() => filteredQuotes.value.length);
  const pendingQuotes = computed(() =>
    filteredQuotes.value.filter(q => q.status === quoteStatus.PENDING).length
  );
  const completedQuotes = computed(() =>
    filteredQuotes.value.filter(q => q.status === quoteStatus.COMPLETED).length
  );

  const handleViewQuote = async (quote: QuoteAdmin) => {
    selectedQuote.value = quote;
    showQuoteDetailsModal.value = true;
    await router.replace({ query: { ...route.query, quoteId: quote.id } })
  };

  const handleCloseQuoteDetails = async () => {
    showQuoteDetailsModal.value = false;
    selectedQuote.value = null;
    await router.replace({ query: { ...route.query, quoteId: undefined } });
  };

  const handleOpenQuoteDetails = async (quoteId: string) => {
    const quote = quoteStore.quotes.find(q => q.id === quoteId);
    if (quote) {
      selectedQuote.value = quote;
      showQuoteDetailsModal.value = true;
    } else {
      NotificationService.push({
        title: 'Error al abrir la cotización',
        description: 'No se encontró la cotización solicitada.',
        type: 'error'
      })
      await router.replace({ query: { ...route.query, quoteId: undefined } });
      console.error('Quote not found:', quoteId);
    }
  }

  const handleCompleteQuote = async (quote: QuoteAdmin) => {
    try {
      await quoteStore.updateQuoteStatus(quote.idDoc, quoteStatus.COMPLETED);
      if (selectedQuote.value) {
        selectedQuote.value.status = quoteStatus.COMPLETED;
      }
      await loadQuotes();
    } catch (error) {
      console.error('Error al completar la cotización:', error);
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      isLoading.value = true;
      await quoteStore.deleteQuote(id);
      await loadQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const canDeleteQuote = (quote: QuoteAdmin): boolean => {
    const isCreator = quote.userEmail === authStore.user?.email
    const isPending = quote.status === quoteStatus.PENDING
    const isCompleted = quote.status === quoteStatus.COMPLETED

    return (isCreator && isPending) || (isAdmin && isCompleted)
  }

  const deleteAllCompletedQuotes = async () => {
    isLoading.value = true;
    try {
      await quoteStore.deleteAllCompletedQuotes();
      await loadQuotes();
    } catch (error) {
      NotificationService.push({
        title: 'Error al eliminar cotizaciones',
        description: 'Hubo un error al eliminar las cotizaciones completadas. Por favor, intenta nuevamente.',
        type: 'error'
      });
      console.error('Error al eliminar cotizaciones completadas:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const downloadQuoteSummary = () => {
    if (!filteredQuotes.value.length) {
      NotificationService.push({
        title: 'Sin cotizaciones',
        description: 'No hay cotizaciones para exportar',
        type: 'info'
      });
      return;
    }

    const data = filteredQuotes.value.map(q => ({
      'Fecha': new Date(q.createdAt).toLocaleString(),
      'Nombre': q.userName,
      'Correo': q.userEmail,
      'Estado': q.status === quoteStatus.COMPLETED ? 'Completada' : 'Pendiente',
      'Items': q.items.length,
      'Id': q.id
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    const dayMonthYear = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cotizaciones');

    XLSX.writeFile(workbook, `resumen-cotizaciones-${dayMonthYear}.xlsx`);
  };

  return {
    isLoading,
    showQuoteDetailsModal,
    selectedQuote,
    loadQuotes,
    filteredQuotes,
    totalQuotes,
    pendingQuotes,
    completedQuotes,
    handleViewQuote,
    handleCloseQuoteDetails,
    handleOpenQuoteDetails,
    handleCompleteQuote,
    deleteQuote,
    deleteAllCompletedQuotes,
    downloadQuoteSummary,
    canDeleteQuote,
    quoteStatus
  };
}
