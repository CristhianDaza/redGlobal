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
  
  // CataProm API
  getProductsCataProm,
  isLoadingProductsCataPromComposable,
} from '../composable'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: null,
    isLoadingApiPromos: false,
    isLoadingApiMarpico: false,
    isLoadingApiStockSur: false,
    isLoadingApiCataProm: false,
  }),
  actions: {
    async getAllProducts() {
      this.isLoadingApiPromos = isLoadingProductsPromosComposable
      this.isLoadingApiMarpico = isLoadingProductsMarpicoComposable
      this.isLoadingApiStockSur = isLoadingProductsStockSurComposable
      this.isLoadingApiCataProm = isLoadingProductsCataPromComposable
      
      const [
        productsPromos,
        productsMarpico,
        productsStockSur,
        productsCataProm
      ] = await Promise.all([
        getProductsPromos(),
        getProductsMarpico(),
        getProductsStockSur(),
        getProductsCataProm(),
      ])
      const allProducts = [
        ...productsPromos,
        ...productsMarpico,
        ...productsStockSur,
        ...productsCataProm
      ]
      this.products = allProducts.sort((a, b) => a.name.localeCompare(b.name))
    }
  },
})
