import type { ProductsRedGlobal } from '../types/common';

import { ref } from 'vue';
import { getAllProductsCataProm } from '../api';

export function useProductsCataProm() {
  const isLoadingProductsCataPromComposable = ref<boolean>(false);
  
  const getProductsCataProm = async (): Promise<ProductsRedGlobal[]> => {
    try {
      isLoadingProductsCataPromComposable.value = true;
      return await getAllProductsCataProm();
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    } finally {
      isLoadingProductsCataPromComposable.value = false;
    }
  };
  
  return {
    isLoadingProductsCataPromComposable,
    getProductsCataProm
  };
}
