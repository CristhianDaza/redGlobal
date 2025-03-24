<script setup lang="ts">
interface Category {
  title: string;
  image: string;
  link: string;
}

const categories: Category[] = [
  {
    title: 'Productos Promocionales',
    image: '../../assets/images/category-promo.png',
    link: '/productos-promocionales'
  },
  {
    title: 'Gift Promocionales',
    image: '../../assets/images/category-gift.png',
    link: '/gift-promocionales'
  },
  {
    title: 'Mix Promocionales',
    image: '../../assets/images/category-mix.png',
    link: '/mix-promocionales'
  }
];
</script>

<template>
  <section class="categories">
    <div class="categories-grid">
      <router-link 
        v-for="category in categories" 
        :key="category.title"
        :to="category.link"
        class="category-card"
      >
        <div class="category-image">
          <img :src="category.image" :alt="category.title">
        </div>
        <div class="category-content">
          <h3>{{ category.title }}</h3>
          <span class="category-link">Ver más</span>
        </div>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.categories {
  padding: 2rem 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.category-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background-color: #f5f5f5;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-image {
  position: relative;
  padding-bottom: 75%; /* 4:3 aspect ratio */
}

.category-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-content {
  padding: 1.5rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
}

.category-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.category-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #ff4444;
  border-radius: 0.25rem;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.category-card:hover .category-link {
  background-color: #ff2222;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
