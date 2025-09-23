import { ref, computed } from 'vue';
import { privacyPolicyCloudinary } from '@/services/firebase';
import type { PrivacyPolicyDocument } from '@/services/firebase/privacyPolicyCloudinary';
import { logger } from '@/services/loggerService';

const globalCurrentPolicy = ref<PrivacyPolicyDocument | null>(null);
const globalIsLoading = ref(false);
const globalLastUpdate = ref<Date | null>(null);

export const useGlobalPrivacyPolicy = () => {

  const hasGlobalPolicy = computed(() => globalCurrentPolicy.value !== null);
  const globalPolicyFileName = computed(() => globalCurrentPolicy.value?.fileName || '');

  const loadGlobalPolicy = async (): Promise<void> => {
    try {
      globalIsLoading.value = true;
      logger.info('Cargando política global de privacidad', 'useGlobalPrivacyPolicy');
      
      const policy = await privacyPolicyCloudinary.getCurrentPolicy();
      globalCurrentPolicy.value = policy;
      globalLastUpdate.value = new Date();
      
      logger.info('Política global cargada', 'useGlobalPrivacyPolicy', { 
        hasPolicy: hasGlobalPolicy.value,
        fileName: globalPolicyFileName.value 
      });
    } catch (err) {
      logger.error('Error al cargar política global', 'useGlobalPrivacyPolicy', err);
      globalCurrentPolicy.value = null;
    } finally {
      globalIsLoading.value = false;
    }
  };

  const refreshGlobalPolicy = async (): Promise<void> => {
    logger.info('Refrescando política global', 'useGlobalPrivacyPolicy');
    await loadGlobalPolicy();
  };

  const notifyPolicyUpdated = async (): Promise<void> => {
    logger.info('Notificando actualización de política', 'useGlobalPrivacyPolicy');
    await refreshGlobalPolicy();
  };

  const notifyPolicyDeleted = (): void => {
    logger.info('Notificando eliminación de política', 'useGlobalPrivacyPolicy');
    globalCurrentPolicy.value = null;
    globalLastUpdate.value = new Date();
  };


  const downloadGlobalPolicy = async (): Promise<void> => {
    try {
      if (!globalCurrentPolicy.value) {
        throw new Error('No hay política disponible para descargar');
      }

      logger.info('Iniciando descarga de política global', 'useGlobalPrivacyPolicy');
      
      const downloadUrl = globalCurrentPolicy.value.downloadUrl;
      
      if (downloadUrl) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = globalCurrentPolicy.value.fileName || 'politicas-tratamiento-datos.pdf';
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        logger.info('Descarga de política global iniciada', 'useGlobalPrivacyPolicy');
      } else {
        throw new Error('URL de descarga no disponible');
      }
    } catch (err) {
      logger.error('Error al descargar política global', 'useGlobalPrivacyPolicy', err);
      throw err;
    }
  };

  return {
    globalCurrentPolicy: computed(() => globalCurrentPolicy.value),
    globalIsLoading: computed(() => globalIsLoading.value),
    globalLastUpdate: computed(() => globalLastUpdate.value),
    
    hasGlobalPolicy,
    globalPolicyFileName,
    
    loadGlobalPolicy,
    refreshGlobalPolicy,
    notifyPolicyUpdated,
    notifyPolicyDeleted,
    downloadGlobalPolicy
  };
};
