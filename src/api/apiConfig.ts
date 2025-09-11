import type { ApiHeaders } from '@/types/config.d'

import axios, { AxiosInstance } from 'axios';

const createApiInstance = (baseURL: string, headers: ApiHeaders = { 'Content-Type': 'application/json' }): AxiosInstance => {
  const instance = axios.create({ baseURL, headers });

  instance.interceptors.response.use(
    response => response,
    error => {
      console.error(`Error en la API (${baseURL}):`, error);
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiConfigMarpico = createApiInstance(import.meta.env.VITE_API_MARPICO_BASE_URL, {
  Authorization: `Api-Key ${import.meta.env.VITE_API_MARPICO_TOKEN}`,
  'Content-Type': 'application/json',
});

export const apiConfigPromos = createApiInstance(import.meta.env.VITE_API_PROMOS_BASE_URL, {
  'Content-Type': 'application/json',
});

export const apiConfigStockSur = createApiInstance(import.meta.env.VITE_API_STOCKSUR_BASE_URL, {
  'Content-Type': 'application/json',
});

export const apiConfigCatalogProm = createApiInstance(
  import.meta.env.VITE_API_CATAPROM_PROXY_URL || import.meta.env.VITE_API_CATAPROM_BASE_URL, 
  {
    'Content-Type': 'application/json',
  }
);
