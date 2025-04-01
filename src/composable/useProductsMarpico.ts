import type { ProductsRedGlobal} from '../types/common';
import type { MarpicoProduct } from '../types/marpico';

import { ref } from 'vue';
import { getAllProductsMarpico } from '../api';
import {
  constructCategoryMarpico,
  constructLabelsMarpico,
  constructPackagingMarpico,
  constructTableQuantityMarpico,
  constructTotalProductsMarpico,
  formatText,
  constructSizeMarpico,
  getDiscountsMarpico,
  constructImagesMarpico,
} from '../utils';

export function useProductsMarpico() {
  const isLoadingProductsMarpicoComposable = ref<boolean>(false);
  
  const getProductsMarpico = async (): Promise<ProductsRedGlobal[]> => {
    try {
      isLoadingProductsMarpicoComposable.value = true;
      const productsMarpico = await getAllProductsMarpico() as MarpicoProduct[];
      return productsMarpico.map<ProductsRedGlobal>(product => _normalizeProducts(product));

    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    } finally {
      isLoadingProductsMarpicoComposable.value = false;
    }
  };
  
  const _normalizeProducts = (product: MarpicoProduct): ProductsRedGlobal => {
    return {
      api: 'marpico',
      areaPrinting: product?.area_impresion || '',
      category: constructCategoryMarpico(product),
      description: formatText(product?.descripcion_larga),
      discount: getDiscountsMarpico(product?.materiales),
      id: product?.familia || '',
      images: constructImagesMarpico(product?.materiales) || [],
      labels: constructLabelsMarpico(product),
      mainImage: product?.imagen === '' ? '@/assets/images/no-image.jpg' : product?.imagen,
      material: formatText(product?.material),
      name: formatText(product?.descripcion_comercial),
      packaging: constructPackagingMarpico(product),
      printing: formatText(product?.tecnica_marca_tecnica),
      size: constructSizeMarpico(product),
      tableQuantity: constructTableQuantityMarpico(product?.materiales),
      totalProducts: constructTotalProductsMarpico(product?.materiales)
    };
  };
  
  return {
    isLoadingProductsMarpicoComposable,
    getProductsMarpico
  };
}
