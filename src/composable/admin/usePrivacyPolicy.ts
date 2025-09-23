import { ref, computed } from 'vue';
import { privacyPolicyCloudinary } from '@/services/firebase';
import type { PrivacyPolicyDocument } from '@/services/firebase/privacyPolicyCloudinary';
import { logger } from '@/services/loggerService';
import { NotificationService } from '@/components/Notification/NotificationService';
import { useGlobalPrivacyPolicy } from '@/composable/useGlobalPrivacyPolicy';

export const usePrivacyPolicy = () => {
  const currentPolicy = ref<PrivacyPolicyDocument | null>(null);
  const isLoading = ref(false);
  const isUploading = ref(false);
  const error = ref<string | null>(null);

  const { notifyPolicyUpdated, notifyPolicyDeleted } = useGlobalPrivacyPolicy();

  const hasPolicy = computed(() => currentPolicy.value !== null);
  const policyFileName = computed(() => currentPolicy.value?.fileName || '');
  const policyUploadDate = computed(() => {
    if (!currentPolicy.value?.uploadedAt) return '';
    
    const date = currentPolicy.value.uploadedAt.toDate ? 
      currentPolicy.value.uploadedAt.toDate() : 
      new Date(currentPolicy.value.uploadedAt);
    
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  const policyFileSize = computed(() => {
    if (!currentPolicy.value?.fileSize) return '';
    
    const size = currentPolicy.value.fileSize;
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  });

  const reloadPolicyData = async (): Promise<void> => {
    try {
      logger.info('Recargando datos de política de privacidad', 'usePrivacyPolicy');
      currentPolicy.value = await privacyPolicyCloudinary.getCurrentPolicy();
    } catch (err) {
      logger.error('Error al recargar política de privacidad', 'usePrivacyPolicy', err);
    }
  };

  const loadCurrentPolicy = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      
      logger.info('Cargando política de privacidad actual', 'usePrivacyPolicy');
      currentPolicy.value = await privacyPolicyCloudinary.getCurrentPolicy();
      
      logger.info('Política de privacidad cargada', 'usePrivacyPolicy', { 
        hasPolicy: hasPolicy.value,
        fileName: policyFileName.value 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      error.value = `Error al cargar la política: ${errorMessage}`;
      logger.error('Error al cargar política de privacidad', 'usePrivacyPolicy', err);
    } finally {
      isLoading.value = false;
    }
  };

  const uploadPolicy = async (file: File, uploadedBy: string): Promise<boolean> => {
    try {
      isUploading.value = true;
      error.value = null;

      logger.info('Iniciando subida de política de privacidad', 'usePrivacyPolicy', { 
        fileName: file.name,
        uploadedBy 
      });

      const uploadedPolicy = await privacyPolicyCloudinary.uploadPolicy(file, uploadedBy);
      currentPolicy.value = uploadedPolicy;

      await reloadPolicyData();

      logger.info('Política de privacidad subida exitosamente', 'usePrivacyPolicy');
      
      NotificationService.push({
        title: 'Política subida exitosamente',
        description: `El archivo "${file.name}" se ha subido correctamente`,
        type: 'success'
      });

      await notifyPolicyUpdated();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      error.value = `Error al subir la política: ${errorMessage}`;
      logger.error('Error al subir política de privacidad', 'usePrivacyPolicy', err);
      return false;
    } finally {
      isUploading.value = false;
    }
  };


  const deletePolicy = async (): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      logger.info('Eliminando política de privacidad', 'usePrivacyPolicy');
      await privacyPolicyCloudinary.deleteCurrentPolicy();
      
      await reloadPolicyData();

      logger.info('Política de privacidad eliminada exitosamente', 'usePrivacyPolicy');
      
      NotificationService.push({
        title: 'Política eliminada',
        description: 'La política de privacidad ha sido eliminada correctamente',
        type: 'success'
      });
      notifyPolicyDeleted();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      error.value = `Error al eliminar la política: ${errorMessage}`;
      logger.error('Error al eliminar política de privacidad', 'usePrivacyPolicy', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const downloadPolicy = async (): Promise<void> => {
    try {
      logger.info('Iniciando descarga de política de privacidad', 'usePrivacyPolicy');
      
      const downloadUrl = await privacyPolicyCloudinary.downloadPolicy();
      
      if (downloadUrl) {
        logger.info('URL de descarga obtenida', 'usePrivacyPolicy', { downloadUrl });
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = currentPolicy.value?.fileName || 'politicas-tratamiento-datos.pdf';
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        logger.info('Descarga de política iniciada', 'usePrivacyPolicy');
      } else {
        throw new Error('No hay política de privacidad disponible para descargar');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      error.value = `Error al descargar la política: ${errorMessage}`;
      logger.error('Error al descargar política de privacidad', 'usePrivacyPolicy', err);
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  const validateFile = (file: File): string | null => {
    let errorMessage = null;

    if (file.type !== 'application/pdf') {
      errorMessage = 'El archivo debe ser un PDF';
    }
    else if (file.size > 10 * 1024 * 1024) {
      errorMessage = 'El archivo no puede ser mayor a 10MB';
    }
    else if (!file.name.toLowerCase().endsWith('.pdf')) {
      errorMessage = 'El archivo debe tener extensión .pdf';
    }

    if (errorMessage) {
      error.value = errorMessage;
    }

    return errorMessage;
  };

  return {
    currentPolicy: computed(() => currentPolicy.value),
    isLoading: computed(() => isLoading.value),
    isUploading: computed(() => isUploading.value),
    error: computed(() => error.value),
    
    hasPolicy,
    policyFileName,
    policyUploadDate,
    policyFileSize,
    
    loadCurrentPolicy,
    uploadPolicy,
    deletePolicy,
    downloadPolicy,
    clearError,
    validateFile
  };
};
