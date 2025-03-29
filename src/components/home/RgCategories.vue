<script setup lang="ts">
import type { Category } from '@/types/config';
import { defineAsyncComponent } from 'vue';
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('../UI/RgButton.vue'));

const categories: Category[] = [
  {
    title: 'Productos Promocionales',
    image: 'https://firebasestorage.googleapis.com/v0/b/mega2024-6a453.appspot.com/o/cat-07.png?alt=media&token=67742bed-a013-46d9-b5ec-7abc9c617068',
    link: '/productos-promocionales',
    id: 1,
    background: '#A4B7CB',
    textButton: 'Ver catálogo'
  },
  {
    title: 'Gift Promocionales',
    image: 'https://firebasestorage.googleapis.com/v0/b/mega2024-6a453.appspot.com/o/revistas.png?alt=media&token=dfa11190-530a-4d5d-adf8-788ab89890b5',
    link: '/gift-promocionales',
    id: 2,
    background: '#F4A676',
    textButton: 'Ver catálogo'
  },
  {
    title: 'Mix Promocionales',
    image: 'https://firebasestorage.googleapis.com/v0/b/mega2024-6a453.appspot.com/o/tarjeta.png?alt=media&token=d1a54f94-deb5-4127-80c3-11c4fc2027ca',
    link: '/mix-promocionales',
    id: 3,
    background: '#7DCFB6',
    textButton: 'Ver catálogo'
  }
];

const customStyle = {
  backgroundColor: '#ff4444',
  color: '#fff',
};
</script>

<template>
  <section class="categories">
    <div class="categories-grid">
      <router-link 
        v-for="category in categories" 
        :key="category.id"
        :to="category.link"
        class="category-card"
      >
        <div class="category-image" :style="{ backgroundColor: category.background }">
          <div class="category-content">
            <h3>{{ category.title }}</h3>
            <RgButton
              :text="category.textButton"
              :custom-style="customStyle"
            />
          </div>
          <img :src="category.image" :alt="category.title">
        </div>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.categories {
  padding: 2rem 0;

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .category-card {
    text-decoration: none;
    border-radius: 12px;
    overflow: hidden;
    position: relative;

    .category-image {
      position: relative;
      width: 100%;
      height: 220px;
      border-radius: 12px;
      overflow: hidden;
      padding: 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        width: 60%;
        height: auto;
        object-fit: contain;
        position: relative;
        z-index: 2;
        margin-left: auto;
        transform: scale(1.2);
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.1;
        background: #000;
        z-index: 1;
      }
    }

    .category-content {
      z-index: 3;
      width: 45%;

      h3 {
        color: #333;
        margin: 0 0 1.5rem 0;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1.2;
        text-align: left;
      }
    }
  }
}

@media (max-width: 768px) {
  .categories {
    .categories-grid {
      grid-template-columns: 1fr;
      padding: 0 1rem;
    }

    .category-card {
      .category-image {
        height: 180px;
        padding: 1.5rem;

        img {
          width: 45%;
          transform: scale(1.1);
        }
      }

      .category-content {
        width: 55%;
        
        h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>
