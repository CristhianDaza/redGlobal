// src/composables/useQuoteAdmin.ts
import { ref, computed } from 'vue';
import { useQuoteStore } from '@/store/useQuoteStore';
import { NotificationService } from '@/components/Notification/NotificationService';

export interface Quote {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    color: string;
    colorName: string;
    quantity: number;
    maxQuantity: number;
    includeMarking: boolean;
    inkColors?: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const quoteStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export function useQuoteAdmin() {
  const quoteStore = useQuoteStore();
  const isLoading = ref(false);
  const showQuoteDetailsModal = ref(false);
  const selectedQuote = ref<Quote | null>(null);

  const loadQuotes = async () => {
    await quoteStore.getQuotes();
  };

  const filteredQuotes = computed(() => {
    // Suponemos que para este caso filtramos todas las cotizaciones. Si deseas filtrar por usuario, 
    // esta lógica se puede ajustar desde el componente principal.
    return quoteStore.quotes;
  });

  const totalQuotes = computed(() => filteredQuotes.value.length);
  const pendingQuotes = computed(() =>
    filteredQuotes.value.filter(q => q.status === quoteStatus.PENDING).length
  );
  const completedQuotes = computed(() =>
    filteredQuotes.value.filter(q => q.status === quoteStatus.COMPLETED).length
  );

  const handleViewQuote = (quote: Quote) => {
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

  // Función para determinar si se puede eliminar una cotización.
  // Por ejemplo, solo se puede eliminar si la cotización está pendiente.
  const canDeleteQuote = (quote: Quote): boolean => {
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
