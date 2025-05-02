<script setup lang="ts">
import type { ProductsRedGlobal } from '@/types/common.d';
import { defineAsyncComponent, computed } from 'vue';
import { formatNumber } from '@/utils';

const RgImage = defineAsyncComponent(/* webpackChunkName: "rgImage" */() => import('@/components/UI/RgImage.vue'));

const { productsView } = defineProps<{ productsView: ProductsRedGlobal }>();

const stockClass = computed(() => {
  const val = productsView.totalProducts;
  if (val === undefined) return '';
  if (val < 0) return 'stock-negative';
  if (val === 0) return 'stock-zero';
  if (val > 0 && val <= 10) return 'stock-low';
  if (val > 10) return 'stock-ok';
  return '';
});

</script>

<template>
  <div class="product">
    <div class="product-image-container">
      <RgImage
        :src="productsView.mainImage"
        :alt="productsView.name"
        width="auto"
        height="auto"
      />
    </div>
    <div class="product-content">
      <div>
        <p class="product-category" v-if="productsView.category?.length">{{ productsView.category?.[0]}}</p>
        <h3 class="product-name">{{ productsView.name }}</h3>
        <p class="product-code">{{ productsView.id }}</p>
      </div>
      <div class="product-stock" v-if="productsView.totalProducts !== undefined">
        <p class="stock-label">Unidades disponibles:</p>
        <p class="stock-amount" :class="stockClass">{{ formatNumber(productsView.totalProducts)}}</p>
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
  min-height: 520px;
}

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.product:hover .product-name {
  color: var(--primary-color);
}

.product-image-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 220px;
}

.product-category {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  display: -webkit-box;
  line-clamp: 2;
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
  transition: color 0.2s;
}

.stock-negative {
  color: #c62828; /* Rojo oscuro, alerta fuerte */
}

.stock-zero {
  color: #ffb3b3; /* Rojo pastel, suave pero visible */
}

.stock-low {
  color: #f9a825; /* Amarillo oscuro/naranja, advertencia */
}

.stock-ok {
  color: #388e3c; /* Verde más sobrio, profesional */
}
</style>
