<script setup lang="ts">
import type { ProductsRedGlobal } from '@/types/common.d';
import { ref, computed, defineAsyncComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '@/store';

const RgCard = defineAsyncComponent(/* webpackChunkName: "rgCard" */() => import('@/components/UI/RgCard.vue'));
const RgImage = defineAsyncComponent(/* webpackChunkName: "rgImage" */() => import('@/components/UI/RgImage.vue'));

const props = defineProps({
  currentProduct: {
    type: Object as () => ProductsRedGlobal,
    required: true
  }
});

const productsStore = useProductsStore();
const router = useRouter();

const similarProducts = computed(() => {
  const allProducts = productsStore.products;
  if (!allProducts) return [];
  const matches = new Set<ProductsRedGlobal>();
  const firstTitleWord = props.currentProduct.name.split(' ')[0].toLowerCase();

  allProducts.forEach(product => {
    if (product.id !== props.currentProduct.id) {
      const productFirstWord = product.name.split(' ')[0].toLowerCase();
      if (productFirstWord === firstTitleWord) {
        matches.add(product);
      }
    }
  });

  if (props.currentProduct.description) {
    const firstDescWord = props.currentProduct.description.split(' ')[0].toLowerCase();
    allProducts.forEach(product => {
      if (product.id !== props.currentProduct.id && !matches.has(product)) {
        if (product.description?.toLowerCase().includes(firstDescWord)) {
          matches.add(product);
        }
      }
    });
  }

  if (matches.size < 16) {
    const remainingProducts = allProducts.filter(p =>
      p.id !== props.currentProduct.id && !matches.has(p)
    );

    const shuffled = remainingProducts.sort(() => 0.5 - Math.random());
    const needed = 16 - matches.size;
    shuffled.slice(0, needed).forEach(product => matches.add(product));
  }

  return Array.from(matches)
    .sort(() => 0.5 - Math.random())
    .slice(0, 16)
});

const currentIndex = ref(0);
const itemsPerView = 4;

const visibleProducts = computed(() => {
  return similarProducts.value.slice(currentIndex.value, currentIndex.value + itemsPerView);
});

const canScrollPrev = computed(() => currentIndex.value > 0);
const canScrollNext = computed(() => currentIndex.value + itemsPerView < similarProducts.value.length);

const totalPages = computed(() => Math.ceil(similarProducts.value.length / itemsPerView));
const currentPage = computed(() => Math.floor(currentIndex.value / itemsPerView) + 1);

const scrollPrev = () => {
  if (canScrollPrev.value) {
    currentIndex.value = Math.max(0, currentIndex.value - itemsPerView);
  }
};

const scrollNext = () => {
  if (canScrollNext.value) {
    currentIndex.value = Math.min(
      similarProducts.value.length - itemsPerView,
      currentIndex.value + itemsPerView
    );
  }
};

const navigateToProduct = (productId: string) => {
  router.push({ name: 'product', params: { id: productId } });
};

watch(
  () => props.currentProduct,
  (newProduct, oldProduct) => {
    if (newProduct && (!oldProduct || newProduct.id !== oldProduct.id)) {
      currentIndex.value = 0;
    }
  }
);
</script>

<template>
  <div class="similar-products">
    <h3>Productos Similares</h3>
    <div class="carousel-container">
      <button
        class="nav-button prev desktop-nav-button"
        :disabled="!canScrollPrev"
        @click="scrollPrev"
      >
        ‹
      </button>

      <div class="products-grid">
        <RgCard
          v-for="product in visibleProducts"
          :key="product.id"
          class="product-card"
          :products-view="product"
          @click="navigateToProduct(product.id)"
        >
          <template #header>
            <RgImage
              :src="product.mainImage"
              :alt="product.name"
              class="product-image"
            />
          </template>
          <template #content>
            <h4>{{ product.name }}</h4>
          </template>
        </RgCard>
      </div>

      <button
        class="nav-button next desktop-nav-button"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        ›
      </button>
    </div>

    <!-- Botones de navegación móviles abajo de los productos -->
    <div class="mobile-nav-buttons">
      <button
        class="nav-button prev"
        :disabled="!canScrollPrev"
        @click="scrollPrev"
      >
        ‹
      </button>

      <button
        class="nav-button next"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        ›
      </button>
    </div>

    <div class="pagination-indicator">
      <div class="dots">
        <span
          v-for="page in totalPages"
          :key="page"
          :class="['dot', { active: page === currentPage }]"
          @click="currentIndex = (page - 1) * itemsPerView"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.similar-products {
  margin-top: 2rem;
  padding: 1rem;
}

.similar-products h3 {
  font-size: 1.5rem;
  padding-bottom: 1rem;
  color: #1a202c;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.product-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.product-info h4 {
  font-size: 0.875rem;
  margin: 0;
  color: #2d3748;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.nav-button {
  background: white;
  border: 1px solid transparent;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #4a5568;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-button:hover:not(:disabled) {
  background: #f7fafc;
  color: #2d3748;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Botones de navegación móviles */
.mobile-nav-buttons {
  display: none;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Ocultar botones de navegación laterales y mostrar los de abajo en móvil */
  .desktop-nav-button {
    display: none;
  }

  .mobile-nav-buttons {
    display: flex;
  }
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.pagination-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  gap: 0.5rem;
}

.dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ddd;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dot.active {
  background-color: #2563eb;
}

.dot:hover {
  background-color: #93c5fd;
}
</style>
