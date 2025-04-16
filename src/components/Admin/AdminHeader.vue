<script setup lang="ts">
import { defineProps, defineEmits, defineAsyncComponent, computed } from 'vue'
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

const props = defineProps<{
  activeTab: 'menu' | 'users' | 'cards' | 'quotes'
  isAdmin: boolean
}>()

const emit = defineEmits<{
  (e: 'add-menu'): void
  (e: 'add-user'): void
  (e: 'add-card'): void
}>()

const handleAdd = () => {
  if (props.activeTab === 'menu') emit('add-menu')
  else if (props.activeTab === 'users') emit('add-user')
  else if (props.activeTab === 'cards') emit('add-card')
}

const activeTabHeader = computed(():string => {
  const headers = {
    menu: 'Menú',
    users: 'Usuarios',
    cards: 'Categorías',
    quotes: 'Cotizaciones',
  };
  return headers[props.activeTab];
});


const activeTabText = computed(():string => {
  const text = {
    menu: 'Agregar un Menú',
    users: 'Crear un Usuario',
    cards: 'Agregar una Categoría',
    quotes: '',
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
