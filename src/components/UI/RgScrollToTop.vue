<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';

const showButton = ref(false);
const scrollThreshold = 300;

const checkScroll = () => {
  showButton.value = window.scrollY > scrollThreshold;
};

const scrollToTop = () => {
  document.documentElement.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<template>
  <Transition name="fade">
    <button
      v-show="showButton"
      class="scroll-to-top"
      @click="scrollToTop"
      aria-label="Volver arriba"
    >
      <span class="material-icons">keyboard_arrow_up</span>
    </button>
  </Transition>
</template>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: var(--primary-color);
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(var(--primary-color), 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.scroll-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(var(--primary-color), 0.2);
  background-color: var(--primary-color);
}

.scroll-to-top:active {
  transform: translateY(-1px);
}

.scroll-to-top .material-icons {
  font-size: 1.8rem;
  animation: bounce 2s infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

@media (max-width: 768px) {
  .scroll-to-top {
    bottom: 1rem;
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .scroll-to-top {
    bottom: 0.8rem;
    right: 0.8rem;
  }
}
</style>
