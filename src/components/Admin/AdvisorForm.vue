<script setup lang="ts">
import type { Advisor } from '@/types/common.d'
import { ref, watch, defineAsyncComponent } from 'vue'
import { NotificationService } from "@/components/Notification/NotificationService";

const RgModal = defineAsyncComponent(/* webpackChunkName: "rgModal" */() => import('@/components/UI/RgModal.vue'))

const props = defineProps<{
  isOpen: boolean
  advisor?: Advisor
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', advisor: Advisor): void
  (e: 'close'): void
}>()

const nombre = ref('')
const telefono = ref('')

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.advisor) {
      nombre.value = props.advisor.nombre
      telefono.value = props.advisor.telefono
    } else {
      nombre.value = ''
      telefono.value = ''
    }
  }
})

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('57') && cleaned.length === 12) {
    return cleaned
  }
  
  if (cleaned.length === 10) {
    return '57' + cleaned
  }
  return cleaned
}

const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('57'))
}

const handleSave = async () => {
  try {
    if (!nombre.value.trim()) {
      NotificationService.push({
        title: 'Error de validación',
        description: 'El nombre del asesor es requerido.',
        type: 'error'
      })
      return
    }

    if (!telefono.value.trim()) {
      NotificationService.push({
        title: 'Error de validación',
        description: 'El teléfono del asesor es requerido.',
        type: 'error'
      })
      return
    }

    if (!validatePhoneNumber(telefono.value)) {
      NotificationService.push({
        title: 'Error de validación',
        description: 'El teléfono debe tener 10 dígitos (número colombiano) o 12 dígitos con código de país.',
        type: 'error'
      })
      return
    }

    const formattedPhone = formatPhoneNumber(telefono.value)

    emit('save', {
      id: props.advisor?.id || '',
      nombre: nombre.value.trim(),
      telefono: formattedPhone,
    })
  } catch (error) {
    console.error('Error saving advisor:', error)
    NotificationService.push({
      title: 'Error al guardar el asesor',
      description: 'Hubo un error al guardar el asesor. Por favor, inténtalo de nuevo.',
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
    :title="advisor ? 'Editar Asesor' : 'Nuevo Asesor'"
    :loading="loading"
    @close="handleClose"
    @confirm="handleSave"
  >
    <form class="advisor-form">
      <div class="form-group">
        <label for="nombre">Nombre del Asesor</label>
        <input
          id="nombre"
          v-model="nombre"
          type="text"
          required
          placeholder="Nombre completo del asesor"
        >
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono</label>
        <input
          id="telefono"
          v-model="telefono"
          type="tel"
          required
          placeholder="3001234567 o 573001234567"
        >
        <small class="form-help">
          Ingresa el número sin espacios ni guiones. Se puede incluir el código de país (57) o solo el número de 10 dígitos.
        </small>
      </div>
    </form>
  </RgModal>
</template>

<style scoped>
.advisor-form {
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
.form-group input[type="tel"] {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-group input[type="text"]:focus,
.form-group input[type="tel"]:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-help {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}
</style>
