import type { ProductsRedGlobal } from '@/types/common.d';
import type { Stock, PromosProduct } from '@/types/promos.d';
import { ref } from 'vue';
import { getAllProductsPromos, getStockPromos } from '@/api';
import {
  constructImagesPromos,
  constructPackagingPromos,
  constructTableQuantityPromos,
  formatText,
  constructTotalProductsPromos
} from '@/utils';
import { logger } from '@/services';
import noImage from '@/assets/images/no-image.jpg';

export function useProductsPromos() {
  const isLoadingProductsPromosComposable = ref<boolean>(true);
  const isSuccessProductsPromosComposable = ref<boolean>(false);

  const getProductsPromos = async (): Promise<ProductsRedGlobal[]> => {
    try {
      logger.info('Fetching products from Promos API (no cache)', 'useProductsPromos');
      const [
        productsPromos,
        stockPromos
      ] = await Promise.all([
        getAllProductsPromos() as Promise<PromosProduct[]>,
        getStockPromos() as Promise<Stock[]>
      ]);

      const normalizedProducts = productsPromos.map(product => _normalizeProducts(product, stockPromos));
      logger.info(`Successfully fetched ${normalizedProducts.length} products from Promos API`, 'useProductsPromos');

      isSuccessProductsPromosComposable.value = true;
      return normalizedProducts;
    } catch (error) {
      logger.error('Failed to fetch products from Promos API', 'useProductsPromos', error);
      isSuccessProductsPromosComposable.value = false;
      throw error;
    } finally {
      isLoadingProductsPromosComposable.value = false;
    }
  };

  const _normalizeProducts = (
    product: PromosProduct,
    stock: Stock[]
  ): ProductsRedGlobal => {
    return {
      api: 'promos',
      areaPrinting: formatText(product?.impresion?.areaImpresion),
      description: formatText(product?.descripcion),
      discount: null,
      id: product?.skuPadre || '',
      images: constructImagesPromos(product?.hijos, product?.imagenesPadre),
      mainImage: product?.imagenesPadre.length > 0 ? product?.imagenesPadre?.[0] : noImage,
      material: formatText(product?.material),
      name: `${formatText(product?.nombrePadre, true)}${product?.capacidad !== '' ? ` - ${product?.capacidad}` : ''}`,
      packaging: constructPackagingPromos(product?.paquete),
      printing: formatText(product?.impresion?.tecnicaImpresion),
      size: product?.medidas,
      tableQuantity: constructTableQuantityPromos(product?.hijos, stock),
      totalProducts: constructTotalProductsPromos(product?.hijos, stock)
    };
  };

  return {
    isLoadingProductsPromosComposable,
    isSuccessProductsPromosComposable,
    getProductsPromos
  };
}
