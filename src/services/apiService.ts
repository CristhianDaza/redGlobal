import type { ApiParams, ApiHeaders, ApiResponse } from '../types/config';

import { AxiosInstance } from 'axios';

export const apiService = {
  get: async <T>(
    apiInstance: AxiosInstance,
    url: string,
    params: ApiParams = {},
    headers: ApiHeaders = { 'Content-Type': 'application/json' }
  ): Promise<any> => {
    try {
      const response = await apiInstance.get<ApiResponse<T>>(url, { params, headers });
      return response.data;
    } catch (error) {
      console.error(`Error en GET ${url}:`, error);
      throw error;
    }
  },
  
  post: async <T>(
    apiInstance: AxiosInstance,
    url: string,
    data: unknown = {},
    headers: ApiHeaders = { 'Content-Type': 'application/json' },
  ): Promise<any> => {
    try {
      const response = await apiInstance.post<ApiResponse<T>>(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error(`Error en POST ${url}:`, error);
      throw error;
    }
  },
};
