<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '../store/useProductsStore';
import type { ProductsRedGlobal } from '../types/common';
import RgImage from '../components/UI/RgImage.vue';
import RgLoader from '../components/UI/RgLoader.vue';
import { formatNumber, getRelativeTime } from '../utils';

const route = useRoute();
const productsStore = useProductsStore();
const product = ref<ProductsRedGlobal | null>(null);
const selectedImage = ref('');
const currentImageIndex = ref(0);
const visibleThumbnails = 4;
const isLoading = ref(true);

const loadProduct = async () => {
  isLoading.value = true;
  const productId = route.params.id as string;
  if (!productsStore.products) {
    await productsStore.getAllProducts();
  }
  const found = productsStore.products?.find(p => p.id === productId);
  if (found) {
    product.value = found;
    selectedImage.value = found.mainImage;
  }
  isLoading.value = false;
};

onMounted(loadProduct);

// Observar cambios en la ruta para cargar nuevo producto
watch(() => route.params.id, loadProduct);

const uniqueImages = computed(() => {
  if (!product.value) return [];
  return [...new Set([product.value.mainImage, ...(product.value.images || [])])];
});

const visibleImages = computed(() => {
  return uniqueImages.value.slice(currentImageIndex.value, currentImageIndex.value + visibleThumbnails);
});

const selectImage = (image: string) => {
  selectedImage.value = '';
  requestAnimationFrame(() => {
    selectedImage.value = image;
  });
};

</script>

<template>
  <div class="product-view">
    <RgLoader v-if="isLoading" />
    
    <div v-else-if="product" class="product-container">
      <div class="product-gallery">
        <div class="main-image-container">
          <RgImage
            v-show="selectedImage"
            :key="selectedImage"
            :src="selectedImage"
            :alt="product.name"
            width="300"
            height="300"
            class="main-image"
          />
        </div>
        <div class="thumbnails-container" v-if="product.images?.length">
          <button
            class="nav-button prev"
            :disabled="currentImageIndex === 0"
            @click="currentImageIndex = Math.max(0, currentImageIndex - 1)"
          >
            ‹
          </button>
          <div class="thumbnails">
            <button
              v-for="image in visibleImages"
              :key="image"
              class="thumbnail-button"
              :class="{ active: selectedImage === image }"
              @click="selectImage(image)"
            >
              <RgImage
                :src="image"
                :alt="product.name"
                width="80"
                height="80"
                class="thumbnail"
                :class="{ 'zoom-out': selectedImage === image }"
              />
            </button>
          </div>
          <button
            class="nav-button next"
            :disabled="currentImageIndex >= uniqueImages.length - visibleThumbnails"
            @click="currentImageIndex = Math.min(uniqueImages.length - visibleThumbnails, currentImageIndex + 1)"
          >
            ›
          </button>
        </div>
      </div>

      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-id">Código: {{ product.id }}</p>
        
        <div class="product-details">
          <div class="details-grid">
            <div class="detail-item description">
              <span class="value">{{ product.description }}</span>
            </div>

            <div class="detail-list">
              <div class="detail-row" v-if="product.material">
                <span class="detail-key">Material:</span>
                <span class="detail-value">{{ product.material }}</span>
              </div>

              <div class="detail-row" v-if="product.size">
                <span class="detail-key">Medidas:</span>
                <span class="detail-value">{{ product.size }}</span>
              </div>

              <div class="detail-row" v-if="product.areaPrinting">
                <span class="detail-key">Área de<br /> impresión:</span>
                <span class="detail-value">{{ product.areaPrinting }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-key">Método de<br /> impresión:</span>
                <span class="detail-value">{{ product.printing }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-key">Empaquetado:</span>
                <span class="detail-value">{{ product.packaging }}</span>
              </div>

              <div class="detail-row" v-if="product.category?.length">
                <span class="detail-key">{{ product.category.length > 1 ? 'Categorías:' : 'Categoría:' }}</span>
                <span class="detail-value categories">
                  <span v-for="category in product.category" 
                    :key="category" 
                    class="category-tag"
                  >
                    <router-link :to="{name: 'search', query: {search: category}}">{{ category }}</router-link>
                  </span>
                </span>
              </div>
            </div>

            <div class="labels-section" v-if="product.labels && product.labels.length > 0">
              <div class="labels-grid">
                <img 
                  v-for="label in product.labels" 
                  :key="label.id"
                  :src="label.image" 
                  :alt="label.name" 
                  width="100" 
                  height="100"
                  class="label-image"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="quantity-table">
          <table>
            <thead>
              <tr>
                <th>Unidades disponibles</th>
                <th>Actualizado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ formatNumber(product.totalProducts) }}</td>
                <td>{{ getRelativeTime(productsStore.lastUpdateProducts) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-view {
  padding: 2rem 0;
  background-color: #fff;
}

.product-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.product-gallery {
  position: relative;
}

.main-image-container {
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 500px;
  margin: 0 auto;
  position: relative;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  animation: zoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.thumbnails-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow: hidden;
  padding: 0.5rem 0;
}

.nav-button {
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  transition: all 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  background: #e0e0e0;
  color: #333;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.thumbnail-button {
  padding: 2px;
  border: 2px solid transparent;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.thumbnail-button:hover {
  border-color: #ddd;
}

.thumbnail-button.active {
  border-color: #ff4444;
}

.thumbnail {
  width: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.thumbnail.zoom-out {
  animation: zoomOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.3) translateY(100px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes zoomOut {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.product-info {
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-name {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.product-id {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.product-details {
  background: #f8f9fa;
  padding: 1rem 0;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.product-details h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 500;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #fff;
  padding: .5rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.detail-row {
  display: flex;
  align-items: flex-start;
  padding: 0.5rem 0;
  border-bottom: 1px solid #edf2f7;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-key {
  width: 180px;
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 500;
}

.detail-value {
  flex: 1;
  color: #2d3748;
  font-size: 0.95rem;
}

.description {
  background-color: #f7fafc;
  border-left: 3px solid #4299e1;
  padding: 1rem;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  background: #edf2f7;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  color: #4a5568;
}

.labels-section {
  padding: 1rem 0;
}

.labels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
}

.label-image {
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.label-image:hover {
  transform: scale(1.05);
}

.quantity-table {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.quantity-table h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.quantity-table table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.quantity-table th {
  text-align: left;
  padding: 0.75rem;
  font-weight: 500;
  color: #4a5568;
  font-size: 0.95rem;
  border-bottom: 2px solid #e2e8f0;
}

.quantity-table td {
  padding: 1rem 0.75rem;
  color: #2d3748;
  font-size: 0.95rem;
}

.quantity-table td:first-child {
  font-weight: 600;
  color: #48bb78;
}

.quantity-table td:last-child {
  color: #718096;
}

@media (max-width: 768px) {
  .quantity-table {
    padding: 1rem;
  }
  
  .quantity-table th,
  .quantity-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-key {
    width: 100%;
  }

  .detail-list {
    padding: 1rem;
  }
}
</style>