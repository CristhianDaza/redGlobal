import type { MenuItem } from '@/types/common.d';
import { ref, computed } from 'vue';
import { useMenuStore } from '@/store';

export function useMenuAdmin() {
  const menuStore = useMenuStore();
  const isLoading = ref(false);
  const showMenuItemModal = ref(false);
  const editingMenuItem = ref<MenuItem | undefined>(undefined);

  const menuItems = computed(() => menuStore.menu);

  const loadMenu = async () => {
    await menuStore.getMenu();
  };

  const handleAddMenuItem = () => {
    editingMenuItem.value = undefined;
    showMenuItemModal.value = true;
  };

  const handleEditMenuItem = (item: MenuItem) => {
    editingMenuItem.value = item;
    showMenuItemModal.value = true;
  };

  const handleSaveMenuItem = async (menuItem: MenuItem) => {
    try {
      isLoading.value = true;
      if (menuItem.id) {
        await menuStore.updateMenuItem(menuItem);
      } else {
        await menuStore.createMenuItem(menuItem);
      }
      await loadMenu();
      showMenuItemModal.value = false;
      editingMenuItem.value = undefined;
    } catch (error) {
      console.error('Error saving menu item:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      isLoading.value = true;
      await menuStore.deleteMenuItem(id);
      await loadMenu();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    menuItems,
    showMenuItemModal,
    editingMenuItem,
    loadMenu,
    handleAddMenuItem,
    handleEditMenuItem,
    handleSaveMenuItem,
    deleteMenuItem
  };
}
