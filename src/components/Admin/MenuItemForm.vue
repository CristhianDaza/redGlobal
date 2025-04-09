<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MenuItem } from '../../types/common'
import RgModal from '../UI/RgModal.vue'

const props = defineProps<{
  isOpen: boolean
  menuItem?: MenuItem
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', menuItem: MenuItem): void
}>()

const formData = ref<MenuItem>({
  id: '',
  path: '',
  order: 0,
  title: ''
})

// Actualizar el formulario cuando se edita un item existente
watch(() => props.menuItem, (newItem) => {
  if (newItem) {
    formData.value = { ...newItem }
  } else {
    formData.value = {
      id: '',
      path: '',
      order: 0,
      title: ''
    }
  }
}, { immediate: true })

const handleSave = () => {
  emit('save', formData.value)
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <RgModal
    :is-open="isOpen"
    :title="menuItem ? 'Editar Item del Menú' : 'Agregar Item al Menú'"
    @close="handleClose"
    @confirm="handleSave"
  >
    <form class="menu-form" @submit.prevent="handleSave">
      <div class="form-group">
        <label for="title">Título</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          placeholder="Ej: Inicio"
        >
      </div>

      <div class="form-group">
        <label for="path">Ruta</label>
        <input
          id="path"
          v-model="formData.path"
          type="text"
          required
          placeholder="Ej: /home"
        >
      </div>



      <div class="form-group">
        <label for="order">Orden</label>
        <input
          id="order"
          v-model.number="formData.order"
          type="number"
          required
          min="0"
        >
      </div>
    </form>
  </RgModal>
</template>

<style scoped>
.menu-form {
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
  color: #2d3748;
}

.form-group input:focus {
  outline: none;
  border-color: #ff4444;
  box-shadow: 0 0 0 1px #ff4444;
}

.form-group input::placeholder {
  color: #a0aec0;
}
</style>
