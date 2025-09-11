import type { StockSurProduct, StockSurResponse } from '@/types/stocksur.d';

import { apiConfigStockSur } from '@/api';

const PAGE_SIZE = 50;

/**
 * @description Fetch products in batches of PAGE_SIZE.
 * @returns {Promise<StockSurProduct[]>} - All products combined.
 */
export const getAllProductsStockSur = async (): Promise<StockSurProduct[]> => {
  try {
    const token = import.meta.env.VITE_API_STOCKSUR_TOKEN;
    if (!token) {
      console.error('El token de autenticación para StockSur no está definido.');
      return [];
    }
    const params = {
      auth_token: token,
      page_size: PAGE_SIZE,
      page_number: 1
    };
    let allProducts: StockSurProduct[] = [];
    if (import.meta.env.DEV) {
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const apiUrl = `${import.meta.env.VITE_API_STOCKSUR_BASE_URL}/products?auth_token=${token}&page_size=${PAGE_SIZE}&page_number=1`;
      const firstResponse: StockSurResponse = await fetch(`${proxyUrl}${encodeURIComponent(apiUrl)}`)
        .then(res => res.json())
        .then(data => JSON.parse(data.contents));
      if (!firstResponse || !firstResponse.meta) {
        console.error('Failed to fetch initial product data (proxy).');
        return [];
      }
      const totalCount = firstResponse.meta.pagination.total_count;
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);
      allProducts = [...firstResponse.products];
      for (let page = 2; page <= totalPages; page++) {
        const pageUrl = `${import.meta.env.VITE_API_STOCKSUR_BASE_URL}/products?auth_token=${token}&page_size=${PAGE_SIZE}&page_number=${page}`;
        const pageResponse: StockSurResponse = await fetch(`${proxyUrl}${encodeURIComponent(pageUrl)}`)
          .then(res => res.json())
          .then(data => JSON.parse(data.contents));
        if (pageResponse?.products) {
          allProducts = [...allProducts, ...pageResponse.products];
        }
      }
    } else {
      const firstResponse: StockSurResponse = await apiConfigStockSur.get<StockSurResponse>('/products', { params }).then(res => res.data);
      if (!firstResponse || !firstResponse.meta) {
        console.error('Failed to fetch initial product data.');
        return [];
      }
      const totalCount = firstResponse.meta.pagination.total_count;
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);
      allProducts = [...firstResponse.products];
      for (let page = 2; page <= totalPages; page++) {
        const pageResponse: StockSurResponse = await apiConfigStockSur.get<StockSurResponse>('/products', {
          params: { ...params, page_number: page }
        }).then(res => res.data);
        if (pageResponse?.products) {
          allProducts = [...allProducts, ...pageResponse.products];
        }
      }
    }
    return allProducts;
  } catch (error) {
    console.error('Error general en getAllProductsStockSur:', error);
    return [];
  }
};
