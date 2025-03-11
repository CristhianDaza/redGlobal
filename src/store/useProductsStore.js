import { defineStore } from 'pinia'
import { getProducts, isLoadingProductsComposable } from '../composable'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: null,
    isLoadingApiPromos: false,
  }),
  actions: {
    async getAllProducts() {
      this.isLoadingApiPromos = isLoadingProductsComposable
      this.products = await getProducts()
    }
  },
})
