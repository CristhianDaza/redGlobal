<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { onMounted, computed, defineAsyncComponent, ref } from 'vue';
import { useProductsStore, useOurClientsStore} from '@/store';
import { useCarouselStore } from '@/store/useCarouselStore.ts';
import { Carousel, Slide } from 'vue-snap';
import { preloadService } from '@/services';
import 'vue-snap/dist/vue-snap.css';

const RgCategories = defineAsyncComponent(/* webpackChunkName: "rgCategories" */() => import('@/components/home/RgCategories.vue'));
const RgVarietyBanner = defineAsyncComponent(/* webpackChunkName: "rgVarietyBanner" */() => import('@/components/home/RgVarietyBanner.vue'));
const RgCard = defineAsyncComponent(/* webpackChunkName: "rgCard" */() => import('@/components/UI/RgCard.vue'));
const RgOurClients = defineAsyncComponent(/* webpackChunkName: "rgOurClients" */() => import('@/components/UI/RgOurClients.vue'));

const store = useProductsStore();
const ourClientsStore = useOurClientsStore();
const carouselStore = useCarouselStore();
const carousel = ref();
const direction = ref(1);

const onLeftBounded = () => {
  direction.value = 1;
};

const onRightBounded = () => {
  direction.value = -1;
};

onMounted(async () => {
  if (!store.products || store.products.length === 0) {
    await store.getAllProducts();
  }
  if (!ourClientsStore.ourClients || ourClientsStore.ourClients.length === 0) {
    await ourClientsStore.getOurClients();
  }
  if (!carouselStore.carousel || carouselStore.carousel.length === 0) {
    await carouselStore.getCarousel();
  }

  // Preload carousel images for better UX
  if (carouselStore.carousel?.length) {
    const carouselImages = carouselStore.carousel
      .map(slide => slide.imageUrl)
      .filter(Boolean);
    preloadService.preloadCriticalImages(carouselImages, []);
  }

  setInterval(() => {
    carousel.value?.changeSlide(direction.value);
  }, 5000);
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
      <div v-if="carouselStore.isLoadingCarousel" class="carousel-loader">
        <div class="loader"></div>
      </div>

      <Carousel
        v-else
        class="carousel"
        ref="carousel"
        :hide-arrows="false"
        :hide-arrows-on-bound="false"
        @left-bound="onLeftBounded"
        @right-bound="onRightBounded"
      >
        <Slide v-for="slide in carouselStore.carousel" :key="slide">
          <div class="slide">
            <router-link :to="slide.toRoute">
              <img :src="slide?.imageUrl" :alt="slide?.title" class="carousel-image" />
            </router-link>
          </div>
        </Slide>
      </Carousel>

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

.carousel {
  width: 100%;
  height: auto;
  margin-top: 2rem;
  overflow: hidden;
}

.carousel .vs-carousel__wrapper {
  min-height: 600px;
  max-height: 600px;
  height: 600px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Carousel navigation arrows */
.carousel :deep(.vs-carousel__navigation) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.carousel :deep(.vs-carousel__navigation-button) {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--primary-color, #ff4444);
  color: var(--primary-color, #ff4444);
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.carousel :deep(.vs-carousel__navigation-button:hover) {
  background: var(--primary-color, #ff4444);
  color: white;
  transform: scale(1.1);
}

.carousel :deep(.vs-carousel__navigation-button:focus) {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.3);
}

.carousel :deep(.vs-carousel__navigation-prev) {
  left: 20px;
}

.carousel :deep(.vs-carousel__navigation-next) {
  right: 20px;
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

.carousel-loader {
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

  /* Mobile carousel arrows */
  .carousel :deep(.vs-carousel__navigation-button) {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .carousel :deep(.vs-carousel__navigation-prev) {
    left: 10px;
  }

  .carousel :deep(.vs-carousel__navigation-next) {
    right: 10px;
  }
}
</style>
