<script setup lang="ts">
import RgModal from './RgModal.vue'

const props = defineProps<{
  isOpen: boolean
  title?: string
  message?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<template>
  <RgModal
    :is-open="isOpen"
    :title="title || 'Confirmar acción'"
    @close="handleClose"
    @confirm="handleConfirm"
    confirmText="Eliminar"
    confirmClass="danger"
  >
    <p class="confirm-message">
      {{ message || '¿Estás seguro de que deseas realizar esta acción?' }}
    </p>
  </RgModal>
</template>

<style scoped>
.confirm-message {
  margin: 0;
  padding: 1rem 0;
  color: #4a5568;
  text-align: center;
}
</style>
