<script lang="ts" setup>
import { defineAsyncComponent, onMounted } from 'vue'
import { useCatalogAdmin } from '@/composable'

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'))

const { catalogs, loadCatalogs, isLoadingCatalog } = useCatalogAdmin()

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
      <p>Cargando catálogos...</p>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: sans-serif;
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
  grid-template-columns: repeat(5, 1fr);
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
  height: 300px;
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
