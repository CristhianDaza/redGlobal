import type { MarpicoProduct, MarpicoResponse } from '@/types/marpico.d';

import { apiConfigMarpico } from '@/api';
import { apiService } from '@/services';

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
