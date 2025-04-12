<script setup lang="ts">
import { onMounted, computed, defineAsyncComponent } from 'vue';
import { useProductsStore } from '@/store';

const RgHero = defineAsyncComponent(/* webpackChunkName: "rgHero" */() => import('@/components/home/RgHero.vue'));
const RgCategories = defineAsyncComponent(/* webpackChunkName: "rgCategories" */() => import('@/components/home/RgCategories.vue'));
const RgVarietyBanner = defineAsyncComponent(/* webpackChunkName: "rgVarietyBanner" */() => import('@/components/home/RgVarietyBanner.vue'));
const RgCard = defineAsyncComponent(/* webpackChunkName: "rgCard" */() => import('@/components/UI/RgCard.vue'));

const store = useProductsStore();

onMounted(async () => {
  await store.getAllProducts();
});

const popularProducts = computed(() => {
  if (!store.products) return [];

  const shuffled = [...store.products];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 12);
});

</script>

<template>
  <main class="home">
    <RgHero
      title="Hacemos de tus regalos corporativos la mejor experiencia."
      subtitle="Personaliza"
      subtitle2=" tus productos."
      buttonText="Productos"
      background-image="https://firebasestorage.googleapis.com/v0/b/mega2024-6a453.appspot.com/o/cat-07.png?alt=media&token=67742bed-a013-46d9-b5ec-7abc9c617068"
      routeButton="products"
    />

    <div class="container">
      <RgCategories />

      <section class="popular-products">
        <h2 class="section-title">Algunos de nuestros productos</h2>
        <div class="products-grid">
          <router-link :to="{name: 'product', params: {id: product.id}}" v-for="product in popularProducts" :key="product.id">
            <RgCard
              :products-view="product"
            />
          </router-link>
        </div>
      </section>
    </div>
    <RgVarietyBanner
      titleInit="Tenemos"
      titleEnd="de productos, para que encuentres el que más se adapte a tu necesidad."
      highlightWord="variedad"
    />
  </main>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.home {
  margin: 0;
  padding: 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 3rem 0 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 2rem;
  padding: 1rem 0;
  justify-content: center;
}

.container {
  width: 90%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
    margin: 2rem 0 1rem;
  }
}
</style>
