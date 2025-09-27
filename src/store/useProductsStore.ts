import type { StateGlobal } from '@/types/config.d'
import type { ProductsRedGlobal } from '@/types/common.d'
import { defineStore } from 'pinia'
import { productsFirebase } from '@/services/firebase'
import { normalizeString, generateSearchVariations } from '@/utils'
import { useProductsCataProm, useProductsMarpico, useProductsPromos, useProductStockSur } from '@/composable'
import { NotificationService } from '@/components/Notification/NotificationService';
import { logger } from '@/services';

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
        logger.error('Error in getAllProducts', 'useProductsStore', error);
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

      const apiOrder = [
        { name: 'promos', fetcher: getProductsPromos },
        { name: 'marpico', fetcher: getProductsMarpico },
        { name: 'stocksur', fetcher: getProductsStockSur },
        { name: 'cataprom', fetcher: getProductsCataProm },
      ] as const;

      const results = await Promise.allSettled(apiOrder.map(a => a.fetcher()));

      while (
        isLoadingProductsPromosComposable.value ||
        isLoadingProductsMarpicoComposable.value ||
        isLoadingProductsStockSurComposable.value ||
        isLoadingProductsCataPromComposable.value
      ) {
        await new Promise(response => setTimeout(response, 100));
      }

      this.isLoadingSaveProducts = true;
      const failedApis: string[] = [];
      const emptyApis: string[] = [];
      let savedApis: string[] = [];

      try {
        for (let i = 0; i < results.length; i++) {
          const apiMeta = apiOrder[i];
          const result = results[i];

            if (result.status === 'fulfilled') {
              const products = result.value as ProductsRedGlobal[];
              if (products && products.length > 0) {
                try {
                  const { chunks } = await productsFirebase.saveProductsForApi(apiMeta.name, products);
                  if (chunks > 0) {
                    savedApis.push(apiMeta.name);
                  } else {
                    emptyApis.push(apiMeta.name);
                  }
                } catch (saveErr) {
                  logger.error(`Error saving products for API ${apiMeta.name}`, 'useProductsStore', saveErr);
                  failedApis.push(apiMeta.name);
                }
              } else {
                emptyApis.push(apiMeta.name);
              }
            } else {
              logger.error(`${apiMeta.name} API failed`, 'useProductsStore', result.reason);
              failedApis.push(apiMeta.name);
            }
        }

        if (savedApis.length > 0) {
          await productsFirebase.updateLastUpdate();
          this.lastUpdateProducts = new Date().toISOString();
        }

        this.products = await productsFirebase.getAllProducts();

        if (failedApis.length > 0) {
          NotificationService.push({
            title: 'Actualización parcial de productos',
            description: `Fallaron las APIs: ${failedApis.join(', ')}. Se mantiene la última data disponible de esas fuentes si existía.`,
            type: 'warning',
            duration: 5000
          });
        }
        if (emptyApis.length > 0 && emptyApis.length === apiOrder.length) {
          NotificationService.push({
            title: 'Sin datos nuevos',
            description: 'Ninguna API devolvió productos nuevos. Se mantiene la data anterior.',
            type: 'info',
            duration: 3500
          });
        } else if (savedApis.length > 0) {
          NotificationService.push({
            title: 'Productos actualizados',
            description: `Se actualizaron correctamente: ${savedApis.join(', ')}`,
            type: 'success',
            duration: 4500
          });
        }

      } catch (globalErr) {
        logger.error('Error en actualización parcial de productos', 'useProductsStore', globalErr);
        NotificationService.push({
          title: 'Error al actualizar productos',
                      description: 'Ocurrió un error inesperado durante la actualización parcial.',
          type: 'error'
        });
      } finally {
        this.isLoadingSaveProducts = false;
        this.isUpdating = false;
      }
    },

    async checkShouldUpdate(): Promise<boolean> {
      return await productsFirebase.shouldUpdate();
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
