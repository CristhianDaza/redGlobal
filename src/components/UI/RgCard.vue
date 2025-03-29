<script setup lang="ts">
import type { ProductsRedGlobal } from '../../types/common';
import { formatNumber } from '../../utils/helpers';
import RgImage from './RgImage.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<{
  productsView: ProductsRedGlobal;
}>();

const handleClick = () => {
  router.push({
    name: 'product',
    params: { id: props.productsView.id },
  });
};
</script>

<template>
  <div class="product" @click="handleClick">
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
        <p class="stock-amount">{{ formatNumber(productsView.totalProducts)}} und</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  cursor: pointer;
  position: relative;
}

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #ff4444;
}

.product:hover .product-name {
  color: #ff4444;
}

.product:hover .product-image-container img {
  transform: scale(1.1);
}

.product-image-container {
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image-container img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.product-content {
  padding: 1.5rem;
}

.product-category {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-code {
  font-size: 0.9rem;
  color: #999;
  margin-bottom: 1rem;
}

.product-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}

.stock-label {
  font-size: 0.85rem;
  color: #666;
}

.stock-amount {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4CAF50;
}
</style>
