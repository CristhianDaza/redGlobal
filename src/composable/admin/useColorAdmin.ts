import type { ColorItem } from '@/types/common.d'
import { computed, ref } from 'vue'
import { useColorStore } from '@/store'

export function useColorAdmin() {
  const colorStore = useColorStore()
  const isLoadingColor = ref(false)
  const showColorModal = ref(false)
  const editingColor = ref<ColorItem | undefined>(undefined)

  const color = computed(() => colorStore.color as unknown as ColorItem[])

  const loadColor = async () => {
    isLoadingColor.value = true
    await colorStore.getColor()
    isLoadingColor.value = false
  }

  const handleAddColor = () => {
    editingColor.value = undefined
    showColorModal.value = true
  }

  const handleEditColor = (color: ColorItem) => {
    editingColor.value = color;
    showColorModal.value = true;
  }

  const handleSaveColor = async (colorData: ColorItem) => {
    try {
      isLoadingColor.value = true;
      if (editingColor.value) {
        await colorStore.updateColor(editingColor.value.id, colorData);
      } else {
        await colorStore.createColor(colorData);
      }
      showColorModal.value = false;
      editingColor.value = undefined;
    } catch (error) {
      console.error('Error saving color:', error);
    } finally {
      isLoadingColor.value = false;
    }
  }

  const deleteColor = async (id: string) => {
    try {
      isLoadingColor.value = true;
      await colorStore.deleteColor(id);
      await loadColor();
    } catch (error) {
      console.error('Error deleting color:', error);
    } finally {
      isLoadingColor.value = false;
    }
  }


  return {
    isLoadingColor,
    showColorModal,
    editingColor,
    color,
    loadColor,
    handleAddColor,
    handleEditColor,
    handleSaveColor,
    deleteColor
  }
}
