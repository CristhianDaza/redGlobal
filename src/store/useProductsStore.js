import { defineStore } from 'pinia'
import {
  // Promos API
  getProductsPromos,
  isLoadingProductsPromosComposable,
  
  // Marpico API
  getProductsMarpico,
  isLoadingProductsMarpicoComposable,
  
  // StockSur API
  getProductsStockSur,
  isLoadingProductsStockSurComposable,
} from '../composable'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: null,
    isLoadingApiPromos: false,
    isLoadingApiMarpico: false,
    isLoadingApiStockSur: false,
  }),
  actions: {
    async getAllProducts() {
      this.isLoadingApiPromos = isLoadingProductsPromosComposable
      this.isLoadingApiMarpico = isLoadingProductsMarpicoComposable
      this.isLoadingApiStockSur = isLoadingProductsStockSurComposable
      
      const [productsPromos, productsMarpico, productsStockSur] = await Promise.all([
        getProductsPromos(),
        getProductsMarpico(),
        getProductsStockSur(),
      ])
      
      this.products = {
        ...productsPromos,
        ...productsMarpico,
        ...productsStockSur,
      }
    }
  },
})
