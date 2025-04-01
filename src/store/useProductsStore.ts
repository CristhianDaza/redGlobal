import type { StateGlobal } from '../types/config'
import type { ProductsRedGlobal } from '../types/common'

import { defineStore } from 'pinia'
import { firebaseService } from '../services/firebaseService'
import {
  useProductsMarpico,
  useProductsPromos,
  useProductStockSur,
  useProductsCataProm,
} from '../composable'

export const useProductsStore = defineStore('products', {
  state: (): StateGlobal => ({
    products: null,
    isLoadingApiPromos: false,
    isLoadingApiMarpico: false,
    isLoadingApiStockSur: false,
    isLoadingApiCataProm: false,
    isLoadingSaveProducts: false,
    lastUpdateProducts: null,
    productsToView: [],
  }),
  actions: {
    async getAllProducts(isAdminUser = false): Promise<void> {
      try {
        if (isAdminUser) {
          await this._callServices()
        } else {
          this.products = await firebaseService.getAllProducts()
        }
      } catch (error) {
        console.error('Error in getAllProducts:', error)
      }
    },
    
    async _callServices(): Promise<void> {
      const { getProductsPromos, isLoadingProductsPromosComposable } = useProductsPromos()
      const { getProductsMarpico, isLoadingProductsMarpicoComposable } = useProductsMarpico()
      const { getProductsStockSur, isLoadingProductsStockSurComposable } = useProductStockSur()
      const { getProductsCataProm, isLoadingProductsCataPromComposable } = useProductsCataProm()
  
      const shouldUpdate = await firebaseService.shouldUpdate()
      if (!shouldUpdate) {
        this.products = await firebaseService.getAllProducts()
        return
      }

      this.isLoadingApiPromos = isLoadingProductsPromosComposable.value
      this.isLoadingApiMarpico = isLoadingProductsMarpicoComposable.value
      this.isLoadingApiStockSur = isLoadingProductsStockSurComposable.value
      this.isLoadingApiCataProm = isLoadingProductsCataPromComposable.value

      const [productsPromos, productsMarpico, productsStockSur, productsCataProm] = await Promise.all([
        getProductsPromos(),
        getProductsMarpico(),
        getProductsStockSur(),
        getProductsCataProm(),
      ])

      const allProducts = [
        ...productsPromos,
        ...productsMarpico,
        ...productsStockSur,
        ...productsCataProm,
      ].sort((a, b) => a.name.localeCompare(b.name))

      this.isLoadingSaveProducts = true
      await firebaseService.saveProducts(allProducts)
      this.products = allProducts
      this.isLoadingSaveProducts = false
    },

    setProductsToView(products: ProductsRedGlobal[]): void {
      this.productsToView = products
    },
    filterProducts(query: string) {
      if (!query) {
        this.productsToView = this.products || [];
        return;
      }
      
      const searchTerm = query.toLowerCase().trim();
      this.productsToView = (this.products || []).filter(product => {
        const categoryText = Array.isArray(product.category) 
          ? product.category.join(' ') 
          : product.category || '';

        return product.name.toLowerCase().includes(searchTerm) ||
               product.description.toLowerCase().includes(searchTerm) ||
               categoryText.toLowerCase().includes(searchTerm);
      });
    }
  },
  getters: {
    getProductsToView(): ProductsRedGlobal[] {
      return this.productsToView
    },
  },
})
