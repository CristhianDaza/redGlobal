import { defineStore } from 'pinia'
import {
  // Promos API
  getProductsPromos,
  isLoadingProductsPromosComposable,
  
  // Marpico API
  getProductsMarpico,
  isLoadingProductsMarpicoComposable,
} from '../composable'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: null,
    isLoadingApiPromos: false,
    isLoadingApiMarpico: false,
  }),
  actions: {
    async getAllProducts() {
      this.isLoadingApiPromos = isLoadingProductsPromosComposable
      this.isLoadingApiMarpico = isLoadingProductsMarpicoComposable
      
      const productsPromos = await getProductsPromos()
      const productsMarpico = await getProductsMarpico()
      
      this.products = {
        ...productsPromos,
        ...productsMarpico,
      }
    }
  },
})
