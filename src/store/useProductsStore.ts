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
    filterProducts(query: string, category?: string) {
      if (!query && !category) {
        this.productsToView = this.products || [];
        return;
      }

      this.productsToView = (this.products || []).filter(product => {
        let matchesCategory = true;
        
        // Filtrar por categoría si existe
        if (category) {
          const normalizedCategory = normalizeString(category);
          const productCategories = Array.isArray(product.category) ? 
            product.category : 
            [product.category || ''];
          
          matchesCategory = productCategories.some(cat => 
            normalizeString(cat || '').includes(normalizedCategory)
          );
        }

        // Si no coincide con la categoría o no hay más filtros, retornamos
        if (!matchesCategory || (!query && category)) {
          return matchesCategory;
        }

        // Filtrar por términos de búsqueda
        if (query) {
          const normalizedQuery = normalizeString(query);
          const normalizedName = normalizeString(product.name);
          const normalizedDescription = normalizeString(product.description);

          return normalizedName.includes(normalizedQuery) || 
                 normalizedDescription.includes(normalizedQuery);
        }

        return true;
      });

      console.log('Filtered products:', this.productsToView.length);
    }
  },
  getters: {
    getProductsToView(): ProductsRedGlobal[] {
      return this.productsToView
    },
  },
})
