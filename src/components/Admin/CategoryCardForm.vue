<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CategoryCard } from '../../types/common'
import RgModal from '../UI/RgModal.vue'
import { uploadImage } from '../../config/cloudinary'

const props = defineProps<{
  isOpen: boolean
  card?: CategoryCard
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', card: Omit<CategoryCard, 'id'>): void
  (e: 'close'): void
}>()

const title = ref('')
const buttonText = ref('')
const backgroundColor = ref('#A4B7CB')
const active = ref(true)
const url = ref('')
const textColor = ref('#333333')
const imageFile = ref<File | null>(null)
const imagePreview = ref('')

// Resetear el formulario cuando se abre
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.card) {
      title.value = props.card.title
      buttonText.value = props.card.buttonText
      backgroundColor.value = props.card.backgroundColor
      active.value = props.card.active
      url.value = props.card.url
      textColor.value = props.card.textColor
      imagePreview.value = props.card.imageUrl
    } else {
      title.value = ''
      buttonText.value = ''
      backgroundColor.value = '#A4B7CB'
      active.value = true
      url.value = ''
      textColor.value = '#333333'
      imageFile.value = null
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
    let imageUrl = props.card?.imageUrl || ''
    
    if (imageFile.value) {
      const result = await uploadImage(imageFile.value)
      imageUrl = result.secure_url
    }

    emit('save', {
      title: title.value,
      buttonText: buttonText.value,
      backgroundColor: backgroundColor.value,
      active: active.value,
      imageUrl,
      buttonColor: '',
      order: 0,
      url: url.value,
      textColor: textColor.value
    })
  } catch (error) {
    console.error('Error saving category card:', error)
    alert('Error al guardar la tarjeta')
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <RgModal
    :is-open="isOpen"
    :title="card ? 'Editar Categoría' : 'Nueva Categoría'"
    :loading="loading"
    @close="handleClose"
    @confirm="handleSave"
  >
    <form class="category-form">
      <div class="form-group">
        <label for="title">Título</label>
        <input
          id="title"
          v-model="title"
          type="text"
          required
          placeholder="Título de la categoría"
        >
      </div>

      <div class="form-group">
        <label for="buttonText">Texto del Botón</label>
        <input
          id="buttonText"
          v-model="buttonText"
          type="text"
          required
          placeholder="Texto que aparecerá en el botón"
        >
      </div>

      <div class="form-group">
        <label for="backgroundColor">Color de Fondo</label>
        <input
          id="backgroundColor"
          v-model="backgroundColor"
          type="color"
          required
        >
      </div>

      <div class="form-group">
        <label for="url">URL de navegación</label>
        <input
          id="url"
          v-model="url"
          type="text"
          required
          placeholder="URL donde navegará el botón"
        >
      </div>

      <div class="form-group">
        <label for="textColor">Color del texto</label>
        <input
          id="textColor"
          v-model="textColor"
          type="color"
          required
        >
      </div>

      <div class="form-group">
        <label for="active">Estado</label>
        <div class="switch-container">
          <input
            id="active"
            v-model="active"
            type="checkbox"
            class="switch-input"
          >
          <label for="active" class="switch-label">
            {{ active ? 'Activo' : 'Inactivo' }}
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="image">Imagen</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          @change="handleImageChange"
          :required="!props.card"
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
.category-form {
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

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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
