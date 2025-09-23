<script setup lang="ts">
import type { tabs } from '@/types/common.d'
import { defineAsyncComponent, computed } from 'vue'
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'))

const props = defineProps<{
  activeTab: tabs
  isAdmin: boolean
  isDisabled?: boolean
  colorCount?: number
}>()

const emit = defineEmits<{
  (e: 'add-menu'): void
  (e: 'add-user'): void
  (e: 'add-card'): void
  (e: 'add-catalog'): void
  (e: 'delete-all-quote'): void
  (e: 'add-carousel'): void
  (e: 'add-our-clients'): void
  (e: 'add-color'): void
  (e: 'add-advisor'): void
}>()

const handleEventButton = () => {
  const eventMap: Record<tabs, string> = {
    menu: 'add-menu',
    users: 'add-user',
    cards: 'add-card',
    catalogs: 'add-catalog',
    quotes: 'delete-all-quote',
    'advanced-quotes': 'delete-all-quote',
    carousel: 'add-carousel',
    'our-clients': 'add-our-clients',
    color: 'add-color',
    advisors: 'add-advisor',
  }
  const event = eventMap[props.activeTab]
  if (event) emit(event as any)
}

const activeTabHeader = computed(():string => {
  const headers = {
    menu: 'Menú',
    users: 'Usuarios',
    cards: 'Categorías',
    quotes: 'Cotizaciones',
    'advanced-quotes': 'Cotizaciones Avanzadas',
    catalogs: 'Catálogos',
    carousel: 'Imágenes del Carrusel',
    'our-clients': 'Imágenes de Clientes',
    color: 'Color Principal',
    advisors: 'Asesores',
  }
  return headers[props.activeTab]
})

const activeTabText = computed(():string => {
  const text = {
    menu: 'Agregar un Menú',
    users: 'Crear un Usuario',
    cards: 'Agregar una Categoría',
    quotes: 'Limpiar Cotizaciones',
    'advanced-quotes': 'Gestionar Cotizaciones',
    catalogs: 'Agregar un Catálogo',
    carousel: 'Agregar Imagen al Carrusel',
    'our-clients': 'Agregar Imagen de Cliente',
    color: 'Crear Color Principal',
    advisors: 'Agregar Asesor',
  }
  return text[props.activeTab]
})

const disabled = computed(() => {
  return props.isDisabled || (props.activeTab === 'color' && (props.colorCount ?? 0) >= 1)
})
</script>

<template>
  <header class="main-header" v-if="activeTab !== 'advanced-quotes' && activeTab !== 'privacy-policy'">
    <h1>
      {{ activeTabHeader }}
    </h1>

    <RgButton
      v-if="isAdmin"
      :text="activeTabText"
      class="add-button"
      @click="handleEventButton"
      type="default"
      rounded
      :disabled="disabled"
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
