import type { StateGlobal } from '../types/config'
import type { ProductsRedGlobal } from '../types/common'

import { defineStore } from 'pinia'
import { firebaseService } from '../services/firebaseService'
import { normalizeString } from '../utils'
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
          this.lastUpdateProducts = await firebaseService.getLastUpdate()
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
      this.lastUpdateProducts = await firebaseService.getLastUpdate()
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
      
      const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
      
      this.productsToView = (this.products || []).filter(product => {
        const normalizedName = normalizeString(product.name);
        const normalizedDescription = normalizeString(product.description);
        const normalizedId = normalizeString(product.id);
        const normalizedCategory = normalizeString(product.category);

        return searchTerms.every(term => {
          const normalizedTerm = normalizeString(term);
          return normalizedName.includes(normalizedTerm) ||
            normalizedDescription.includes(normalizedTerm) ||
            normalizedCategory.includes(normalizedTerm) ||
            normalizedId.includes(normalizedTerm);
        });
      });
    }
  },
  getters: {
    getProductsToView(): ProductsRedGlobal[] {
      return this.productsToView
    },
  },
})
