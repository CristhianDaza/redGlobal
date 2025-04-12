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

export function useProductStockSur() {
  const isLoadingProductsStockSurComposable = ref<boolean>(false);

  const getProductsStockSur = async (): Promise<ProductsRedGlobal[]> => {
    try {
      isLoadingProductsStockSurComposable.value = true;
      const products = await getAllProductsStockSur() as StockSurProduct[];
      return products.map(product => _normalizeProducts(product));
    } catch (error) {
      console.error('Error in getProducts:', error);
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
      mainImage: images[0]?.urlImage[0] || '@/assets/images/no-image.jpg',
      name: formatText(cleanText(product?.name), true),
      packaging: constructPackingStockSur(product?.packing),
      printing: constructPrintingStockSur(product?.icons),
      tableQuantity: constructTableQuantityStockSur(product.variants),
      totalProducts: constructTotalProductsStockSur(product.variants)
    };
  };

  return {
    isLoadingProductsStockSurComposable,
    getProductsStockSur
  };
}
