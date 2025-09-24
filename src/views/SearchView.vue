<script setup lang="ts">
import type { ProductsRedGlobal } from '@/types/common.d'
import { useHead } from '@vueuse/head';
import { computed, defineAsyncComponent, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter, LocationQuery } from 'vue-router';
import { useProductsStore } from '@/store/';
import { useIsMobile } from "@/composable";

const RgCard = defineAsyncComponent(/* webpackChunkName: "rgCard" */() => import('@/components/UI/RgCard.vue'));
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
  const options: { value: number; label: string }[] = [];
  const totalProducts = productsLength.value;
  
  if (totalProducts === 0) {
    return [
      { value: 16, label: '16' },
      { value: 32, label: '32' },
      { value: 48, label: '48' },
      { value: 64, label: '64' }
    ];
  }
  
  let size = 16;
  
  while (size <= Math.min(64, totalProducts)) {
    options.push({ value: size, label: size.toString() });
    size += 16;
  }

  const lastOption = options[options.length - 1];
  if (totalProducts > lastOption.value) {
    options.push({ 
      value: totalProducts, 
      label: `Todos (${totalProducts})` 
    });
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
  <div class="search-view">
    <div class="search-section">
      <div class="section-header">
        <h2>
          <span class="material-icons">search</span>
          Resultados de Búsqueda
        </h2>
        <p class="section-description" v-if="searchQuery">
          Mostrando resultados para: <strong>"{{ searchQuery }}"</strong>
        </p>
        <p class="section-description" v-else>
          Explora nuestro catálogo completo de productos promocionales
        </p>
      </div>

      <template v-if="isLoading">
        <div class="loading-section">
          <div class="loading-container">
            <RgLoader>Buscando productos...</RgLoader>
            <p class="loading-text">Explorando nuestro catálogo para ti...</p>
          </div>
        </div>
      </template>

      <template v-else-if="productsLength > 0">
        <div class="results-info">
          <div class="results-summary">
            <div class="results-count">
              <span class="material-icons">inventory_2</span>
              <span class="count-text">
                <strong>{{ productsLength }}</strong> productos encontrados
              </span>
            </div>
            <div class="view-options">
              <label for="pageSize" class="view-label">
                <span class="material-icons">visibility</span>
                Ver:
              </label>
              <select
                id="pageSize"
                v-model="pageSize"
                class="page-size-select"
                @change="handlePageSizeChange"
              >
                <option v-for="option in pageSizeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <span class="view-suffix">por página</span>
            </div>
          </div>
        </div>

        <div class="products-container">
          <div class="products-grid">
            <router-link
              v-for="product in productsToShow"
              :key="product.id"
              :to="{ name: 'product', params: { id: product?.id } }"
              class="product-link"
            >
              <div class="product-card-wrapper">
                <RgCard :products-view="product" />
              </div>
            </router-link>
          </div>
        </div>

        <!-- Información adicional cuando se muestran todos los productos -->
        <div class="info-section" v-if="pageSize >= productsLength && productsLength > 16">
          <div class="all-products-info">
            <span class="material-icons">done_all</span>
            <span>Mostrando todos los <strong>{{ productsLength }}</strong> productos encontrados</span>
          </div>
        </div>

        <div class="pagination-section" v-if="totalPages > 1 && pageSize < productsLength">
          <div class="pagination-info">
            <span class="material-icons">info</span>
            <span v-if="pageSize >= productsLength">
              Mostrando todos los {{ productsLength }} productos
            </span>
            <span v-else>
              Página {{ currentPage }} de {{ totalPages }} • Mostrando {{ Math.min(pageSize, productsLength - (currentPage - 1) * pageSize) }} de {{ productsLength }} productos
            </span>
          </div>
          
          <div class="pagination-controls">
            <RgButton
              :disabled="currentPage === 1"
              @click="handlePageChange(currentPage - 1)"
              icon="arrow-left"
              outlined
              type="icon"
              :customStyle="{
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-color)',
              }"
            />
            
            <div class="page-numbers">
              <RgButton
                v-for="page in getPageNumbers"
                :key="page"
                :class="{ active: page === currentPage }"
                @click="handlePageChange(page)"
                :customStyle="getButtonStyle(page)"
              >
                {{ page }}
              </RgButton>
            </div>
            
            <RgButton
              :disabled="currentPage === totalPages"
              @click="handlePageChange(currentPage + 1)"
              icon="arrow-right"
              type="icon"
              :customStyle="{
                backgroundColor: 'var(--primary-color)',
                color: '#ffffff',
              }"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="empty-state">
          <div class="empty-icon">
            <span class="material-icons">search_off</span>
          </div>
          <h3>No encontramos productos</h3>
          <p v-if="searchQuery">
            No encontramos productos que coincidan con <strong>"{{ searchQuery }}"</strong>.
            Prueba con otras palabras clave o explora nuestro catálogo completo.
          </p>
          <p v-else>
            No hay productos disponibles en este momento.
          </p>
          <div class="empty-actions">
            <RgButton
              icon="filter"
              @click="() => router.push('/products')"
              :customStyle="{
                backgroundColor: 'var(--primary-color)',
                color: '#ffffff',
              }"
            >
              Ver Productos
            </RgButton>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.search-view {
  background: #f8fafc;
  min-height: 100vh;
}

.search-section {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.section-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.section-header .material-icons {
  color: var(--primary-color);
  font-size: 2.5rem;
}

.section-description {
  color: #718096;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

.loading-section {
  padding: 4rem 2rem;
  text-align: center;
}

.loading-container {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading-text {
  margin-top: 1rem;
  color: #718096;
  font-size: 1rem;
}

.results-info {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  overflow: hidden;
}

.results-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.results-count {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 1.1rem;
}

.results-count .material-icons {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.count-text {
  font-weight: 500;
}

.view-options {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.view-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.view-label .material-icons {
  font-size: 16px;
  color: var(--primary-color);
}

.page-size-select {
  padding: 0.5rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: #fff;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.page-size-select:hover {
  border-color: var(--primary-color);
}

.page-size-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
}

.view-suffix {
  font-weight: 500;
}

.products-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  padding: 2rem;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-link {
  text-decoration: none;
  color: inherit;
}

.product-card-wrapper {
  height: 100%;
  transition: all 0.3s ease;
}

.product-card-wrapper:hover {
  transform: translateY(-4px);
}

.info-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.all-products-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 500;
}

.all-products-info .material-icons {
  color: #10b981;
  font-size: 1.25rem;
}

.pagination-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

.pagination-info .material-icons {
  color: var(--primary-color);
  font-size: 16px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.empty-icon .material-icons {
  font-size: 2.5rem;
}

.empty-state h3 {
  color: #2d3748;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-state p {
  color: #718096;
  margin: 0 0 2rem 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

@media (max-width: 1024px) {
  .results-summary {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .search-section {
    padding: 1rem;
  }
  
  .section-header {
    padding: 1.5rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .products-container {
    padding: 1.5rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
  
  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .view-options {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .section-header h2 {
    font-size: 1.75rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .results-summary {
    padding: 1rem;
  }
  
  .pagination-section {
    padding: 1.5rem;
  }
}
</style>
