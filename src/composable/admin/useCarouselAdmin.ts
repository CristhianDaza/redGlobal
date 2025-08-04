import type { CarouselItem } from '@/types/common.d'
import { computed, ref } from 'vue'
import { useCarouselStore } from '@/store'

export function useCarouselAdmin() {
  const carouselStore = useCarouselStore()
  const isLoadingCarousel = ref(false)
  const showCarouselModal = ref(false)
  const editingCarousel = ref<CarouselItem | undefined>(undefined)

  const carousel = computed(() => carouselStore.carousel as unknown as CarouselItem[])

  const loadCarousel = async () => {
    isLoadingCarousel.value = true
    await carouselStore.getCarousel()
    isLoadingCarousel.value = false
  }

  const handleAddCarousel = () => {
    editingCarousel.value = undefined
    showCarouselModal.value = true
  }

  const handleEditCarousel = (carousel: CarouselItem) => {
    editingCarousel.value = carousel;
    showCarouselModal.value = true;
  }

  const handleSaveCarousel = async (carouselData: CarouselItem) => {
    try {
      isLoadingCarousel.value = true;
      if (editingCarousel.value) {
        await carouselStore.updateCarousel(editingCarousel.value.id, carouselData);
      } else {
        await carouselStore.createCarousel(carouselData);
      }
      showCarouselModal.value = false;
      editingCarousel.value = undefined;
    } catch (error) {
      console.error('Error saving carousel:', error);
    } finally {
      isLoadingCarousel.value = false;
    }
  }

  const deleteCarousel = async (id: string) => {
    try {
      isLoadingCarousel.value = true;
      await carouselStore.deleteCarousel(id);
      await loadCarousel();
    } catch (error) {
      console.error('Error deleting carousel:', error);
    } finally {
      isLoadingCarousel.value = false;
    }
  }


  return {
    isLoadingCarousel,
    showCarouselModal,
    editingCarousel,
    carousel,
    loadCarousel,
    handleAddCarousel,
    handleEditCarousel,
    handleSaveCarousel,
    deleteCarousel,
  }
}
