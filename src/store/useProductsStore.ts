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
import { NotificationService } from '../components/Notification/NotificationService';

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
        NotificationService.push({
          title: 'Error al cargar los productos',
          description: 'Hubo un error al cargar los productos. Por favor, intenta nuevamente.',
          type: 'error'
        })
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
        // Filtrar por términos de búsqueda primero
        if (query) {
          const normalizedQuery = normalizeString(query);
          const normalizedName = normalizeString(product.name);
          const normalizedDescription = normalizeString(product.description);
          const normalizedId = normalizeString(product.id);

          const matchesSearch = normalizedName.includes(normalizedQuery) || 
            normalizedDescription.includes(normalizedQuery) ||
            normalizedId.includes(normalizedQuery);

          if (!matchesSearch) {
            return false;
          }
        }

        // Luego filtrar por categoría si existe
        if (category) {
          const normalizedCategory = normalizeString(category);
          const productCategories = Array.isArray(product.category) ? 
            product.category : 
            [product.category || ''];
          
          return productCategories.some(cat => {
            const normalizedCat = normalizeString(cat || '');
            const matches = normalizedCat.includes(normalizedCategory);
            return matches;
          });
        }

        return true;
      });
    }
  },
  getters: {
    getProductsToView(): ProductsRedGlobal[] {
      return this.productsToView
    },
  },
})
