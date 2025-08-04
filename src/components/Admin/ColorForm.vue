<script setup lang="ts">
import type { ColorItem } from '@/types/common.d'
import { ref, watch, defineAsyncComponent } from 'vue'
import { NotificationService } from "@/components/Notification/NotificationService";

const RgModal = defineAsyncComponent(/* webpackChunkName: "rgModal" */() => import('@/components/UI/RgModal.vue'))

const props = defineProps<{
  isOpen: boolean
  color?: ColorItem
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', color: ColorItem): void
  (e: 'close'): void
}>()

const hex = ref('#333333')

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.color) {
      hex.value = props.color.hex
    } else {
      hex.value = ''
    }
  }
})

const handleSave = async () => {
  try {
    emit('save', {
      id: props.color?.id || '',
      hex: hex.value,
    })
  } catch (error) {
    console.error('Error to save color:', error)
    NotificationService.push({
      title: 'Error al guardar el color principal',
      description: 'Hubo un error al guardar el color principal. Por favor, inténtalo de nuevo.',
      type: 'error'
    })
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <RgModal
    :is-open="isOpen"
    :title="color ? 'Editar Color Principal' : 'Crear Color Principal'"
    :loading="loading"
    @close="handleClose"
    @confirm="handleSave"
  >
    <form class="our-client-form">
      <div class="form-group">
        <label for="color">Selecciona un color</label>
        <input
          id="color"
          v-model="hex"
          type="color"
          required
        >
        <p style="margin-top: 8px;">Color seleccionado: {{ hex }}</p>
      </div>
    </form>

  </RgModal>
</template>

<style scoped>
.our-client-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #4a5568;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-group input[type="color"] {
  width: 100%;
  height: 40px;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.image-preview {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.switch-input {
  appearance: none;
  width: 3rem;
  height: 1.5rem;
  background-color: #e2e8f0;
  border-radius: 1rem;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.switch-input:checked {
  background-color: #48bb78;
}

.switch-input::before {
  content: '';
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: white;
  top: 0.125rem;
  left: 0.125rem;
  transition: transform 0.3s;
}

.switch-input:checked::before {
  transform: translateX(1.5rem);
}

.switch-label {
  font-size: 0.875rem;
  color: #4a5568;
}
</style>
