<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFilters } from './composable';
import { useProductsStore } from './store';

const storeProducts = useProductsStore();
const versionApp = import.meta.env.VITE_VERSION_APP;
const search = ref<string>('');

const { filterProducts, clearFilters } = useFilters();

const callAdmin = async (): Promise<void> => {
  await storeProducts.getAllProducts(true);
};

onMounted(() => {
  callAdmin();
});
</script>

<template>
  <h1>Red Global v{{ versionApp }}</h1>
  <input type="text" v-model="search" placeholder="Buscar..." />
  <button @click="filterProducts('search', search)">Buscar</button>
  <button @click="clearFilters('search')">Limpiar filtros</button>
  <RouterView />
</template>

<style scoped>
</style>
