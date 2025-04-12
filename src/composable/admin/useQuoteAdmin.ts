import type { QuoteAdmin } from '@/types/common.d'
import { ref, computed } from 'vue';
import { useQuoteStore } from '@/store';
import { NotificationService } from '@/components/Notification/NotificationService';

const quoteStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export function useQuoteAdmin() {
  const quoteStore = useQuoteStore();
  const isLoading = ref(false);
  const showQuoteDetailsModal = ref(false);
  const selectedQuote = ref<QuoteAdmin | null>(null);

  const loadQuotes = async () => {
    await quoteStore.getQuotes();
  };

  const filteredQuotes = computed(() => {
    return quoteStore.quotes;
  });

  const totalQuotes = computed(() => filteredQuotes.value.length);
  const pendingQuotes = computed(() =>
    filteredQuotes.value.filter(q => q.status === quoteStatus.PENDING).length
  );
  const completedQuotes = computed(() =>
    filteredQuotes.value.filter(q => q.status === quoteStatus.COMPLETED).length
  );

  const handleViewQuote = (quote: QuoteAdmin) => {
    selectedQuote.value = quote;
    showQuoteDetailsModal.value = true;
  };

  const handleCloseQuoteDetails = () => {
    showQuoteDetailsModal.value = false;
    selectedQuote.value = null;
  };

  const handleCompleteQuote = async (quoteId: string) => {
    try {
      await quoteStore.updateQuoteStatus(quoteId, quoteStatus.COMPLETED);
      if (selectedQuote.value) {
        selectedQuote.value.status = quoteStatus.COMPLETED;
      }
      await loadQuotes();
      NotificationService.push({
        title: 'Cotización completada',
        description: 'La cotización ha sido completada exitosamente',
        type: 'success'
      });
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
      NotificationService.push({
        title: 'Error al eliminar la cotización',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      });
    } finally {
      isLoading.value = false;
    }
  };
  const canDeleteQuote = (quote: QuoteAdmin): boolean => {
    return quote.status === quoteStatus.PENDING;
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
    handleCompleteQuote,
    deleteQuote,
    canDeleteQuote,
    quoteStatus
  };
}
