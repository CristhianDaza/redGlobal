import { apiConfigPromos } from './apiConfig.js';
import { apiService } from '../services/apiService';

const userData = {
  user: import.meta.env.VITE_API_PROMOS_USER,
  password: import.meta.env.VITE_API_PROMOS_PASSWORD
};

/**
 * @description This POST request is used to obtain the Stock list of all active products. It is displayed by Products, Stock and Warehouse.
 * @returns {Promise<unknown>}
 */
export const getAllStock = async () => {
  try {
    return await apiService.post(apiConfigPromos, 'all-stocks', userData);
  } catch (error) {
    console.log('❌ Error in getAllStock:', error);
    throw error;
  }
};

/**
 * @description This POST request is used to obtain the Stock list of a specific product. It is displayed by product, stock and warehouse.
 * @param {string} sku - Product SKU
 * @returns {Promise<unknown>}
 */
export const getProductStock = async (sku) => {
  try {
    return await apiService.post(apiConfigPromos, 'all-stocks', { ...userData, sku });
  } catch (error) {
    console.log('❌ Error in getProductStock:', error);
    throw error;
  }
};
