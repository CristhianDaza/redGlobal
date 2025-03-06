export const apiService = {
  get: async (apiInstance, url, params = {}, headers = {}) => {
    try {
      const response = await apiInstance.get(url, { params, headers });
      return response.data;
    } catch (error) {
      console.error(`❌ Error en GET ${url}:`, error);
      throw error;
    }
  },
  
  post: async (apiInstance, url, data = {}, headers = {}) => {
    try {
      const response = await apiInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error(`❌ Error en POST ${url}:`, error);
      throw error;
    }
  },
  
  put: async (apiInstance, url, data = {}, headers = {}) => {
    try {
      const response = await apiInstance.put(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error(`❌ Error en PUT ${url}:`, error);
      throw error;
    }
  },
  
  delete: async (apiInstance, url, params = {}, headers = {}) => {
    try {
      const response = await apiInstance.delete(url, { params, headers });
      return response.data;
    } catch (error) {
      console.error(`❌ Error en DELETE ${url}:`, error);
      throw error;
    }
  }
};
