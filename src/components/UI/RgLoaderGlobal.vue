<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const loadingTexts = [
  'Cargando configuración...',
  'Preparando la experiencia...',
  'Conectando servicios...',
  'Casi listo...'
]

const currentTextIndex = ref(0)
const currentText = ref(loadingTexts[0])

let textInterval: number

onMounted(() => {
  document.body.style.overflow = 'hidden'
  
  textInterval = setInterval(() => {
    currentTextIndex.value = (currentTextIndex.value + 1) % loadingTexts.length
    currentText.value = loadingTexts[currentTextIndex.value]
  }, 1500)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  if (textInterval) {
    clearInterval(textInterval)
  }
})
</script>

<template>
  <div class="global-loader">
    <div class="loader-content">
      <div class="multi-circle-loader">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
      </div>

      <div class="dots-loader">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
      </div>
      
      <div class="loading-text">
        {{ currentText }}
      </div>
      
      <div class="brand-text">Red Global</div>
    </div>
  </div>
</template>

<style scoped>
.global-loader {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* Loader principal con múltiples círculos */
.multi-circle-loader {
  position: relative;
  width: 80px;
  height: 80px;
}

.circle {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
  animation: rotate 2s linear infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  border-top-color: #e8a5a5;
  border-right-color: #e8a5a5;
  animation-duration: 1.5s;
}

.circle-2 {
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  border-top-color: #a5d6d3;
  border-left-color: #a5d6d3;
  animation-duration: 2s;
  animation-direction: reverse;
}

.circle-3 {
  width: 40px;
  height: 40px;
  top: 20px;
  left: 20px;
  border-top-color: #a8c8ec;
  border-bottom-color: #a8c8ec;
  animation-duration: 1.8s;
}

.circle-4 {
  width: 20px;
  height: 20px;
  top: 30px;
  left: 30px;
  border-top-color: #f5d5a8;
  border-right-color: #f5d5a8;
  border-left-color: #f5d5a8;
  animation-duration: 1.2s;
  animation-direction: reverse;
}

/* Loader secundario con puntos */
.dots-loader {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot-1 {
  background: linear-gradient(45deg, #e8a5a5, #d49999);
  animation-delay: -0.32s;
}

.dot-2 {
  background: linear-gradient(45deg, #a5d6d3, #8cc9c5);
  animation-delay: -0.16s;
}

.dot-3 {
  background: linear-gradient(45deg, #a8c8ec, #8fb5e3);
  animation-delay: 0s;
}

/* Texto dinámico */
.loading-text {
  color: #555;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  animation: textPulse 2s ease-in-out infinite;
  min-height: 1.5rem;
  display: flex;
  align-items: center;
}

/* Marca */
.brand-text {
  color: rgba(85, 85, 85, 0.7);
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

/* Animaciones */
@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes textPulse {
  0%, 100% {
    opacity: 0.8;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .multi-circle-loader {
    width: 60px;
    height: 60px;
  }
  
  .circle-1 {
    width: 60px;
    height: 60px;
  }
  
  .circle-2 {
    width: 45px;
    height: 45px;
    top: 7.5px;
    left: 7.5px;
  }
  
  .circle-3 {
    width: 30px;
    height: 30px;
    top: 15px;
    left: 15px;
  }
  
  .circle-4 {
    width: 15px;
    height: 15px;
    top: 22.5px;
    left: 22.5px;
  }
  
  .loading-text {
    font-size: 1rem;
  }
  
  .brand-text {
    font-size: 0.8rem;
  }
}
</style>
