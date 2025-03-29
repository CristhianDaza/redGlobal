<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const RgButton = defineAsyncComponent(() => import('../UI/RgButton.vue'));
defineProps<{
  title: string;
  subtitle: string;
  buttonText: string;
  subtitle2: string;
  description: string;
  onClick?: (event: MouseEvent) => void;
  backgroundImage: string;
}>();
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
      <p class="hero-description">{{ description }}</p>
      <RgButton
        @click="$emit('click', $event)"
        :text="buttonText"
      />
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
  background-color: #ff4444;
  margin-bottom: -1.5rem;
  border: 0;
}

.highlight {
  color: #ff4444;
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
</style>
