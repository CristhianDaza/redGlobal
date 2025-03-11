import { ref } from 'vue'
import { getAllProductsPromos } from '../api'

export function useProductsPromos() {
  const isLoadingProductsComposable = ref(false)
  
  const getProducts = async () => {
    try {
      isLoadingProductsComposable.value = true
      return await getAllProductsPromos()
    } catch (error) {
      console.error('Error in getProducts:', error)
      return error
    } finally {
      isLoadingProductsComposable.value = false
    }
  }
  
  return {
    isLoadingProductsComposable,
    getProducts
  }
}
