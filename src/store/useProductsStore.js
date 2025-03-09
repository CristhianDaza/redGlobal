import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getProducts, isLoadingApiPromos } from '../composable'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    isLoadingApiPromos: ref(false)
  }),
  actions: {
    async getAllProducts() {
      this.products = await getProducts()
      this.isLoadingApiPromos = isLoadingApiPromos
    }
  },
  getters: {
    totalProducts() {
      return this.products.length
    }
  },
})
