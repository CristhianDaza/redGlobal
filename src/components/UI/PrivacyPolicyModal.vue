<script setup lang="ts">
import RgModal from '@/components/UI/RgModal.vue';

defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const handleClose = () => {
  emit('close');
};

const downloadPdf = () => {
  // window.open('/politicas-tratamiento-datos.pdf', '_blank');
  // PDF download will be available soon
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
          Usted, como titular de sus datos personales tratados por Red Global Promocional, 
          puede consultar el nuestras Políticas de Tratamiento de Datos Personales en el 
          siguiente documento:
        </p>
      </div>

      <div class="download-section">
        <button 
          class="download-button"
          @click="downloadPdf"
          title="Descargar PDF de Políticas de Tratamiento de Datos"
        >
          <span class="material-icons">download</span>
          Descarga nuestra Política de Tratamiento de Datos Personales
        </button>
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
}
</style>
