import type { CataPromCategory, CataPromProduct, CataPromStock, CataPromProductDetails } from '@/types/cataprom.d';
import { apiConfigCatalogProm } from '@/api';
import { apiService } from '@/services';

/**
 * @description Get all categories from CataProm API
 * @returns Promise with list of categories
 */
export const getCategoriesCataProm = async (): Promise<CataPromCategory[]> => {
  try {
    const categories = await apiService.get<CataPromCategory[]>(apiConfigCatalogProm, 'categorias');
    return categories.resultado;
  } catch (error) {
    console.error('Error in getCategoriesCataProm:', error);
    throw error;
  }
};

/**
 * @description Get products by category from CataProm API
 * @param category - Category name
 * @returns Promise with list of products
 */
export const getProductsByCategoryCataProm = async (category: string): Promise<CataPromProduct[]> => {
  try {
    const products = await apiService.get<CataPromProduct[]>(apiConfigCatalogProm, `categorias/${category}/productos`);
    return products.resultado;
  } catch (error) {
    console.error('Error in getProductsByCategoryCataProm:', error);
    throw error;
  }
};

/**
 * @description Get stock by product from CataProm API
 * @param productId
 * @returns Promise with product details
 */
export const getStockByProductCataProm = async (productId: string): Promise<CataPromStock[]> => {
 try {
  const stock = await apiService.get<CataPromStock>(apiConfigCatalogProm, `stock/${productId}`);
  return stock.resultado;
  } catch (error) {
    console.error('Error in getStockByProduct:', error);
    throw error;
  }
};

/**
 * @description Get product details by ID from CataProm API
 * @param productId
 * @returns Promise with product details
 */
export const getProductByIdCataProm = async (productId: string): Promise<CataPromProductDetails> => {
  try {
    const product = await apiService.get<CataPromProductDetails>(apiConfigCatalogProm, `productos/${productId}`);
    return product.resultado;
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw error;
  }
}
