import type { StateGlobal } from '@/types/config.d'
import type { ProductsRedGlobal } from '@/types/common.d'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { firebaseService } from '@/services'
import { normalizeString } from '@/utils'
import { useProductsCataProm, useProductsMarpico, useProductsPromos, useProductStockSur } from '@/composable'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useProductsStore = defineStore('products', {
  state: (): StateGlobal => ({
    products: null,
    isLoadingApiPromos: false,
    isLoadingApiMarpico: ref<boolean>(false),
    isLoadingApiStockSur: false,
    isLoadingApiCataProm: false,
    isLoadingSaveProducts: false,
    lastUpdateProducts: null,
    productsToView: [],
    isUpdating: false,
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

    _callServices: async function (): Promise<void> {
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
      this.isUpdating = true
      this.isLoadingApiPromos = isLoadingProductsPromosComposable
      this.isLoadingApiMarpico = isLoadingProductsMarpicoComposable
      this.isLoadingApiStockSur = isLoadingProductsStockSurComposable
      this.isLoadingApiCataProm = isLoadingProductsCataPromComposable

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

      while (
        isLoadingProductsPromosComposable.value ||
        isLoadingProductsMarpicoComposable.value ||
        isLoadingProductsStockSurComposable.value ||
        isLoadingProductsCataPromComposable.value
        ) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      this.isLoadingSaveProducts = true
      await firebaseService.saveProducts(allProducts)
      this.products = allProducts
      this.isLoadingSaveProducts = false
      this.isUpdating = false
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

        if (category) {
          const normalizedCategory = normalizeString(category);
          const productCategories = Array.isArray(product.category) ?
            product.category :
            [product.category || ''];

          return productCategories.some(cat => {
            const normalizedCat = normalizeString(cat || '');
            return normalizedCat.includes(normalizedCategory);
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
