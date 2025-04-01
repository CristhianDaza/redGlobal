<script setup lang="ts">
import { onMounted } from 'vue';
import { useProductsStore } from '../store/useProductsStore';
import RgCard from '../components/UI/RgCard.vue';

const productsStore = useProductsStore();

onMounted(async () => {
  if (!productsStore.products) {
    await productsStore.getAllProducts();
  }
});
</script>

<template>
  <div class="products-view">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <div v-if="!$route.params.id" class="products-grid">
      <RgCard
        v-for="product in productsStore.getProductsToView"
        :key="product.id"
        :products-view="product"
      />
    </div>
  </div>
</template>

<style scoped>
.products-view {
  padding: 2rem 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>