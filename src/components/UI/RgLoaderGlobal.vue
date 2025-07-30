<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="global-loader">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.global-loader {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #e0e7ef 0%, #ffffff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary-color, #458500);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
