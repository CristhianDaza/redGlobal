<script setup lang="ts">
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { useMissionVisionAdmin } from '@/composable/admin/useMissionVisionAdmin'

const RgButton = defineAsyncComponent(() => import('@/components/UI/RgButton.vue'))
const RgConfirmModal = defineAsyncComponent(() => import('@/components/UI/RgConfirmModal.vue'))

const {
  missionImage,
  visionImage,
  isLoading,
  isUploading,
  hasMissionImage,
  hasVisionImage,
  loadMissionVisionImages,
  uploadMissionVisionImage,
  deleteMissionVisionImage
} = useMissionVisionAdmin()

const missionFileInput = ref<HTMLInputElement>()
const visionFileInput = ref<HTMLInputElement>()
const showDeleteModal = ref(false)
const deleteType = ref<'mission' | 'vision'>('mission')

onMounted(() => {
  loadMissionVisionImages()
})

const handleMissionFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadMissionVisionImage(file, 'mission')
  }
}

const handleVisionFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadMissionVisionImage(file, 'vision')
  }
}

const openDeleteModal = (type: 'mission' | 'vision') => {
  deleteType.value = type
  showDeleteModal.value = true
}

const confirmDelete = () => {
  deleteMissionVisionImage(deleteType.value)
  showDeleteModal.value = false
}

const triggerMissionUpload = () => {
  missionFileInput.value?.click()
}

const triggerVisionUpload = () => {
  visionFileInput.value?.click()
}
</script>

<template>
  <div class="mission-vision-section">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="material-icons">visibility</span>
        <div class="stat-info">
          <h3>Imágenes configuradas</h3>
          <p class="stat-number">{{ (hasMissionImage ? 1 : 0) + (hasVisionImage ? 1 : 0) }} de 2</p>
          <p class="stat-description">Tamaño recomendado: 400x300 píxeles</p>
        </div>
      </div>
    </div>

    <div class="images-grid">
      <div class="image-section">
        <h3 class="section-title">
          <span class="material-icons">flag</span>
          Imagen de Misión
        </h3>
        
        <div v-if="hasMissionImage" class="current-image">
          <img :src="missionImage?.imageUrl" alt="Imagen de Misión" class="preview-image">
          <div class="image-info">
            <p><strong>Subido por:</strong> {{ missionImage?.uploadedBy }}</p>
            <p><strong>Fecha:</strong> {{ new Date(missionImage?.uploadedAt || '').toLocaleDateString() }}</p>
          </div>
          <div class="image-actions">
            <RgButton
              text="Reemplazar"
              icon="edit"
              @click="triggerMissionUpload"
              :disabled="isUploading"
              :customStyle="{
                backgroundColor: '#4299e1',
                color: '#ffffff'
              }"
            />
            <RgButton
              text="Eliminar"
              icon="remove"
              outlined
              @click="openDeleteModal('mission')"
              :disabled="isLoading"
              :customStyle="{
                borderColor: '#e53e3e',
                color: '#e53e3e'
              }"
            />
          </div>
        </div>

        <div v-else class="upload-area" @click="triggerMissionUpload">
          <div class="upload-content">
            <span class="material-icons upload-icon">cloud_upload</span>
            <p class="upload-text">Subir imagen de Misión</p>
            <p class="upload-hint">Haz clic para seleccionar una imagen</p>
          </div>
        </div>

        <input
          ref="missionFileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleMissionFileSelect"
        >
      </div>

      <div class="image-section">
        <h3 class="section-title">
          <span class="material-icons">visibility</span>
          Imagen de Visión
        </h3>
        
        <div v-if="hasVisionImage" class="current-image">
          <img :src="visionImage?.imageUrl" alt="Imagen de Visión" class="preview-image">
          <div class="image-info">
            <p><strong>Subido por:</strong> {{ visionImage?.uploadedBy }}</p>
            <p><strong>Fecha:</strong> {{ new Date(visionImage?.uploadedAt || '').toLocaleDateString() }}</p>
          </div>
          <div class="image-actions">
            <RgButton
              text="Reemplazar"
              icon="edit"
              @click="triggerVisionUpload"
              :disabled="isUploading"
              :customStyle="{
                backgroundColor: '#4299e1',
                color: '#ffffff'
              }"
            />
            <RgButton
              text="Eliminar"
              icon="remove"
              outlined
              @click="openDeleteModal('vision')"
              :disabled="isLoading"
              :customStyle="{
                borderColor: '#e53e3e',
                color: '#e53e3e'
              }"
            />
          </div>
        </div>

        <div v-else class="upload-area" @click="triggerVisionUpload">
          <div class="upload-content">
            <span class="material-icons upload-icon">cloud_upload</span>
            <p class="upload-text">Subir imagen de Visión</p>
            <p class="upload-hint">Haz clic para seleccionar una imagen</p>
          </div>
        </div>

        <input
          ref="visionFileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleVisionFileSelect"
        >
      </div>
    </div>

    <div v-if="isLoading || isUploading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>{{ isUploading ? 'Subiendo imagen...' : 'Cargando...' }}</p>
      </div>
    </div>

    <RgConfirmModal
      :isOpen="showDeleteModal"
      :title="`Eliminar imagen de ${deleteType === 'mission' ? 'Misión' : 'Visión'}`"
      :message="`¿Estás seguro de que deseas eliminar la imagen de ${deleteType === 'mission' ? 'misión' : 'visión'}? Esta acción no se puede deshacer.`"
      @confirm="confirmDelete"
      @close="showDeleteModal = false"
    />
  </div>
</template>

<style scoped>
.mission-vision-section {
  position: relative;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  color: #2d3748;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.stat-card .material-icons {
  font-size: 2.5rem;
  color: var(--primary-color);
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.stat-number {
  margin: 0 0 5px 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-description {
  margin: 0;
  font-size: 0.85rem;
  color: #718096;
  font-weight: 500;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.image-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
}

.section-title .material-icons {
  color: var(--primary-color);
}

.current-image {
  text-align: center;
}

.preview-image {
  width: 100%;
  max-width: 300px;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #f7fafc;
}

.image-info {
  margin-bottom: 20px;
  text-align: left;
  background: #f7fafc;
  padding: 15px;
  border-radius: 8px;
}

.image-info p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #4a5568;
}

.image-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.upload-area:hover {
  border-color: var(--primary-color);
  background: #edf2f7;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 3rem;
  color: #a0aec0;
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.upload-hint {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .images-grid {
    grid-template-columns: 1fr;
  }
  
  .image-actions {
    flex-direction: column;
  }
  
  .upload-area {
    padding: 30px 15px;
  }
}
</style>
