<script setup lang="ts">
import type { OurClients } from '@/types/common.d'
import { ref, watch, defineAsyncComponent } from 'vue'
import { uploadImage } from '@/config'
import { NotificationService } from "@/components/Notification/NotificationService";

const RgModal = defineAsyncComponent(/* webpackChunkName: "rgModal" */() => import('@/components/UI/RgModal.vue'))

const props = defineProps<{
  isOpen: boolean
  ourClient?: OurClients
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', ourClient: OurClients): void
  (e: 'close'): void
}>()

const title = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref('')

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.ourClient) {
      title.value = props.ourClient.title
      imagePreview.value = props.ourClient.imageUrl
    } else {
      title.value = ''
      imagePreview.value = ''
    }
  }
})

const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    imageFile.value = input.files[0]
    imagePreview.value = URL.createObjectURL(input.files[0])
  }
}

const handleSave = async () => {
  try {
    let imageUrl = props.ourClient?.imageUrl || ''

    if (imageFile.value) {
      const result = await uploadImage(imageFile.value)
      imageUrl = result.secure_url
    }

    emit('save', {
      id: props.ourClient?.id || '',
      title: title.value,
      imageUrl,
    })
  } catch (error) {
    console.error('Error to save our client:', error)
    NotificationService.push({
      title: 'Error al guardar la imagen del cliente',
      description: 'Hubo un error al guardar la imagen del cliente. Por favor, inténtalo de nuevo.',
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
    :title="ourClient ? 'Editar Imagen' : 'Nueva Imagen'"
    :loading="loading"
    @close="handleClose"
    @confirm="handleSave"
  >
    <form class="our-client-form">
      <div class="form-group">
        <label for="title">Título</label>
        <input
          id="title"
          v-model="title"
          type="text"
          required
          placeholder="Título de la imagen"
        >
      </div>

      <div class="form-group">
        <label for="image">Imagen</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          @change="handleImageChange"
          :required="!props.ourClient"
        >
        <img
          v-if="imagePreview"
          :src="imagePreview"
          alt="Vista previa"
          class="image-preview"
        >
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
