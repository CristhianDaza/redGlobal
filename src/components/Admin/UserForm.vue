<script setup lang="ts">
import type { User, UserFormData } from '@/types/common.d'
import { ref, watch, defineAsyncComponent } from 'vue'
import { UserRole } from '@/types/common.d'
import { NotificationService } from '../Notification/NotificationService';

const RgModal = defineAsyncComponent(/* webpackChunkName: "rgModal" */() => import('@/components/UI/RgModal.vue'))

const props = defineProps<{
  isOpen: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', user: UserFormData): void
}>()

const formData = ref<UserFormData>({
  name: '',
  email: '',
  logo: '',
  primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
  secondaryColor: '#4a5568',
  priceIncrease: 0,
  active: true,
  role: UserRole.CLIENT
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
      priceIncrease: newUser.priceIncrease,
      active: newUser.active,
      role: newUser.role
    }
    if (newUser.logo) {
      previewUrl.value = newUser.logo
    }
  } else {
    formData.value = {
      name: '',
      email: '',
      logo: '',
      primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
      secondaryColor: '#4a5568',
      priceIncrease: 0,
      active: true,
      role: UserRole.CLIENT
    }
    selectedFile.value = null
    previewUrl.value = null
  }
}, { immediate: true })

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]

    if (!file.type.startsWith('image/')) {
      NotificationService.push({
        title: 'Tipo de archivo no válido',
        description: 'Por favor selecciona un archivo de imagen válido',
        type: 'error'
      })
      target.value = ''
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      NotificationService.push({
        title: 'Tamaño de archivo excedido',
        description: 'El archivo es demasiado grande. El tamaño máximo es 5MB',
        type: 'error'
      })
      target.value = ''
      return
    }

    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  try {
    if (!formData.value.name || !formData.value.email) {
      throw new Error('Por favor completa todos los campos requeridos')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.value.email)) {
      throw new Error('Por favor ingresa un email válido')
    }

    if (!props.user && (!password.value || password.value.length < 6)) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    const userData = {
      ...formData.value,
      password: password.value || undefined
    }

    if (selectedFile.value) {
      userData.logo = selectedFile.value
    }

    emit('save', userData)
    password.value = ''
  } catch (error) {
    console.error('Error en el formulario:', error)
    NotificationService.push({
      title: 'Error al procesar el formulario',
      description: error instanceof Error ? error.message : 'Error al procesar el formulario',
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

      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="formData.active"
          >
          Usuario Activo
        </label>
      </div>

      <div class="form-group">
        <label for="role">Rol del Usuario</label>
        <select
          id="role"
          v-model="formData.role"
          required
        >
          <option :value="UserRole.CLIENT">Cliente</option>
          <option :value="UserRole.ADMIN">Administrador</option>
        </select>
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: white;
  color: #4a5568;
}

select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color), 0.1);
}
</style>
