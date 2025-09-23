<template>
  <div class="loader-container">
    <div class="loader">
      <!-- Loader principal con círculos concéntricos -->
      <div class="modern-loader">
        <div class="spinner-ring ring-1"></div>
        <div class="spinner-ring ring-2"></div>
        <div class="spinner-ring ring-3"></div>
        <div class="center-dot"></div>
      </div>
      
      <!-- Puntos animados -->
      <div class="dots-container">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
      </div>
      
      <!-- Texto -->
      <div class="loader-text">
        <slot>Cargando...</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
  padding: 2rem;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* Loader principal */
.modern-loader {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: rotate 2s linear infinite;
}

.ring-1 {
  width: 60px;
  height: 60px;
  border-top-color: var(--primary-color, #458500);
  border-right-color: var(--primary-color, #458500);
  animation-duration: 1.8s;
}

.ring-2 {
  width: 45px;
  height: 45px;
  top: 7.5px;
  left: 7.5px;
  border-top-color: #a5d6d3;
  border-left-color: #a5d6d3;
  animation-duration: 2.2s;
  animation-direction: reverse;
}

.ring-3 {
  width: 30px;
  height: 30px;
  top: 15px;
  left: 15px;
  border-top-color: #a8c8ec;
  border-bottom-color: #a8c8ec;
  animation-duration: 1.5s;
}

.center-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  top: 26px;
  left: 26px;
  background: linear-gradient(45deg, #e8a5a5, #f5d5a8);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

/* Puntos animados */
.dots-container {
  display: flex;
  gap: 6px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot-1 {
  background: var(--primary-color, #458500);
  animation-delay: -0.32s;
}

.dot-2 {
  background: #a5d6d3;
  animation-delay: -0.16s;
}

.dot-3 {
  background: #a8c8ec;
  animation-delay: 0s;
}

/* Texto */
.loader-text {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  animation: textFade 2s ease-in-out infinite;
}

/* Animaciones */
@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  40% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes textFade {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modern-loader {
    width: 50px;
    height: 50px;
  }
  
  .ring-1 {
    width: 50px;
    height: 50px;
  }
  
  .ring-2 {
    width: 37px;
    height: 37px;
    top: 6.5px;
    left: 6.5px;
  }
  
  .ring-3 {
    width: 24px;
    height: 24px;
    top: 13px;
    left: 13px;
  }
  
  .center-dot {
    width: 6px;
    height: 6px;
    top: 22px;
    left: 22px;
  }
  
  .loader-text {
    font-size: 0.8rem;
  }
}
</style>
