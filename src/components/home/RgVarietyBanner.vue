<script setup lang="ts">
defineProps<{
  title: string;
  highlightWord: string;
  description: string;
}>();
</script>

<template>
  <section class="variety-banner">
    <div class="banner-content">
      <h2 class="banner-title">
        Tenemos <span class="highlight">{{ highlightWord }}</span> {{ title }}
      </h2>
      <p class="banner-description">{{ description }}</p>
    </div>
    <div class="banner-image">
      <img src="../../assets/images/variety-products.png" alt="Variedad de productos" />
    </div>
  </section>
</template>

<style scoped>
.variety-banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 3rem 2rem;
  background-color: #e8f5f0;
  border-radius: 1rem;
  margin: 4rem 0;
  align-items: center;
}

.banner-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.banner-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: #333;
}

.highlight {
  color: #ff4444;
}

.banner-description {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.banner-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-image img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .variety-banner {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem 1rem;
  }

  .banner-title {
    font-size: 2rem;
  }

  .banner-content {
    align-items: center;
  }
}
</style>
