<script setup>
import { ref, onMounted } from 'vue'
const storeProducts = useProductsStore()
const versionApp = import.meta.env.VITE_VERSION_APP
import { useFilters } from './composable'
import { useProductsStore } from './store'

const search = ref('')

const { filterProducts, clearFilters } = useFilters()

const callAdmin = async () => {
  await storeProducts.getAllProducts(true)
  console.log(storeProducts.products)
  console.log(storeProducts.lastUpdateProducts)
}

onMounted(() => {
  callAdmin()
})
</script>

<template>
  <h1>Red Global v{{ versionApp }}</h1>
  <input type="text" v-model="search" placeholder="Buscar..."/>
  <button @click="filterProducts('search', search)">Buscar</button>
  <button @click="clearFilters('search')">Limpiar filtros</button>
  <RouterView />
</template>

<style scoped>
</style>
