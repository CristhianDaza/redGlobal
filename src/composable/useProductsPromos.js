import { ref } from 'vue'
import { getAllProductsPromos } from '../api'

export function useProductsPromos() {
  const isLoadingProductsPromosComposable = ref(false)
  
  const getProductsPromos = async () => {
    try {
      isLoadingProductsPromosComposable.value = true
      return await getAllProductsPromos()
    } catch (error) {
      console.error('Error in getProducts:', error)
      return error
    } finally {
      isLoadingProductsPromosComposable.value = false
    }
  }
  
  return {
    isLoadingProductsPromosComposable,
    getProductsPromos
  }
}
