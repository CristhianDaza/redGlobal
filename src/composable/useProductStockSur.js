import { ref } from 'vue'
import { getAllProductsStockSur } from '../api'

export function useProductStockSur() {
  const isLoadingProductsStockSurComposable = ref(false)
  
  const getProductsStockSur = async () => {
    try {
      isLoadingProductsStockSurComposable.value = true
      return await getAllProductsStockSur()
    } catch (error) {
      console.error('Error in getProducts:', error)
      return error
    } finally {
      isLoadingProductsStockSurComposable.value = false
    }
  }
  
  return {
    isLoadingProductsStockSurComposable,
    getProductsStockSur
  }
}
