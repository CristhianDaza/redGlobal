import type { ProductsRedGlobal } from '../types/common';

import { apiConfigCatalogProm } from './apiConfig';
import { apiService } from '../services/apiService';

/**
 * @description Get all products from CataProm API
 * @returns Promise with list of products transformed to common Product format
 */
export const getAllProductsCataProm = async (): Promise<ProductsRedGlobal[]> => {
  try {
    return await apiService.get<ProductsRedGlobal>(apiConfigCatalogProm, 'rest');
  } catch (error) {
    console.error('Error in getAllProductsCataProm:', error);
    throw error;
  }
};
