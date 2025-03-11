import { apiConfigCatalogProm } from './apiConfig.js';
import { apiService } from '../services/apiService';

export const getAllProductsCataProm = async () => {
  try {
    return await apiService.get(apiConfigCatalogProm, 'rest');
  } catch (error) {
    console.error('❌ Error in getAllProductsCataProm:', error);
    throw error;
  }
}
