import type { StockSurProduct, StockSurResponse } from '@/types/stocksur.d';

import { apiConfigStockSur } from '@/api';

const isDevelopment = import.meta.env.MODE === 'development';
const proxyUrl = 'https://api.allorigins.win/get?url=';
const apiUrl = `${import.meta.env.VITE_API_STOCKSUR_BASE_URL}/products`;

const PAGE_SIZE = 50;

/**
 * @description Fetch products in batches of PAGE_SIZE.
 * @returns {Promise<StockSurProduct[]>} - All products combined.
 */
export const getAllProductsStockSur = async (): Promise<StockSurProduct[]> => {
  try {
    let firstRequestUrl = `${apiUrl}?auth_token=${import.meta.env.VITE_API_STOCKSUR_TOKEN}&page_size=${PAGE_SIZE}&page_number=1`;

    if (isDevelopment) {
      firstRequestUrl = `${proxyUrl}${encodeURIComponent(firstRequestUrl)}`;
    }

    const firstResponse: StockSurResponse = isDevelopment
      ? await fetch(firstRequestUrl)
          .then(res => res.json())
          .then(data => JSON.parse(data.contents))
      : await apiConfigStockSur.get<StockSurResponse>('/products', {
          params: {
            auth_token: import.meta.env.VITE_API_STOCKSUR_TOKEN,
            page_size: PAGE_SIZE,
            page_number: 1
          }
        }).then(res => res.data);

    if (!firstResponse || !firstResponse.meta) {
      console.error('Failed to fetch initial product data.');
      return [];
    }

    const totalCount = firstResponse.meta.pagination.total_count;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    let allProducts = [...firstResponse.products];

    for (let page = 2; page <= totalPages; page++) {
      let pageUrl = `${apiUrl}?auth_token=${import.meta.env.VITE_API_STOCKSUR_TOKEN}&page_size=${PAGE_SIZE}&page_number=${page}`;

      if (isDevelopment) {
        pageUrl = `${proxyUrl}${encodeURIComponent(pageUrl)}`;
      }

      const pageResponse: StockSurResponse = isDevelopment
        ? await fetch(pageUrl)
            .then(res => res.json())
            .then(data => JSON.parse(data.contents))
        : await apiConfigStockSur.get<StockSurResponse>('/products', {
            params: {
              auth_token: import.meta.env.VITE_API_STOCKSUR_TOKEN,
              page_size: PAGE_SIZE,
              page_number: page
            }
          }).then(res => res.data);

      if (pageResponse?.products) {
        allProducts = [...allProducts, ...pageResponse.products];
      }
    }
    return allProducts;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};
