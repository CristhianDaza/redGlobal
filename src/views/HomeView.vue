<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { onMounted, computed, defineAsyncComponent, ref } from 'vue';
import { useProductsStore, useOurClientsStore} from '@/store';
import { useHeroStore } from '@/store/useHeroStore';
import personalizeProducts from '@/assets/images/personaliza-productos.png';

const RgHero = defineAsyncComponent(/* webpackChunkName: "rgHero" */() => import('@/components/home/RgHero.vue'));
const RgCategories = defineAsyncComponent(/* webpackChunkName: "rgCategories" */() => import('@/components/home/RgCategories.vue'));
const RgVarietyBanner = defineAsyncComponent(/* webpackChunkName: "rgVarietyBanner" */() => import('@/components/home/RgVarietyBanner.vue'));
const RgCard = defineAsyncComponent(/* webpackChunkName: "rgCard" */() => import('@/components/UI/RgCard.vue'));
const RgOurClients = defineAsyncComponent(/* webpackChunkName: "rgOurClients" */() => import('@/components/UI/RgOurClients.vue'));

const store = useProductsStore();
const ourClientsStore = useOurClientsStore();
const heroStore = useHeroStore();
const showHeroLoader = ref(true);

onMounted(async () => {
  if (!store.products || store.products.length === 0) {
    await store.getAllProducts();
  }
  if (!ourClientsStore.ourClients || ourClientsStore.ourClients.length === 0) {
    await ourClientsStore.getOurClients();
  }
  await heroStore.getHero();
  showHeroLoader.value = false;
});

const popularProducts = computed(() => {
  if (!store.products || store.products.length === 0) return [];

  const shuffled = [...store.products];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 12);
});

const heroImage = computed(() => {
  return heroStore.hero && heroStore.hero.length > 0 && heroStore.hero[0]?.imageUrl
    ? heroStore.hero[0].imageUrl
    : personalizeProducts;
});

useHead({
  title: 'Inicio – Red Global Promocional',
  meta: [
    { name: 'description', content: 'Regalos corporativos y productos promocionales personalizados. Encuentra la mejor variedad para tu empresa.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Inicio – Red Global Promocional' },
    { property: 'og:description', content: 'Regalos corporativos y productos promocionales personalizados. Encuentra la mejor variedad para tu empresa.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:url', content: 'https://redglobalpromocionales.com/' }
  ],
  link: [
    { rel: 'canonical', href: 'https://redglobalpromocionales.com/' }
  ]
});
</script>

<template>
  <main class="home">
    <div v-if="showHeroLoader" class="hero-loader">
      <div class="loader"></div>
    </div>
    <RgHero
      v-else
      title="Hacemos de tus regalos corporativos la mejor experiencia."
      subtitle="Personaliza"
      subtitle2=" tus productos."
      buttonText="Productos"
      :background-image="heroImage"
      routeButton="products"
    />

    <div class="container">
      <RgCategories />
    </div>
      <RgOurClients
        :images="ourClientsStore.ourClients.length > 0 ? ourClientsStore.ourClients : []"
      />
    <div class="container">
      <section class="popular-products">
        <h2 class="section-title">Algunos de nuestros productos</h2>
        <div class="products-grid">
          <router-link :to="{name: 'product', params: {id: product?.id}}" v-for="product in popularProducts" :key="product?.id">
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
  grid-template-columns: repeat(4, 280px);
  gap: 2rem;
  padding: 1rem 0;
  justify-content: center;
}

.container {
  width: 90%;
  margin: 0 auto;
}

.hero-loader {
  width: 100vw;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid var(--primary-color, #3182ce);
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
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
