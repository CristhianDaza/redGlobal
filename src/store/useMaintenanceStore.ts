import { defineStore } from 'pinia';
import { ref } from 'vue';
import { maintenanceFirebase } from '@/services/firebase'

export const useMaintenanceStore = defineStore('maintenance', () => {
  const isMaintenanceMode = ref(false);
  const isLoading = ref(false);

  const getMaintenanceMode = async () => {
    isLoading.value = true;
    try {
      isMaintenanceMode.value = await maintenanceFirebase.getMaintenanceMode();
    } catch (error) {
      console.error('Error getting maintenance mode:', error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    isMaintenanceMode,
    getMaintenanceMode,
  }
});
