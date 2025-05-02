<script setup lang="ts">
import type { ProductsRedGlobal } from '@/types/common.d'
import { useHead } from '@vueuse/head';
import { computed, defineAsyncComponent, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter, LocationQuery } from 'vue-router';
import { useProductsStore } from '@/store/';
import { useIsMobile } from "@/composable";

const RgCard = defineAsyncComponent(/* webpackChunkName: "rgCard" */() => import('@/components/UI/RgCard.vue'));
const RgEmptyState = defineAsyncComponent(/* webpackChunkName: "rgEmptyState" */() => import('@/components/UI/RgEmptyState.vue'));
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));
const RgLoader = defineAsyncComponent(/* webpackChunkName: "rgLoader" */() => import('@/components/UI/RgLoader.vue'));

const route = useRoute();
const router = useRouter();
const storeProducts = useProductsStore();
const { isSize610, isSize320 } = useIsMobile();

const isLoading = ref(true);

const searchQuery = ref(decodeURIComponent(route.query.search?.toString() || '').replace(/\+/g, ' '));
const currentPage = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.size) || 16);

onMounted(async () => {
  isLoading.value = true;
  if (!storeProducts.products) {
    await storeProducts.getAllProducts();
  }
  if (searchQuery.value) {
    storeProducts.filterProducts(searchQuery.value);
  }
  isLoading.value = false;
});

watch([() => route.query.search, () => route.query.category], async ([newSearch, newCategory]) => {
  searchQuery.value = decodeURIComponent(newSearch?.toString() || '').replace(/\+/g, ' ');
  const category = decodeURIComponent(newCategory?.toString() || '').replace(/\+/g, ' ');
  isLoading.value = true;
  if (!storeProducts.products) {
    await storeProducts.getAllProducts();
  }
  storeProducts.filterProducts(searchQuery.value, category);
  currentPage.value = 1;
  isLoading.value = false;
}, { immediate: true });

const productsLength = computed(() => storeProducts.getProductsToView?.length || 0);
const totalPages = computed(() => Math.ceil(productsLength.value / pageSize.value));

const getPageNumbers = computed(() => {
  const totalNumbers = isSize320.value
    ? 3
    : (isSize610.value ? 5 : 10);

  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;
  const half = Math.floor(totalNumbers / 2);

  if (total <= totalNumbers) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else if (current <= half + 1) {
    for (let i = 1; i <= totalNumbers; i++) pages.push(i);
  } else if (current >= total - half) {
    for (let i = total - totalNumbers + 1; i <= total; i++) pages.push(i)
  } else {
    const start = current - half
    for (let i = 0; i < totalNumbers; i++) {
      pages.push(start + i)
    }
  }

  return pages
});

const handlePageSizeChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  pageSize.value = Number(select.value);
  currentPage.value = 1;
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

  while (size <= 64) {
    options.push(size);
    size += 16;
  }

  return options;
});

const getButtonStyle = (page: number) => ({
  backgroundColor: page === currentPage.value ? 'var(--primary-color)' : '#f5f5f5',
  color: page === currentPage.value ? '#fff' : '#333',
  minWidth: '40px',
  height: '40px',
  padding: '0',
  margin: '0 4px'
});

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

useHead({
  title: 'Buscar productos – Red Global Promocional',
  meta: [
    { name: 'description', content: 'Busca productos promocionales y regalos corporativos en nuestro catálogo. Resultados filtrados y paginados.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Buscar productos – Red Global Promocional' },
    { property: 'og:description', content: 'Busca productos promocionales y regalos corporativos en nuestro catálogo. Resultados filtrados y paginados.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:url', content: 'https://redglobalpromocionales.com/search' }
  ],
  link: [
    { rel: 'canonical', href: 'https://redglobalpromocionales.com/search' }
  ]
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
          <router-link
            v-for="product in productsToShow"
            :key="product.id"
            :to="{ name: 'product', params: { id: product.id } }"
          >
            <RgCard
              :products-view="product"
            />
          </router-link>
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
                :custom-style="getButtonStyle(page)"
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
  border-color: var(--primary-color);
}

.page-size-select:focus {
  border-color: var(--primary-color);
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
  background: var(--primary-color);
  color: white;
  opacity: 0.8;
}

:deep(.page-numbers .tv-btn.active) {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.25);
}

:deep(.page-numbers .tv-btn:hover:not(.active):not(:disabled)) {
  background: var(--primary-color);
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
