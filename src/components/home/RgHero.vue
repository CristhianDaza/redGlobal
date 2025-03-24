<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  buttonText: string;
}>();
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <p class="hero-subtitle">{{ subtitle }}</p>
      <h1 class="hero-title">{{ title }}</h1>
      <button class="hero-button">{{ buttonText }}</button>
    </div>
    <div class="hero-image">
      <img src="../../assets/images/hero-products.png" alt="Productos corporativos" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 4rem 2rem;
  background-color: #f8f8f8;
  border-radius: 1rem;
  margin: 2rem 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.hero-subtitle {
  color: #ff4444;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: #333;
}

.hero-button {
  width: fit-content;
  padding: 1rem 2rem;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.hero-button:hover {
  background-color: #ff2222;
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
