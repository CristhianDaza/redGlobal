import type { ProductsRedGlobal} from '@/types/common.d';
import type { MarpicoProduct } from '@/types/marpico.d';
import { ref } from 'vue';
import { getAllProductsMarpico } from '@/api';
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
} from '@/utils';
import noImage from '@/assets/images/no-image.jpg';

export function useProductsMarpico() {
  const isLoadingProductsMarpicoComposable = ref<boolean>(true);
  const isSuccessProductsMarpicoComposable = ref<boolean>(false);

  const getProductsMarpico = async (): Promise<ProductsRedGlobal[]> => {
    try {
      const productsMarpico = await getAllProductsMarpico() as MarpicoProduct[];
      isSuccessProductsMarpicoComposable.value = true;
      return productsMarpico.map<ProductsRedGlobal>(product => _normalizeProducts(product));
    } catch (error) {
      isSuccessProductsMarpicoComposable.value = false;
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
      mainImage: product?.imagen === '' ? noImage : product?.imagen,
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
    isSuccessProductsMarpicoComposable,
    getProductsMarpico
  };
}
