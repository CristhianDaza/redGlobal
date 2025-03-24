import type { MarpicoProduct, MarpicoResponse } from '../types/marpico';

import { apiConfigMarpico } from './apiConfig';
import { apiService } from '../services/apiService';

/**
 * @description This function is used to obtain the list of all products.
 * @returns Promise with list of products.
 */
export const getAllProductsMarpico = async (): Promise<MarpicoProduct[]> => {
  try {
    const response = await apiService.get<MarpicoResponse>(apiConfigMarpico, 'materialesAPI');
    return response.results;
  } catch (error) {
    console.error('Error in getAllProductsMarpico:', error);
    throw error;
  }
};
