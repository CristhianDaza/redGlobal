import type { Catalog } from '@/types/common.d'
import { computed, ref } from 'vue'
import { useCatalogStore } from '@/store'

export function useCatalogAdmin() {
  const catalogStore = useCatalogStore()
  const isLoadingCatalog = ref(false)
  const showCatalogModal = ref(false)
  const editingCatalog = ref<Catalog | undefined>(undefined)

  const catalogs = computed(() => catalogStore.catalogs as unknown as Catalog[])

  const loadCatalogs = async () => {
    isLoadingCatalog.value = true
    await catalogStore.getCatalogs()
    isLoadingCatalog.value = false
  }

  const handleAddCatalog = () => {
    editingCatalog.value = undefined
    showCatalogModal.value = true
  }

  const handleEditCatalog = (catalog: Catalog) => {
    editingCatalog.value = catalog;
    showCatalogModal.value = true;
  }

  const handleSaveCatalog = async (catalogData: Catalog) => {
    try {
      isLoadingCatalog.value = true;
      if (editingCatalog.value) {
        await catalogStore.updateCatalog(editingCatalog.value.id, catalogData);
      } else {
        await catalogStore.createCatalog(catalogData);
      }
      showCatalogModal.value = false;
      editingCatalog.value = undefined;
    } catch (error) {
      console.error('Error saving catalog:', error);
    } finally {
      isLoadingCatalog.value = false;
    }
  }

  const deleteCatalog = async (id: string) => {
    try {
      isLoadingCatalog.value = true;
      await catalogStore.deleteCatalog(id);
      await loadCatalogs();
    } catch (error) {
      console.error('Error deleting catalog:', error);
    } finally {
      isLoadingCatalog.value = false;
    }
  }


  return {
    isLoadingCatalog,
    showCatalogModal,
    editingCatalog,
    catalogs,
    loadCatalogs,
    handleAddCatalog,
    handleEditCatalog,
    handleSaveCatalog,
    deleteCatalog
  }
}
