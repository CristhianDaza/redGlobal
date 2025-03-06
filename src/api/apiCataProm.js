import { apiConfigCatalogProm } from './apiConfig.js';
import { apiService } from '../services/apiService';

export const getProducts = async () => {
  try {
    return await apiService.get(apiConfigCatalogProm, 'rest');
  } catch (error) {
    console.error('❌ Error in getProducts:', error);
    throw error;
  }
}
