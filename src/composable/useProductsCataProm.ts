import type { CataPromProduct, CataPromCategory } from '@/types/cataprom.d';
import type { ProductsRedGlobal } from '@/types/common.d';
import { ref } from 'vue';
import { constructCategoryCataProm, constructDescriptionCataProm, formatText } from '@/utils';
import { getCategoriesCataProm, getProductsByCategory } from '@/api';

export function useProductsCataProm() {
  const isLoadingProductsCataPromComposable = ref<boolean>(false);

  const getProductsCataProm = async (): Promise<ProductsRedGlobal[]> => {
    try {
      isLoadingProductsCataPromComposable.value = true;
      const excludedCategoryIds = [1];
      const categories = await getCategoriesCataProm();
      const filteredCategories = categories.filter(
        (category) => !excludedCategoryIds.includes(category.id)
      );

      const productsResults = await Promise.allSettled(
        filteredCategories.map((category) =>
          getProductsByCategory(String(category.id))
        )
      );

      const productsArrays = productsResults
        .filter(result => result.status === 'fulfilled')
        .map((result: PromiseFulfilledResult<CataPromProduct[]>) => result.value);

      const allProducts = productsArrays.flat();

      const uniqueProducts = Array.from(
        new Map(allProducts.map(product => [product.id, product])).values()
      );

      return uniqueProducts.map(product => _normalizeProducts(product, categories));
    } catch (error) {
      console.error('Error in getProductsCataProm:', error);
      throw error;
    } finally {
      isLoadingProductsCataPromComposable.value = false;
    }
  };



  const _normalizeProducts = (product: CataPromProduct, categories: CataPromCategory[]): ProductsRedGlobal => {
    return {
      api: 'cataProm',
      category: constructCategoryCataProm(product, categories),
      description: constructDescriptionCataProm(product?.descripcionProducto),
      id: product?.referencia || '',
      mainImage: product?.imageUrl === '' ? '@/assets/images/no-image.jpg' : `https://catalogospromocionales.com${product?.imageUrl}`,
      name: formatText(product?.nombre),
    };
  };

  return {
    isLoadingProductsCataPromComposable,
    getProductsCataProm
  };
}
