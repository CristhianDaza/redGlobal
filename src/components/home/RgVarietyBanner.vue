<script setup lang="ts">
defineProps<{
  highlightWord: string;
  titleInit: string;
  titleEnd: string;
}>();
</script>

<template>
  <section class="variety-banner">
    <div class="banner-content">
      <h2 class="banner-title">
        {{ titleInit }} <span class="highlight">{{ highlightWord }}</span> {{ titleEnd }}
      </h2>
    </div>
    <div class="banner-image">
      <img src="https://firebasestorage.googleapis.com/v0/b/mega2024-6a453.appspot.com/o/revistas.png?alt=media&token=dfa11190-530a-4d5d-adf8-788ab89890b5" alt="Variedad de productos" />
    </div>
  </section>
</template>

<style scoped>
.variety-banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 4rem 5rem;
  background-color: #e8f5f0;
  border-radius: 1rem;
  margin: 1rem 0;
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
  color: #1be799;
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
