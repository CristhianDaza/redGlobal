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
let phraseIndex = ref(0);
let typing = ref(true);
let charIndex = ref(0);
const displayedText = ref('');

const typeWriterEffect = () => {
  const currentPhrase = phrases[phraseIndex.value]

  if (typing.value) {
    if (charIndex.value < currentPhrase.length) {
      displayedText.value += currentPhrase.charAt(charIndex.value)
      charIndex.value++
      setTimeout(typeWriterEffect, 60) // velocidad de escritura
    } else {
      typing.value = false
      setTimeout(typeWriterEffect, 1500) // espera antes de borrar
    }
  } else {
    if (charIndex.value > 0) {
      displayedText.value = currentPhrase.substring(0, charIndex.value - 1)
      charIndex.value--
      setTimeout(typeWriterEffect, 30) // velocidad de borrado
    } else {
      typing.value = true
      phraseIndex.value = (phraseIndex.value + 1) % phrases.length
      setTimeout(typeWriterEffect, 200)
    }
  }
}

onMounted(() => {
  typeWriterEffect()
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
        <p class="hero-description">{{ displayedText }}<span class="cursor">|</span></p>
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

.hero-description {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

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

.cursor {
  display: inline-block;
  width: 1px;
  background-color: #333;
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

</style>
