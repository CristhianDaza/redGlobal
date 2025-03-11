import { ref } from 'vue'
import { getAllProductsMarpico } from '../api'

export function useProductsMarpico() {
  const isLoadingProductsMarpicoComposable = ref(false)
  
  const getProductsMarpico = async () => {
    try {
      isLoadingProductsMarpicoComposable.value = true
      return await getAllProductsMarpico()
    } catch (error) {
      console.error('Error in getProducts:', error)
      return error
    } finally {
      isLoadingProductsMarpicoComposable.value = false
    }
  }
  
  return {
    isLoadingProductsMarpicoComposable,
    getProductsMarpico
  }
}
