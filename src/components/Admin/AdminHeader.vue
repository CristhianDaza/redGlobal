<script setup lang="ts">
import type { tabs } from '@/types/common.d'
import { defineAsyncComponent, computed } from 'vue'
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

const props = defineProps<{
  activeTab: tabs
  isAdmin: boolean
}>()

const emit = defineEmits<{
  (e: 'add-menu'): void
  (e: 'add-user'): void
  (e: 'add-card'): void
  (e: 'add-catalog'): void
}>()

const handleAdd = () => {
  if (props.activeTab === 'menu') emit('add-menu')
  else if (props.activeTab === 'users') emit('add-user')
  else if (props.activeTab === 'cards') emit('add-card')
  else if (props.activeTab === 'catalogs') emit('add-catalog')
}

const activeTabHeader = computed(():string => {
  const headers = {
    menu: 'Menú',
    users: 'Usuarios',
    cards: 'Categorías',
    quotes: 'Cotizaciones',
    catalogs: 'Catálogos',
  };
  return headers[props.activeTab];
});


const activeTabText = computed(():string => {
  const text = {
    menu: 'Agregar un Menú',
    users: 'Crear un Usuario',
    cards: 'Agregar una Categoría',
    quotes: '',
    catalogs: 'Agregar un Catálogo',
  }
  return text[props.activeTab];
})
</script>

<template>
  <header class="main-header">
    <h1>
      {{ activeTabHeader }}
    </h1>

    <RgButton
      v-if="activeTab !== 'quotes' && isAdmin"
      :text="activeTabText"
      class="add-button"
      @click="handleAdd"
      type="default"
      rounded
    />
  </header>
</template>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.main-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}
</style>
