import { apiConfigMarpico } from './apiConfig.js';
import { apiService } from '../services/apiService';

/**
 * @description This function is used to obtain the list of all products.
 * @returns {Promise<Object>} List of products.
 */
export const searchProduct = async () => {
  try {
    return await apiService.get(apiConfigMarpico, 'materialesAPI');
  } catch (error) {
    console.error('❌ Error in searchProduct:', error);
    throw error;
  }
};

/**
 * @description This function is used to obtain the product by its ID.
 * @param {String} id - Product ID
 * @returns {Promise<Object>} Product details.
 */
export const getProductById = async (id) => {
  try {
    return await apiService.get(apiConfigMarpico, 'materialesAPIByProducto', { producto: id });
  } catch (error) {
    console.error(`❌ Error in getProductById (ID: ${id}):`, error);
    throw error;
  }
};
