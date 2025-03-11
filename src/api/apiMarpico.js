import { apiConfigMarpico } from './apiConfig.js';
import { apiService } from '../services/apiService';

/**
 * @description This function is used to obtain the list of all products.
 * @returns {Promise<Object>} List of products.
 */
export const getAllProductsMarpico = async () => {
  try {
    return await apiService.get(apiConfigMarpico, 'materialesAPI');
  } catch (error) {
    console.error('❌ Error in getAllProductsMarpico:', error);
    throw error;
  }
};

/**
 * @description This function is used to obtain the product by its ID.
 * @param {String} id - Product ID
 * @returns {Promise<Object>} Product details.
 */
export const getProductByIdMarpico = async (id) => {
  try {
    return await apiService.get(apiConfigMarpico, 'materialesAPIByProducto', { producto: id });
  } catch (error) {
    console.error(`❌ Error in getProductByIdMarpico (ID: ${id}):`, error);
    throw error;
  }
};
