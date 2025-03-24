<script setup lang="ts">
import type { ProductsRedGlobal } from '../../types/common';
import RgImage from './RgImage.vue';

const props = defineProps<{
  productsView: ProductsRedGlobal;
}>();
</script>

<template>
  <div class="product">
    <RgImage
      :src="productsView.mainImage"
      :alt="productsView.name"
      width="100"
      height="100"
    />
    <div class="product-info">
      <h3 class="product-name">{{ productsView.name }}</h3>
      <p class="product-api">{{ productsView.api }}</p>
      <p class="product-description">{{ productsView.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.product {
  width: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-api {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.product-description {
  font-size: 14px;
  color: #444;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.product:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
