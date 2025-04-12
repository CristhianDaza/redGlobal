import type { CategoryCard, CategoryCardCreate } from '@/types/common.d';
import { ref, computed } from 'vue';
import { useCategoryStore } from '@/store';
import { NotificationService } from '@/components/Notification/NotificationService';

export function useCategoryAdmin() {
  const categoryStore = useCategoryStore();
  const isLoadingCard = ref(false);
  const showCardModal = ref(false);
  const editingCard = ref<CategoryCard | undefined>(undefined);

  const categoryCards = computed(() => categoryStore.categoryCards as unknown as CategoryCard[]);

  const loadCategoryCards = async () => {
    await categoryStore.getCategoryCards();
  };

  const handleAddCard = () => {
    editingCard.value = undefined;
    showCardModal.value = true;
  };

  const handleEditCard = (card: CategoryCard) => {
    editingCard.value = card;
    showCardModal.value = true;
  };

  const handleSaveCard = async (cardData: CategoryCardCreate) => {
    try {
      isLoadingCard.value = true;
      if (editingCard.value) {
        await categoryStore.updateCategoryCard(editingCard.value.id, cardData);
      } else {
        await categoryStore.createCategoryCard(cardData);
      }
      showCardModal.value = false;
      editingCard.value = undefined;
    } catch (error) {
      console.error('Error saving card:', error);
      alert(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      isLoadingCard.value = false;
    }
  };

  const deleteCategoryCard = async (id: string) => {
    try {
      isLoadingCard.value = true;
      await categoryStore.deleteCategoryCard(id);
      await loadCategoryCards();
    } catch (error) {
      console.error('Error deleting category card:', error);
      NotificationService.push({
        title: 'Error al eliminar la categoría',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      });
    } finally {
      isLoadingCard.value = false;
    }
  };

  return {
    categoryCards,
    isLoadingCard,
    showCardModal,
    editingCard,
    loadCategoryCards,
    handleAddCard,
    handleEditCard,
    handleSaveCard,
    deleteCategoryCard
  };
}
