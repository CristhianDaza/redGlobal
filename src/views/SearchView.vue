<script setup lang="ts">
import type { ProductsRedGlobal } from '../types/common'

import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useRoute, useRouter, LocationQuery } from 'vue-router';
import { useProductsStore } from '../store/';

const route = useRoute();
const router = useRouter();
const storeProducts = useProductsStore();

const currentPage = ref<number>(Number(route.query.page) || 1);
const pageSize = ref<number>(Number(route.query.size) || 15);

const productsLength = computed(() => storeProducts.getProductsToView?.length || 0);
const totalPages = computed(() => Math.ceil(productsLength.value / pageSize.value));

const RgCard = defineAsyncComponent(/* webpackChunkName: "rgCard" */() => import('../components/UI/RgCard.vue'));
const RgEmptyState = defineAsyncComponent(/* webpackChunkName: "rgEmptyState" */() => import('../components/UI/RgEmptyState.vue'));

const nextPage = (): void => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    router.push({ query: { ...route.query, page: currentPage.value.toString() } });
  }
};

const prevPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--;
    router.push({ query: { ...route.query, page: currentPage.value.toString() } });
  }
};

const paginatedProducts = computed<ProductsRedGlobal[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  const products = storeProducts.getProductsToView?.slice(start, end) || [];
  return products.map(product => ({
    ...product,
  }));
});

const changePageSize = (newSize: number): void => {
  pageSize.value = newSize;
  currentPage.value = 1;
  router.push({ 
    query: { 
      ...route.query, 
      page: currentPage.value.toString(), 
      size: newSize.toString() 
    } 
  });
};

const handlePageSizeChange = (event: Event): void => {
  const select = event.target as HTMLSelectElement;
  changePageSize(Number(select.value));
};

const generatePageSizeOptions = (totalProducts: number): number[] => {
  const options: number[] = [];
  let step = 15;

  while (step < totalProducts) {
    options.push(step);
    step += 15;
  }

  if (!options.includes(totalProducts)) {
    options.push(totalProducts);
  }

  return options;
};

watch(
  () => route.query,
  (newQuery: LocationQuery) => {
    currentPage.value = Number(newQuery.page) || 1;
    pageSize.value = Number(newQuery.size) || 15;
  },
  { immediate: true }
);
</script>

<template>
  <div class="search">
    <h1>Productos</h1>
    <template v-if="productsLength > 0">
      <div class="search__container">
        <div class="search__pagination">
          <button 
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            Anterior
          </button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button 
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            Siguiente
          </button>
        </div>
        <div class="search__size">
          <label for="pageSize">Productos por página:</label>
          <select 
            id="pageSize"
            :value="pageSize"
            @change="handlePageSizeChange"
          >
            <option 
              v-for="size in generatePageSizeOptions(productsLength)"
              :key="size"
              :value="size"
            >
              {{ size }}
            </option>
          </select>
        </div>
        <div class="search__products">
          <RgCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :products-view="product"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <RgEmptyState 
        :title="'No encontramos productos'"
        :message="'Lo sentimos, no encontramos productos que coincidan con tu búsqueda. Prueba con otras palabras clave o explora nuestro catálogo.'"
        :show-actions="true"
      />
    </template>
  </div>
</template>

<style scoped>
.search {
  padding: 20px;
}

.search__container {
  margin-top: 20px;
}

.search__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search__pagination button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

.search__pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.search__size {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search__size select {
  padding: 4px 8px;
  border-radius: 4px;
}

.search__products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
</style>
