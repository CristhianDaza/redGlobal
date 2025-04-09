<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '../../types/common'
import RgModal from '../UI/RgModal.vue'

const props = defineProps<{
  isOpen: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): void
}>()

const formData = ref<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>({ 
  name: '',
  email: '',
  logo: '',
  primaryColor: '#ff4444',
  secondaryColor: '#4a5568',
  priceIncrease: 0
})

const password = ref('')

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.value = {
      name: newUser.name,
      email: newUser.email,
      logo: newUser.logo || '',
      primaryColor: newUser.primaryColor,
      secondaryColor: newUser.secondaryColor,
      priceIncrease: newUser.priceIncrease
    }
    if (newUser.logo) {
      previewUrl.value = newUser.logo
    }
  } else {
    formData.value = {
      name: '',
      email: '',
      logo: '',
      primaryColor: '#ff4444',
      secondaryColor: '#4a5568',
      priceIncrease: 0
    }
    selectedFile.value = null
    previewUrl.value = null
  }
}, { immediate: true })

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    previewUrl.value = URL.createObjectURL(target.files[0])
  }
}

const handleSubmit = async () => {
  const userData = { 
    ...formData.value,
    password: password.value 
  }
  if (selectedFile.value) {
    // TODO: Implementar subida de imagen
    // userData.logo = await uploadImage(selectedFile.value)
  }
  emit('save', userData)
  password.value = '' // Limpiar contraseña después de enviar
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <RgModal
    :is-open="isOpen"
    :title="user ? 'Editar Usuario' : 'Crear Usuario'"
    @close="handleClose"
    @confirm="handleSubmit"
  >
    <form @submit.prevent="handleSubmit" class="user-form">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          placeholder="Nombre del usuario"
        >
      </div>

      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          placeholder="correo@ejemplo.com"
        >
      </div>

      <div class="form-group" v-if="!user">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="Contraseña del usuario"
          minlength="6"
        >
      </div>

      <div class="form-group">
        <label for="logo">Logo</label>
        <input
          id="logo"
          type="file"
          accept="image/*"
          @change="handleFileChange"
        >
        <div v-if="previewUrl" class="logo-preview">
          <img :src="previewUrl" alt="Logo preview">
        </div>
      </div>

      <div class="form-group">
        <label for="primaryColor">Color Principal</label>
        <input
          id="primaryColor"
          v-model="formData.primaryColor"
          type="color"
          required
        >
      </div>

      <div class="form-group">
        <label for="secondaryColor">Color Secundario</label>
        <input
          id="secondaryColor"
          v-model="formData.secondaryColor"
          type="color"
          required
        >
      </div>

      <div class="form-group">
        <label for="priceIncrease">Porcentaje de Incremento</label>
        <input
          id="priceIncrease"
          v-model="formData.priceIncrease"
          type="number"
          min="0"
          max="100"
          step="0.1"
          required
        >
      </div>
    </form>
  </RgModal>
</template>

<style scoped>
.user-form {
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

.form-group input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-group input[type="color"] {
  height: 40px;
  padding: 0;
}

.form-group input[type="file"] {
  padding: 0;
}

.logo-preview {
  margin-top: 0.5rem;
  width: 100px;
  height: 100px;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  overflow: hidden;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
