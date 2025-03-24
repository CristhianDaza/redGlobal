<script setup lang="ts">
import type { ProductsRedGlobal } from '../../types/common';
import { formatNumber } from '../../utils/helpers';
import RgImage from './RgImage.vue';

const props = defineProps<{
  productsView: ProductsRedGlobal;
}>();
</script>

<template>
  <div class="product">
    <div class="product-image-container">
      <RgImage
        :src="productsView.mainImage"
        :alt="productsView.name"
        width="100"
        height="100"
      />
    </div>
    <div class="product-content">
      <p class="product-category">{{ productsView.category?.[0] || '' }}</p>
      <h3 class="product-name">{{ productsView.name }}</h3>
      <p class="product-code">{{ productsView.id }}</p>
      <div class="product-stock">
        <p class="stock-label">Unidades disponibles:</p>
        <p class="stock-amount">{{ formatNumber(productsView.totalProducts)}} und.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 280px;
  min-height: 360px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.product-image-container :deep(img) {
  max-width: 100%;
  max-height: 200px;
  width: auto;
  height: auto;
  object-fit: contain;
}

.product-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 160;
}

.product-category {
  color: #666;
  font-size: 0.75rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  height: 2.6em;
}

.product-code {
  color: #999;
  font-size: 0.75rem;
  margin: 0;
  line-height: 1;
}

.product-stock {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stock-label {
  color: #666;
  font-size: 0.75rem;
  margin: 0;
  font-weight: 600;
}

.stock-amount {
  color: #333;
  font-weight: 800;
  font-size: 1rem;
  margin: 0;
  line-height: 1.2;
}
</style>
