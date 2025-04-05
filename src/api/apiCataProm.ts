import type { CataPromCategory, CataPromProduct } from '../types/cataprom';
import { apiConfigCatalogProm } from './apiConfig';
import { apiService } from '../services/apiService';

/**
 * @description Get all categories from CataProm API
 * @returns Promise with list of categories
 */
export const getCategoriesCataProm = async (): Promise<CataPromCategory[]> => {
  try {
    const categories = await apiService.get<CataPromCategory[]>(apiConfigCatalogProm, 'rest/categorias');
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
export const getProductsByCategory = async (category: string): Promise<CataPromProduct[]> => {
  try {
    const products = await apiService.get<CataPromProduct[]>(apiConfigCatalogProm, `rest/categorias/${category}/productos`);
    return products.resultado;
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    throw error;
  }
};