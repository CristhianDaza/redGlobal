<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePrivacyPolicy } from '@/composable/admin/usePrivacyPolicy';
import { useAuthStore } from '@/store';
import RgLoader from '@/components/UI/RgLoader.vue';
import RgConfirmModal from '@/components/UI/RgConfirmModal.vue';

const authStore = useAuthStore();
const {
  currentPolicy,
  isLoading,
  isUploading,
  error,
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
} = usePrivacyPolicy();

const fileInput = ref<HTMLInputElement>();
const showDeleteConfirm = ref(false);
const showUploadConfirm = ref(false);
const uploadSuccess = ref(false);
const selectedFile = ref<File | null>(null);

onMounted(() => {
  loadCurrentPolicy();
});

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  clearError();
  
  const validationError = validateFile(file);
  if (validationError) {
    return;
  }

  selectedFile.value = file;
  showUploadConfirm.value = true;
};

const handleConfirmUpload = async () => {
  if (!selectedFile.value) return;
  
  showUploadConfirm.value = false;
  
  const success = await uploadPolicy(selectedFile.value, authStore.user?.email || 'admin');
  if (success) {
    uploadSuccess.value = true;
    setTimeout(() => {
      uploadSuccess.value = false;
    }, 3000);
  }
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  selectedFile.value = null;
};

const handleCancelUpload = () => {
  showUploadConfirm.value = false;
  selectedFile.value = null;
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const handleDelete = async () => {
  showDeleteConfirm.value = false;
  await deletePolicy();
};

const handleDownload = async () => {
  await downloadPolicy();
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="privacy-policy-section">
    <div class="section-header">
      <h2>
        <span class="material-icons">policy</span>
        Políticas de Tratamiento de Datos Personales
      </h2>
      <p class="section-description">
        Gestiona el documento PDF de políticas de tratamiento de datos personales que se muestra en el footer del sitio web.
      </p>
    </div>

    <template v-if="isLoading">
      <div class="loading-container">
        <RgLoader>Cargando información de políticas...</RgLoader>
      </div>
    </template>

    <template v-else>
      <div v-if="error" class="error-container">
        <div class="error-message">
          <span class="material-icons">error</span>
          {{ error }}
        </div>
        <button @click="clearError" class="clear-error-btn">
          Cerrar
        </button>
      </div>

      <div v-if="uploadSuccess" class="success-container">
        <div class="success-message">
          <span class="material-icons">check_circle</span>
          Política de privacidad subida exitosamente
        </div>
      </div>

      <div class="content">
      <div v-if="hasPolicy" class="current-policy">
        <div class="policy-card">
          <div class="policy-header">
            <div class="policy-icon">
              <span class="material-icons">picture_as_pdf</span>
            </div>
            <div class="policy-info">
              <h3>{{ policyFileName }}</h3>
              <div class="policy-meta">
                <span class="meta-item">
                  <span class="material-icons">schedule</span>
                  Subido: {{ policyUploadDate }}
                </span>
                <span class="meta-item">
                  <span class="material-icons">storage</span>
                  Tamaño: {{ policyFileSize }}
                </span>
                <span class="meta-item">
                  <span class="material-icons">person</span>
                  Por: {{ currentPolicy?.uploadedBy }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="policy-actions">
            <button 
              @click="handleDownload" 
              class="action-btn download-btn"
              title="Descargar PDF"
            >
              <span class="material-icons">download</span>
              Descargar
            </button>
            <button 
              @click="showDeleteConfirm = true" 
              class="action-btn delete-btn"
              title="Eliminar PDF"
            >
              <span class="material-icons">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-policy">
        <div class="no-policy-icon">
          <span class="material-icons">description</span>
        </div>
        <h3>No hay política de privacidad configurada</h3>
        <p>Sube un documento PDF con las políticas de tratamiento de datos personales.</p>
      </div>

      <div class="upload-section">
        <h4>{{ hasPolicy ? 'Reemplazar política' : 'Subir nueva política' }}</h4>
        <div class="upload-area">
          <input
            ref="fileInput"
            type="file"
            accept=".pdf"
            @change="handleFileSelect"
            style="display: none"
          />
          
          <button 
            @click="triggerFileInput"
            :disabled="isUploading"
            class="upload-btn"
          >
            <span v-if="isUploading" class="material-icons spinning">sync</span>
            <span v-else class="material-icons">cloud_upload</span>
            {{ isUploading ? 'Subiendo...' : (hasPolicy ? 'Reemplazar PDF' : 'Subir PDF') }}
          </button>
          
          <div class="upload-info">
            <p><strong>Requisitos:</strong></p>
            <ul>
              <li>Formato: PDF únicamente</li>
              <li>Tamaño máximo: 10MB</li>
              <li>El archivo anterior será reemplazado automáticamente</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </template>

    <RgConfirmModal
      :is-open="showUploadConfirm"
      title="Confirmar subida"
      :message="`¿Estás seguro de que quieres subir '${selectedFile?.name}'? ${hasPolicy ? 'Esto reemplazará el archivo actual.' : ''}`"
      :is-loading="isUploading"
      @close="handleCancelUpload"
      @confirm="handleConfirmUpload"
    />

    <RgConfirmModal
      :is-open="showDeleteConfirm"
      title="Confirmar eliminación"
      :message="`¿Estás seguro de que quieres eliminar la política de privacidad '${policyFileName}'? Esta acción no se puede deshacer y los usuarios no podrán descargar el documento.`"
      :is-loading="isLoading"
      @close="showDeleteConfirm = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<style scoped>
.privacy-policy-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2d3748;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.section-description {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.loading-container {
  text-align: center;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-container {
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #c53030;
}

.clear-error-btn {
  background: #c53030;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.success-container {
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #276749;
}

.current-policy {
  margin-bottom: 2rem;
}

.policy-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.policy-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.policy-icon {
  background: #e53e3e;
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.policy-icon .material-icons {
  font-size: 1.5rem;
}

.policy-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.125rem;
}

.policy-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.875rem;
}

.meta-item .material-icons {
  font-size: 1rem;
}

.policy-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.download-btn {
  background: var(--primary-color);
  color: white;
}

.download-btn:hover {
  background: #4299e1;
  transform: translateY(-1px);
}

.delete-btn {
  background: #fed7d7;
  color: #c53030;
}

.delete-btn:hover {
  background: #feb2b2;
}

.no-policy {
  text-align: center;
  padding: 3rem;
  background: #f7fafc;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.no-policy-icon {
  background: #e2e8f0;
  color: #718096;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.no-policy-icon .material-icons {
  font-size: 2rem;
}

.no-policy h3 {
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.no-policy p {
  color: #666;
  margin: 0;
}

.upload-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.upload-section h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
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
  align-self: flex-start;
}

.upload-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.2);
}

.upload-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.upload-info {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid var(--primary-color);
}

.upload-info p {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-weight: 500;
}

.upload-info ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}
.upload-info li {
  margin-bottom: 0.25rem;
}

@media (max-width: 768px) {
  .privacy-policy-section {
    padding: 1rem;
  }
  
  .policy-header {
    flex-direction: column;
  }
  
  .policy-actions {
    justify-content: center;
  }
  
  .meta-item {
    justify-content: center;
  }
  
  .upload-btn {
    align-self: stretch;
  }
}
</style>
