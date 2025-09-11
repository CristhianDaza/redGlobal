import type { StateGlobal } from '@/types/config.d'
import type { ProductsRedGlobal } from '@/types/common.d'
import { defineStore } from 'pinia'
import { productsFirebase } from '@/services/firebase'
import { normalizeString, generateSearchVariations } from '@/utils'
import { useProductsCataProm, useProductsMarpico, useProductsPromos, useProductStockSur } from '@/composable'
import { NotificationService } from '@/components/Notification/NotificationService';

export const useProductsStore = defineStore('products', {
  state: (): StateGlobal => ({
    products: null,
    isLoadingApiPromos: false,
    isLoadingApiMarpico: false,
    isLoadingApiStockSur: false,
    isLoadingApiCataProm: false,
    isLoadingSaveProducts: false,
    lastUpdateProducts: '',
    productsToView: [],
    isUpdating: false,
    isSuccessApiPromos: false,
    isSuccessApiMarpico: false,
    isSuccessApiStockSur: false,
    isSuccessApiCataProm: false,
  }),
  actions: {
    async getAllProducts(isAdminUser = false): Promise<void> {
      try {
        if (isAdminUser) {
          await this.callServices()
        } else {
          this.products = await productsFirebase.getAllProducts()
          this.lastUpdateProducts = await productsFirebase.getLastUpdate()
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

    callServices: async function (forceUpdate = false): Promise<void> {
      const {
        getProductsPromos,
        isLoadingProductsPromosComposable,
        isSuccessProductsPromosComposable
      } = useProductsPromos()
      const {
        getProductsMarpico,
        isLoadingProductsMarpicoComposable,
        isSuccessProductsMarpicoComposable
      } = useProductsMarpico()
      const {
        getProductsStockSur,
        isLoadingProductsStockSurComposable,
        isSuccessProductsStockSurComposable
      } = useProductStockSur()
      const {
        getProductsCataProm,
        isLoadingProductsCataPromComposable,
        isSuccessProductsCataPromComposable
      } = useProductsCataProm()

      const shouldUpdate = await productsFirebase.shouldUpdate()
      this.lastUpdateProducts = await productsFirebase.getLastUpdate()
      if (!shouldUpdate && !forceUpdate) {
        this.products = await productsFirebase.getAllProducts()
        return;
      }

      this.isUpdating = true;
      this.isLoadingApiPromos = isLoadingProductsPromosComposable
      this.isLoadingApiMarpico = isLoadingProductsMarpicoComposable
      this.isLoadingApiStockSur = isLoadingProductsStockSurComposable
      this.isLoadingApiCataProm = isLoadingProductsCataPromComposable
      this.isSuccessApiPromos = isSuccessProductsPromosComposable
      this.isSuccessApiMarpico = isSuccessProductsMarpicoComposable
      this.isSuccessApiStockSur = isSuccessProductsStockSurComposable
      this.isSuccessApiCataProm = isSuccessProductsCataPromComposable

      const results = await Promise.allSettled([
        getProductsPromos(),
        getProductsMarpico(),
        getProductsStockSur(),
        getProductsCataProm(),
      ])

      const productsPromos = results[0].status === 'fulfilled'
        ? results[0].value
        : (console.error('Promos API failed:', results[0].reason), []);
      const productsMarpico = results[1].status === 'fulfilled'
        ? results[1].value
        : (console.error('Marpico API failed:', results[1].reason), []);
      const productsStockSur = results[2].status === 'fulfilled'
        ? results[2].value
        : (console.error('StockSur API failed:', results[2].reason), []);
      const productsCataProm = results[3].status === 'fulfilled'
        ? results[3].value
        : (console.error('CataProm API failed:', results[3].reason), []);

      const allProducts = [
        ...productsPromos,
        ...productsMarpico,
        ...productsStockSur,
        ...productsCataProm
      ].sort((a, b) => a.name.localeCompare(b.name));

      while (
        isLoadingProductsPromosComposable.value ||
        isLoadingProductsMarpicoComposable.value ||
        isLoadingProductsStockSurComposable.value ||
        isLoadingProductsCataPromComposable.value
      ) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      this.isLoadingSaveProducts = true;
      try {
        if (allProducts.length > 0) {
          await productsFirebase.saveProducts(allProducts)
          this.$patch({ products: allProducts })
          this.$patch({ lastUpdateProducts: new Date().toISOString() })
        } else {
          console.warn('No se guardaron productos porque todas las APIs fallaron.')
        }
      } catch (saveError) {
        console.error('Error saving products to Firebase:', saveError);
      } finally {
        this.isLoadingSaveProducts = false;
        this.isUpdating = false;
      }
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
          const searchVariations = generateSearchVariations(query);
          const normalizedName = normalizeString(product.name);
          const normalizedDescription = normalizeString(product.description);
          const normalizedId = normalizeString(product.id);

          const matchesSearch = searchVariations.some(variation => {
            const normalizedVariation = normalizeString(variation);
            return normalizedName.includes(normalizedVariation) ||
              normalizedDescription.includes(normalizedVariation) ||
              normalizedId.includes(normalizedVariation);
          });

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
