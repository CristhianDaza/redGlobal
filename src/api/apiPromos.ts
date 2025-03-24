import type { Stock, PromosStock, PromosUserData, PrmosAllProducts, PromosProduct } from '../types/promos';

import { apiConfigPromos } from './apiConfig';
import { apiService } from '../services/apiService';

const userData: PromosUserData = {
  user: import.meta.env.VITE_API_PROMOS_USER,
  password: import.meta.env.VITE_API_PROMOS_PASSWORD
};

/**
 * @description This POST request is used to obtain the Stock list of all active products. It is displayed by Products, Stock and Warehouse.
 * @returns Promise with list of stock items
 */
export const getStockPromos = async (): Promise<Stock[]> => {
  try {
    const response = await apiService.post<PromosStock>(apiConfigPromos, 'all-stocks', userData);
    return response.Stocks;
  } catch (error) {
    console.error('Error in getAllStock:', error);
    throw error;
  }
};

/**
 * @description The POST request is built to obtain the list of all products with their technical data sheet.
 * This information is found at the level of the parent product and only the variants are found at the level of the child product.
 * @returns Promise with list of products
 */
export const getAllProductsPromos = async (): Promise<PromosProduct[]> => {
  try {
    const response =  await apiService.post<PrmosAllProducts>(apiConfigPromos, 'all-products', userData);
    return response.response;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw error;
  }
};
