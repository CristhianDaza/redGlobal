<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '../store/useProductsStore';
import type { ProductsRedGlobal, TableEntry } from '../types/common';
import RgImage from '../components/UI/RgImage.vue';
import RgLoader from '../components/UI/RgLoader.vue';
import RgButton from '../components/UI/RgButton.vue';
import { formatColor, getRelativeTime, formatNumber } from '../utils';

const route = useRoute();
const productsStore = useProductsStore();
const product = ref<ProductsRedGlobal | null>(null);
const selectedImage = ref('');
const currentImageIndex = ref(0);
const visibleThumbnails = 6;
const selectedColor = ref('');
const isLoading = ref(false);
const showPricesWithIva = ref(false);

const calculatePriceWithIva = (price: number) => {
  return Math.ceil(price * 1.19);
};

const loadProduct = async () => {
  isLoading.value = true;
  try {
    if (!productsStore.products) {
      await productsStore.getAllProducts();
    }
    const found = productsStore.products?.find(p => p.id === route.params.id);
    if (found) {
      product.value = found;
      selectedImage.value = found.mainImage;
    }
  } catch (error) {
    console.error('Error loading product:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadProduct);

// Observar cambios en la ruta para cargar nuevo producto
watch(() => route.params.id, loadProduct);

const uniqueImages = computed(() => {
  if (!product.value) return [];
  const allImages = product.value.images.reduce((acc: string[], img) => {
    if (img.urlImage) {
      acc.push(...img.urlImage);
    }
    return acc;
  }, [product.value.mainImage]);
  return [...new Set(allImages)];
});

const visibleImages = computed(() => {
  return uniqueImages.value.slice(
    currentImageIndex.value,
    currentImageIndex.value + visibleThumbnails
  );
});

const selectImage = (image: string) => {
  selectedImage.value = image;
};

const selectColor = (item: TableEntry) => {
  selectedColor.value = item.color;
  const colorImages = product.value?.images.find(img => img.color === item.color);
  if (colorImages?.urlImage?.length) {
    selectedImage.value = colorImages.urlImage[0];
  }
};

const hasAnyTracking = computed(() => {
  return product.value?.tableQuantity?.some(entry => entry.inTracking) ?? false;
});

const getStatusClass = (status: string | null) => {
  if (!status) return '';
  const statusMap: { [key: string]: string } = {
    'En proceso': 'status-processing',
    'Enviado': 'status-shipped',
    'Entregado': 'status-delivered',
    'Cancelado': 'status-cancelled'
  };
  return statusMap[status] || '';
};

const formatLabelName = (name: string) => {
  return name.replace(/_/g, ' ');
};
</script>

<template>
  <div class="product-view">
    <RgLoader v-if="isLoading" />
    
    <div v-else-if="product" class="product-container">
      <div class="product-main">
        <div class="product-gallery">
          <div class="main-image-container">
            <RgImage
              v-show="selectedImage || product?.mainImage"
              :key="selectedImage || product?.mainImage"
              :src="selectedImage || (product?.mainImage ?? '')"
              :alt="product?.name"
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
                  :alt="product?.name"
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
          <div class="color-selector" v-if="product?.tableQuantity?.length">
            <button
              v-for="item in product.tableQuantity"
              :key="item.color"
              class="color-button"
              :class="{ active: selectedColor === item.color }"
              :style="{ backgroundColor: formatColor(item.colorName) }"
              :title="item.colorName"
              @click="selectColor(item)"
            />
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
                <div class="detail-row" v-if="product.material && product.material !== ''">
                  <span class="detail-key">Material:</span>
                  <span class="detail-value">{{ product.material }}</span>
                </div>

                <div class="detail-row" v-if="product.size && product.size !== ''">
                  <span class="detail-key">Medidas:</span>
                  <span class="detail-value">{{ product.size }}</span>
                </div>

                <div class="detail-row" v-if="product.areaPrinting && product.areaPrinting !== ''">
                  <span class="detail-key">Área de<br /> impresión:</span>
                  <span class="detail-value">{{ product.areaPrinting }}</span>
                </div>

                <div class="detail-row" v-if="product.printing && product.printing !== ''">
                  <span class="detail-key">Método de<br /> impresión:</span>
                  <span class="detail-value">{{ product.printing }}</span>
                </div>

                <div class="detail-row" v-if="product.packaging && product.packaging !== ''">
                  <span class="detail-key">Empaquetado:</span>
                  <span class="detail-value">{{ product.packaging }}</span>
                </div>

                <div class="detail-row" v-if="product.category?.length && product.category?.length > 0">
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
                  <div 
                    v-for="label in product.labels" 
                    :key="label.id"
                    class="label-container"
                  >
                    <img 
                      :src="label.image" 
                      :alt="formatLabelName(label.name)" 
                      width="100" 
                      height="100"
                      class="label-image"
                      display="block"
                    />
                    <div class="label-tooltip">{{ formatLabelName(label.name) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-section">
        <div class="table-container">
          <div class="table-header">
            <div class="total-info">
              <span class="total-label">Total disponible:</span>
              <span class="total-value">{{ formatNumber(product.totalProducts) }} unidades.</span>
            </div>
            <div class="update-info">
              <span class="update-label">Última actualización:</span>
              <span class="update-value">{{ getRelativeTime(productsStore.lastUpdateProducts) }}</span>
            </div>
          </div>
          <div class="price-toggle">
            <RgButton @click="showPricesWithIva = !showPricesWithIva">
              {{ showPricesWithIva ? 'Mostrar precios sin IVA' : 'Mostrar precios con IVA' }}
            </RgButton>
          </div>
          <table class="product-table">
            <thead>
              <tr>
                <th>Color</th>
                <th>Cantidades<br />disponible</th>
                <th v-if="hasAnyTracking">Unidades en<br />tránsito</th>
                <th>Precio</th>
                <th v-if="hasAnyTracking">Estado</th>
                <th v-if="hasAnyTracking">Última<br />Actualización</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in product.tableQuantity" :key="entry.colorName">
                <td>
                  <div class="color-cell">
                    <span 
                      class="color-dot"
                      :style="{ backgroundColor: formatColor(entry.colorName) }"
                    ></span>
                    {{ entry.colorName }}
                  </div>
                </td>
                <td>{{ formatNumber(entry.quantity) }}</td>
                <td v-if="hasAnyTracking">{{ entry.inTracking ? formatNumber(entry.inTracking) : '-' }}</td>
                <td>
                  {{ showPricesWithIva 
                    ? `$${formatNumber(calculatePriceWithIva(Number(entry.price)))} con IVA`
                    : `$${formatNumber(Number(entry.price))} + IVA` 
                  }}
                </td>
                <td v-if="hasAnyTracking">
                  <div v-if="entry.inTracking" class="tracking-info">
                    <span :class="['status-badge', getStatusClass(entry.statusTracking ?? null)]">
                      {{ entry.statusTracking || 'N/A' }}
                    </span>
                  </div>
                  <span v-else>-</span>
                </td>
                <td v-if="hasAnyTracking">
                  {{ entry.lastUpdateTracking ? getRelativeTime(entry.lastUpdateTracking) : '-' }}
                </td>
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
  display: flex;
  flex-direction: column;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: .5rem;
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
  padding: 0 1rem 1rem 1rem;
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
  gap: 1rem;
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
  padding-bottom: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.labels-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.label-container {
  position: relative;
  display: inline-block;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.label-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.label-image {
  border-radius: 6px;
  display: block;
  width: 80px;
  height: 80px;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.label-image:hover {
  transform: scale(1.05);
}

.label-tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.label-tooltip::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.85);
}

.label-image:hover + .label-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-5px);
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

.color-selector {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.color-button {
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.color-button:hover {
  transform: scale(1.1);
  border-color: #ff4444;
}

.color-button.active {
  border-color: #ff4444;
  box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2);
}

.color-button::after {
  content: attr(title);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
}

.color-button:hover::after {
  opacity: 1;
  visibility: visible;
}

.table-section {
  width: 100%;
  margin-top: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-section h3 {
  padding: 1rem;
  margin: 0;
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
  color: #333;
}

.table-container {
  overflow-x: auto;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.product-table th,
.product-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.product-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #444;
}

.color-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.tracking-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-processing {
  background-color: #fff8e6;
  color: #b77f00;
}

.status-shipped {
  background-color: #e6f4ff;
  color: #0958d9;
}

.status-delivered {
  background-color: #e6ffe6;
  color: #039003;
}

.status-cancelled {
  background-color: #fff1f0;
  color: #cf1322;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.total-info,
.update-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total-label,
.update-label {
  color: #666;
  font-size: 0.9rem;
}

.total-value {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.update-value {
  color: #666;
  font-size: 0.9rem;
}

.price-toggle {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

@media (max-width: 1024px) {
  .product-main {
    grid-template-columns: 1fr;
  }

  .main-image-container {
    max-width: 500px;
    margin: 0 auto;
  }

  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 768px) {
  .detail-row {
    flex-direction: column;
  }

  .detail-key {
    width: 100%;
  }

  .thumbnails {
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .product-container {
    padding: 0.5rem;
  }

  .thumbnail-button {
    width: 50px;
    height: 50px;
  }

  .label-image {
    width: 60px;
    height: 60px;
  }
}
</style>