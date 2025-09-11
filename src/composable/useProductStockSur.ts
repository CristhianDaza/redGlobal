import type { StockSurProduct } from '@/types/stocksur.d';
import type { ProductsRedGlobal } from '@/types/common.d';
import { ref } from 'vue';
import { getAllProductsStockSur } from '@/api';
import {
  cleanText,
  constructCategoryStockSur,
  constructImagesStockSur,
  constructPackingStockSur,
  constructPrintingStockSur,
  constructTableQuantityStockSur,
  constructTotalProductsStockSur,
  formatText,
} from '@/utils';
import { cacheService, API_CACHE_CONFIG, logger } from '@/services';
import noImage from '@/assets/images/no-image.jpg';

export function useProductStockSur() {
  const isLoadingProductsStockSurComposable = ref<boolean>(true);
  const isSuccessProductsStockSurComposable = ref<boolean>(false);

  const getProductsStockSur = async (): Promise<ProductsRedGlobal[]> => {
    const cache = cacheService.cacheApiCall<ProductsRedGlobal[]>(
      'PRODUCTS_STOCKSUR',
      {},
      API_CACHE_CONFIG.PRODUCTS_STOCKSUR.ttl
    );

    try {
      return await cache.getOrSet(async () => {
        logger.info('Fetching products from StockSur API', 'useProductStockSur');
        
        const products = await getAllProductsStockSur() as StockSurProduct[];
        const normalizedProducts = products.map(product => _normalizeProducts(product));
        
        logger.info(`Successfully fetched ${normalizedProducts.length} products from StockSur API`, 'useProductStockSur');
        isSuccessProductsStockSurComposable.value = true;
        return normalizedProducts;
      });
    } catch (error) {
      logger.error('Failed to fetch products from StockSur API', 'useProductStockSur', error);
      isSuccessProductsStockSurComposable.value = false;
      throw error;
    } finally {
      isLoadingProductsStockSurComposable.value = false;
    }
  };

  const _normalizeProducts = (product: StockSurProduct): ProductsRedGlobal => {
    const images = constructImagesStockSur(product.variants);

    return {
      api: 'stockSur',
      category: constructCategoryStockSur(product),
      description: product?.description,
      id: product?.code,
      images: images,
      mainImage: images[0]?.urlImage[0] || noImage,
      name: formatText(cleanText(product?.name), true),
      packaging: constructPackingStockSur(product?.packing),
      printing: constructPrintingStockSur(product?.icons),
      tableQuantity: constructTableQuantityStockSur(product.variants),
      totalProducts: constructTotalProductsStockSur(product.variants)
    };
  };

  return {
    isLoadingProductsStockSurComposable,
    isSuccessProductsStockSurComposable,
    getProductsStockSur
  };
}
