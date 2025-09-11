<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from 'vue';
import { useCategoryStore } from '@/store';

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('../UI/RgButton.vue'));

const categoryStore = useCategoryStore();

onMounted(async () => {
  if (!categoryStore.categoryCards || categoryStore.categoryCards.length === 0) {
    await categoryStore.getCategoryCards();
  }
});

const activeCategories = computed(() => {
  return categoryStore.categoryCards.filter(card => card.active);
});

const customStyle = {
  backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
  color: '#fff',
};
</script>

<template>
  <section class="categories">
    <div class="categories-grid">
      <router-link
        v-for="category in activeCategories"
        :key="category.id"
        :to="category.url"
        class="category-card"
      >
        <div class="category-image" :style="{ backgroundColor: category.backgroundColor }">
          <div class="category-content">
            <h3 :style="{ color: category.textColor }">{{ category.title }}</h3>
            <RgButton
              :text="category.buttonText"
              :custom-style="customStyle"
            />
          </div>
          <img :src="category.imageUrl" :alt="category.title" class="category-img" />
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

      .category-img {
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

        .category-img {
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
