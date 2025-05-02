<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { defineAsyncComponent, onMounted } from 'vue'
import { useCatalogAdmin } from '@/composable'

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'))
const RgLoader = defineAsyncComponent(/* webpackChunkName: "rgLoader" */() => import('@/components/UI/RgLoader.vue'))

const { catalogs, loadCatalogs, isLoadingCatalog } = useCatalogAdmin()

useHead({
  title: 'Catálogos – Red Global Promocionales',
  meta: [
    { name: 'description', content: 'Descarga nuestros catálogos de regalos corporativos y productos promocionales. Gran variedad para tu empresa.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Catálogos – Red Global Promocionales' },
    { property: 'og:description', content: 'Descarga nuestros catálogos de regalos corporativos y productos promocionales. Gran variedad para tu empresa.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:url', content: 'https://redglobalpromocionales.com/catalogos' }
  ],
  link: [
    { rel: 'canonical', href: 'https://redglobalpromocionales.com/catalogos' }
  ]
})

onMounted(() => {
  if (!catalogs.value || catalogs.value.length === 0) {
    loadCatalogs()
  }
})
</script>

<template>
  <div class="catalog-page">
    <h1 class="page-title">Nuestros Catálogos</h1>

    <div v-if="isLoadingCatalog" class="loader">
      <RgLoader>Cargando catálogos...</RgLoader>
    </div>

    <div v-else class="catalog-grid">
      <a
        v-for="catalog in catalogs"
        :key="catalog.id"
        :href="catalog.toRoute"
        target="_blank"
      >
        <div class="catalog-card">
          <img
            :src="catalog.imageUrl"
            :alt="catalog.title"
            class="catalog-image"
          />
          <h2 class="catalog-title">{{ catalog.title }}</h2>
          <div class="button-container">
            <RgButton full icon="share">
              Ver Catálogo
            </RgButton>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.catalog-page {
  padding: 1rem;
  margin: 0 2rem;
}

.page-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.loader {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #555;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.catalog-card {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.catalog-card:hover {
  transform: scale(1.02);
}

.catalog-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
}

.catalog-title {
  margin: 1rem;
  font-size: 1.2rem;
  text-align: center;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
