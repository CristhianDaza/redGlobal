<script setup lang="ts">
import { ref, defineAsyncComponent, watch, onUnmounted } from 'vue';

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */ () => import('@/components/UI/RgButton.vue'));

const props = withDefaults(defineProps<{
  isOpen: boolean
  title: string
  maxWidth?: string
  confirmText?: string
  confirmClass?: 'primary' | 'danger' | 'default'
  showConfirm?: boolean
  customStyle?: { backgroundColor: string; color: string }
  loading?: boolean
}>(), {
  showConfirm: true,
  loading: false
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const customStyleCancel = ref({
  backgroundColor: '#e2e8f0',
  color: '#4a5568'
})

const customStyleConfirm = ref({
  backgroundColor: props.confirmClass === 'danger' ? 'var(--primary-color)' : props.confirmClass === 'default' ? '#718096' : 'var(--primary-color)',
  color: 'white'
})

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscKey)
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscKey)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="handleClose">
      <div
        class="modal-content"
        :style="{ maxWidth: maxWidth || '500px' }"
        @click.stop
      >
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="close-button" @click="handleClose">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="modal-body" :class="{ 'loading-overlay': loading }">
          <div v-if="loading" class="loader"></div>
          <div :class="{ 'content-blur': loading }">
            <slot></slot>
          </div>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <RgButton
              text="Cancelar"
              type="default"
              :custom-style="customStyleCancel"
              @click="handleClose"
              :disabled="loading"
            />
            <RgButton
              v-if="showConfirm !== false"
              :text="confirmText || 'Confirmar'"
              type="default"
              :custom-style="customStyle || customStyleConfirm"
              @click="handleConfirm"
              :disabled="loading"
            />
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: color-mix(in srgb, var(--primary-color) 15%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  /* Enhanced blur effect */
  backdrop-filter: blur(12px) saturate(1.3) brightness(0.9);
  -webkit-backdrop-filter: blur(12px) saturate(1.3) brightness(0.9);
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.close-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  color: #4a5568;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f7fafc;
  color: #2d3748;
}

.modal-body {
  padding: 1.5rem;
  position: relative;
}

.loading-overlay {
  min-height: 150px;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid var(--primary-color);
  animation: spin 1s linear infinite;
  z-index: 10;
}

.content-blur {
  filter: blur(2px);
  opacity: 0.7;
  pointer-events: none;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style>
