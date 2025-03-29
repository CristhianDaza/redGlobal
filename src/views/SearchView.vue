<script setup lang="ts">
import type { ProductsRedGlobal } from '../types/common'

import { computed, defineAsyncComponent, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter, LocationQuery } from 'vue-router';
import { useProductsStore } from '../store/';
import RgLoader from '../components/UI/RgLoader.vue';

const route = useRoute();
const router = useRouter();
const storeProducts = useProductsStore();

// Estado de carga
const isLoading = ref(true);

// Inicializar con valores de la URL
const searchQuery = ref(route.query.search?.toString() || '');
const currentPage = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.size) || 16);

// Cargar y filtrar productos al montar
onMounted(async () => {
  isLoading.value = true;
  await storeProducts.getAllProducts();
  if (searchQuery.value) {
    storeProducts.filterProducts(searchQuery.value);
  }
  isLoading.value = false;
});

// Observar cambios en la búsqueda
watch(() => route.query.search, async (newSearch) => {
  searchQuery.value = newSearch?.toString() || '';
  isLoading.value = true;
  if (!storeProducts.products) {
    await storeProducts.getAllProducts();
  }
  storeProducts.filterProducts(searchQuery.value);
  currentPage.value = 1;
  isLoading.value = false;
}, { immediate: true });

const productsLength = computed(() => storeProducts.getProductsToView?.length || 0);
const totalPages = computed(() => Math.ceil(productsLength.value / pageSize.value));

const getPageNumbers = computed(() => {
  const totalNumbers = 10;
  const numbers: number[] = [];
  
  if (totalPages.value <= totalNumbers) {
    // Si hay 10 páginas o menos, mostrar todas
    for (let i = 1; i <= totalPages.value; i++) {
      numbers.push(i);
    }
  } else {
    // Si estamos cerca del inicio
    if (currentPage.value <= 6) {
      for (let i = 1; i <= 10; i++) {
        numbers.push(i);
      }
    }
    // Si estamos cerca del final
    else if (currentPage.value > totalPages.value - 6) {
      for (let i = totalPages.value - 9; i <= totalPages.value; i++) {
        numbers.push(i);
      }
    }
    // Si estamos en el medio
    else {
      for (let i = currentPage.value - 4; i <= currentPage.value + 5; i++) {
        numbers.push(i);
      }
    }
  }
  
  return numbers;
});

const handlePageSizeChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  pageSize.value = Number(select.value);
  currentPage.value = 1; // Reset a página 1
  router.push({ 
    query: { 
      ...route.query, 
      page: currentPage.value.toString(), 
      size: pageSize.value.toString() 
    } 
  });
};

const pageSizeOptions = computed(() => {
  const options: number[] = [];
  let size = 16;
  
  while (size <= 64) { // Hasta 64 (4 * 16)
    options.push(size);
    size += 16;
  }
  
  return options;
});

const RgCard = defineAsyncComponent(/* webpackChunkName: "rgCard" */() => import('../components/UI/RgCard.vue'));
const RgEmptyState = defineAsyncComponent(/* webpackChunkName: "rgEmptyState" */() => import('../components/UI/RgEmptyState.vue'));
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('../components/UI/RgButton.vue'));

const handlePageChange = (newPage: number): void => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    router.push({ query: { ...route.query, page: currentPage.value.toString() } });
  }
};

const productsToShow = computed<ProductsRedGlobal[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  const products = storeProducts.getProductsToView?.slice(start, end) || [];
  return products.map(product => ({
    ...product,
  }));
});

watch(
  () => route.query,
  (newQuery: LocationQuery) => {
    currentPage.value = Number(newQuery.page) || 1;
    pageSize.value = Number(newQuery.size) || 16;
  },
  { immediate: true }
);
</script>

<template>
  <div class="search">
    <template v-if="isLoading">
      <RgLoader>Buscando productos...</RgLoader>
    </template>
    <template v-else-if="productsLength > 0">
      <div class="search__container">
        <div class="search__products">
          <RgCard
            v-for="product in productsToShow"
            :key="product.id"
            :products-view="product"
          />
        </div>
        <div class="search__pagination-container">
          <div class="search__pagination">
            <RgButton
              :disabled="currentPage === 1"
              @click="handlePageChange(currentPage - 1)"
              icon="arrow-left"
              type="icon"
            />
            <div class="page-numbers">
              <RgButton
                v-for="page in getPageNumbers"
                :key="page"
                :class="{ active: page === currentPage }"
                @click="handlePageChange(page)"
                :custom-style="{
                  backgroundColor: page === currentPage ? '#ff4444' : '#f5f5f5',
                  color: page === currentPage ? '#fff' : '#333',
                  minWidth: '40px',
                  height: '40px',
                  padding: '0'
                }"
              >
                {{ page }}
              </RgButton>
            </div>
            <RgButton
              :disabled="currentPage === totalPages"
              @click="handlePageChange(currentPage + 1)"
              icon="arrow-right"
              type="icon"
            />
          </div>
          <div class="page-size">
            <label for="pageSize">Ver:</label>
            <select 
              id="pageSize" 
              v-model="pageSize"
              class="page-size-select"
              @change="handlePageSizeChange"
            >
              <option 
                v-for="size in pageSizeOptions" 
                :key="size" 
                :value="size"
              >
                {{ size }}
              </option>
            </select>
            <span>por página</span>
            <span class="pagination-info">
              • Página {{ currentPage }} de {{ totalPages }}
            </span>
          </div>
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
  padding: 0 2rem;
  min-height: calc(100vh - 300px);
}

.search__container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
}

.search__pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.search__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-info {
  margin-left: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.page-size {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.page-size-select {
  padding: 0.3rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.page-size-select:hover {
  border-color: #ff4444;
}

.page-size-select:focus {
  border-color: #ff4444;
  box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.1);
}

.search__products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

:deep(.page-numbers .tv-btn) {
  min-width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 8px;
  background: #f5f5f5;
  color: #333;
}

:deep(.search__pagination .tv-btn[type="icon"]) {
  min-width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 8px;
  background: #f5f5f5;
  color: #333;
}

:deep(.search__pagination .tv-btn[type="icon"]:hover:not(:disabled)) {
  background: #ff4444;
  color: white;
  opacity: 0.8;
}

:deep(.page-numbers .tv-btn.active) {
  background: #ff4444;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.25);
}

:deep(.page-numbers .tv-btn:hover:not(.active):not(:disabled)) {
  background: #ff4444;
  color: white;
  opacity: 0.8;
}

:deep(.tv-btn:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .search {
    padding: 1rem;
  }

  .search__products {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}
</style>
