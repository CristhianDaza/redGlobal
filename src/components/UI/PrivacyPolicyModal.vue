<script setup lang="ts">
import { onMounted } from 'vue';
import RgModal from '@/components/UI/RgModal.vue';
import { useGlobalPrivacyPolicy } from '@/composable/useGlobalPrivacyPolicy';

defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const {
  hasGlobalPolicy,
  globalIsLoading,
  loadGlobalPolicy,
  downloadGlobalPolicy
} = useGlobalPrivacyPolicy();

onMounted(async () => {
  await loadGlobalPolicy();
});

const handleClose = () => {
  emit('close');
};

const handleDownloadPdf = async () => {
  if (hasGlobalPolicy.value) {
    try {
      await downloadGlobalPolicy();
    } catch (error) {
      console.error('Error downloading policy:', error);
    }
  }
};
</script>

<template>
  <RgModal
    :is-open="isOpen"
    title="Políticas de Tratamiento de Datos Personales"
    max-width="800px"
    :show-confirm="false"
    @close="handleClose"
  >
    <div class="privacy-policy-content">
      <div class="company-header">
        <h3>Red Global Promocional S.A.S.</h3>
        <p class="company-address">
          Con domicilio en la ciudad de Bogotá - Cl. 23 #74b-27
        </p>
      </div>

      <div class="policy-text">
        <p>
          Informa que en virtud de su Política de Tratamiento de Datos Personales, nos
          esforzamos para que los procedimientos a través de los cuales hacemos uso de su
          información personal sean seguros y confidenciales, impidiendo el acceso indeseado
          por parte de terceras personas a los mismos.
        </p>

        <p>
          puede consultar el nuestras Políticas de Tratamiento de Datos Personales en el
          siguiente documento:
        </p>
      </div>

      <div class="download-section">
        <div v-if="globalIsLoading" class="loading-message">
          <span class="material-icons">sync</span>
          <p>Cargando información de políticas...</p>
        </div>

        <button
          v-else-if="hasGlobalPolicy"
          class="download-button"
          @click="handleDownloadPdf"
          title="Descargar PDF de Políticas de Tratamiento de Datos"
        >
          <span class="material-icons">download</span>
          Descarga nuestra Política de Tratamiento de Datos Personales
        </button>

        <div v-else class="no-policy-message">
          <span class="material-icons">info</span>
          <p>Actualmente no hay un documento de políticas disponible para descargar.</p>
        </div>
      </div>

      <div class="contact-info">
        <p>
          Si tiene alguna inquietud o quiere cambiar sus preferencias comuníquese con nosotros al correo
          <a href="mailto:servicioalcliente@redglobalpromo.com.co" class="email-link">
            servicioalcliente@redglobalpromo.com.co
          </a>
        </p>
      </div>
    </div>

    <template #footer>
      <button class="close-btn" @click="handleClose">
        Cerrar
      </button>
    </template>
  </RgModal>
</template>

<style scoped>
.privacy-policy-content {
  line-height: 1.6;
  color: #4a5568;
}

.company-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
}

.company-header h3 {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.company-address {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.policy-text {
  margin-bottom: 2rem;
}

.policy-text p {
  margin-bottom: 1rem;
  text-align: justify;
}

.download-section {
  margin: 2rem 0;
  text-align: center;
}

.download-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #4299e1, var(--primary-color));
}

.download-button:active {
  transform: translateY(0);
}

.download-button .material-icons {
  font-size: 1.2rem;
}

.contact-info {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.contact-info p {
  margin: 0;
  text-align: center;
}

.email-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.email-link:hover {
  color: #4299e1;
  text-decoration: underline;
}

.close-btn {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #cbd5e0;
  color: #2d3748;
}

.no-policy-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 0.5rem;
  padding: 1rem;
  color: #856404;
}

.no-policy-message .material-icons {
  font-size: 1.5rem;
  color: #f39c12;
}

.no-policy-message p {
  margin: 0;
  font-size: 0.95rem;
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 0.5rem;
  padding: 1rem;
  color: #1565c0;
}

.loading-message .material-icons {
  font-size: 1.5rem;
  color: #2196f3;
  animation: spin 1s linear infinite;
}

.loading-message p {
  margin: 0;
  font-size: 0.95rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.5rem;
  padding: 1rem;
  color: #721c24;
  margin-top: 1rem;
}

.error-message .material-icons {
  font-size: 1.5rem;
  color: #dc3545;
}

.error-message p {
  margin: 0;
  flex: 1;
  font-size: 0.95rem;
}

.clear-error-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.clear-error-btn:hover {
  background: #c82333;
}

@media (max-width: 640px) {
  .company-header h3 {
    font-size: 1.25rem;
  }

  .download-button {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }

  .policy-text p {
    text-align: left;
  }

  .no-policy-message,
  .error-message {
    flex-direction: column;
    text-align: center;
  }
}
</style>
