import { ref } from 'vue'
import { getAllProductsPromos } from '../api'

export function useProductsPromos() {
  const isLoadingApiPromos = ref(false)
  
  const getProducts = async () => {
    try {
      isLoadingApiPromos.value = true
      const productsPromo = await getAllProductsPromos()
      isLoadingApiPromos.value = false
      return productsPromo
    } catch (error) {
      console.error('Error in getProducts:', error)
      return error
    }
  }
  
  return {
    isLoadingApiPromos,
    getProducts
  }
}
