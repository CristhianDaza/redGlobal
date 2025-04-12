<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from 'vue';

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('../UI/RgButton.vue'));
defineProps<{
  title: string;
  subtitle: string;
  buttonText: string;
  subtitle2: string;
  onClick?: (event: MouseEvent) => void;
  backgroundImage: string;
  routeButton: string;
}>();

const phrases = [
  'Creamos productos únicos que reflejan la identidad de tu empresa.',
  'Porque un buen regalo no solo se entrega... se recuerda.',
  'Desde una idea hasta el producto final.',
  'Tú eliges el diseño, nosotros lo hacemos realidad.',
  'Aumenta el impacto de tu marca con productos personalizados.'
];

const currentPhrase = ref(phrases[0]);
let index = 0;

onMounted(() => {
  setInterval(() => {
    index = (index + 1) % phrases.length;
    currentPhrase.value = phrases[index];
  }, 4000); // Cambia cada 4 segundos
});
</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url('${backgroundImage}')` }">
    <div class="hero-content">
      <p class="hero-subtitle">
        <span class="highlight">{{ subtitle }}</span>
        <span>{{ subtitle2 }}</span>
      </p>
      <hr class="hero-hr" />
      <h1 class="hero-title">{{ title }}</h1>
      <div class="hero-description-wrapper">
        <transition name="fade" mode="out-in">
          <p class="hero-description" :key="currentPhrase">
            {{ currentPhrase }}
          </p>
        </transition>
      </div>
      <router-link
        :to="{ name: routeButton }"
      >
        <RgButton
          :text="buttonText"
        />
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  background-color: #f8f8f8;
  background-size: contain;
  background-position: right 2rem center;
  background-repeat: no-repeat;
  border-radius: 1rem;
  margin: 0 auto 2rem;
  width: 100%;
  max-width: 100%;
  position: relative;
  overflow: hidden;
  padding: 0 2rem;
}

.hero-content {
  padding: 8rem 4rem 8rem 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  background: linear-gradient(to right, #f8f8f8 60%, transparent);
  z-index: 1;
}

.hero-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: -1.5rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: #333;
}
/* 
.hero-description {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  transition: opacity 0.5s;
} */

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.hero-hr {
  width: 98px;
  height: 2.8px;
  background-color: var(--primary-color);
  margin-bottom: -1.5rem;
  border: 0;
}

.highlight {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem 1rem;
  }

  .hero-content {
    align-items: center;
  }

  .hero-title {
    font-size: 2rem;
  }
}

.hero-description-wrapper {
  position: relative;
  height: 1.6em;
}

.hero-description {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  font-size: 1.2rem;
  min-height: 1.6em;
  transition: opacity 0.5s ease;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
