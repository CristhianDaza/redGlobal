import { ref } from 'vue'
import { getAllProductsCataProm } from '../api'

export function useProductsCataProm() {
  const isLoadingProductsCataPromComposable = ref(false)
  
  const getProductsCataProm = async () => {
    try {
      isLoadingProductsCataPromComposable.value = true
      return await getAllProductsCataProm()
    } catch (error) {
      console.error('Error in getProducts:', error)
      return error
    } finally {
      isLoadingProductsCataPromComposable.value = false
    }
  }
  
  return {
    isLoadingProductsCataPromComposable,
    getProductsCataProm
  }
}
