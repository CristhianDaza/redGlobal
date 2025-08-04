import type { Catalog } from '@/types/common.d'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { catalogsFirebase } from '@/services/firebase'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useCatalogStore = defineStore('catalog', () => {
  const catalogs = ref<Catalog[]>([])
  const isLoadingCatalogs = ref(false)

  const getCatalogs = async () => {
    try {
      isLoadingCatalogs.value = true
      catalogs.value = await catalogsFirebase.getCatalogs()
    } catch (error) {
      console.error('Error getting category cards:', error)
      NotificationService.push({
        title: 'Error al cargar los catálogos',
        description: 'Hubo un error al cargar los catálogos. Por favor, intenta nuevamente.',
        type: 'error'
      })
    } finally {
      isLoadingCatalogs.value = false
    }
  }

  const createCatalog = async (catalog: Catalog) => {
    try {
      await catalogsFirebase.createCatalog(catalog)
      await getCatalogs()
      NotificationService.push({
        title: 'Catálogo creado',
        description: 'El catálogo ha sido creada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating category card:', error)
      NotificationService.push({
        title: 'Error al crear el catálogo',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const updateCatalog = async (id: string, card: Partial<Catalog>) => {
    try {
      await catalogsFirebase.updateCatalog(id, card)
      await getCatalogs()
      NotificationService.push({
        title: 'Catálogo actualizado',
        description: 'El catálogo ha sido actualizado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating category card:', error)
      NotificationService.push({
        title: 'Error al actualizar el catálogo',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
  }

  const deleteCatalog = async (id: string) => {
    try {
      await catalogsFirebase.deleteCatalog(id)
      await getCatalogs()
      NotificationService.push({
        title: 'Catálogo eliminado',
        description: 'El catálogo ha sido eliminado exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting category card:', error)
      NotificationService.push({
        title: 'Error al eliminar el catálogo',
        description: 'Ocurrió un error. Intenta nuevamente.',
        type: 'error'
      })
    }
}

  return {
    catalogs,
    isLoadingCatalogs,
    getCatalogs,
    createCatalog,
    updateCatalog,
    deleteCatalog
  }
})
