import type { ProductsRedGlobal } from '../types/common';
import type { Stock, PromosProduct } from '../types/promos';

import { ref } from 'vue';
import { getAllProductsPromos, getStockPromos } from '../api';
import {
  constructImagesPromos,
  constructPackagingPromos,
  constructTableQuantityPromos,
  formatText,
  constructTotalProductsPromos
} from '../utils';

export function useProductsPromos() {
  const isLoadingProductsPromosComposable = ref<boolean>(false);
  
  const getProductsPromos = async (): Promise<ProductsRedGlobal[]> => {
    try {
      isLoadingProductsPromosComposable.value = true;
      const [
        productsPromos,
        stockPromos
      ] = await Promise.all([
        getAllProductsPromos() as Promise<PromosProduct[]>,
        getStockPromos() as Promise<Stock[]>
      ]);
      
      return productsPromos.map(product => _normalizeProducts(product, stockPromos));
    } catch (error) {
      console.error('Error in getProducts:', error);
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
      mainImage: product?.imagenesPadre.length > 0 ? product?.imagenesPadre?.[0] : '@/assets/images/no-image.jpg',
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
    getProductsPromos
  };
}
