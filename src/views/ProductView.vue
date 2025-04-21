<script setup lang="ts">
import type { ProductsRedGlobal, TableEntry } from '@/types/common.d';
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore, useProductsStore, useUserStore } from '@/store';
import { formatColor, formatNumber, getRelativeTime } from '@/utils'
import { useHead } from '@vueuse/head';

const RgImage = defineAsyncComponent(/* webpackChunkName: "rgImage" */() => import('@/components/UI/RgImage.vue'));
const RgLoader = defineAsyncComponent(/* webpackChunkName: "rgLoader" */() => import('@/components/UI/RgLoader.vue'));
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));
const QuoteModal = defineAsyncComponent(/* webpackChunkName: "quoteModal" */() => import('@/components/Quote/QuoteModal.vue'));
const SimilarProducts = defineAsyncComponent(/* webpackChunkName: "similarProducts" */() => import('@/components/Product/SimilarProducts.vue'));

const route = useRoute();
const productsStore = useProductsStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const product = ref<ProductsRedGlobal | null>(null);

useHead({
  title: computed(() => `${product.value?.id} ${product.value?.name} – Red Global Promocionales` || 'Producto – Red Global Promocionales'),
  meta: [
    { name: 'description', content: product.value?.description || 'Detalles del producto promocional en Red Global Promocionales.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: product.value?.name || 'Producto – Red Global Promocionales' },
    { property: 'og:description', content: product.value?.description || 'Detalles del producto promocional en Red Global Promocionales.' },
    { property: 'og:type', content: 'product' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:url', content: `https://redglobalpromocionales.com/product/${product.value?.id}` }
  ],
  link: [
    { rel: 'canonical', href: `https://redglobalpromocionales.com/product/${product.value?.id}` }
  ]
});

const selectedImage = ref('');
const currentImageIndex = ref(0);
const visibleThumbnails = 6;
const selectedColor = ref('');
const isLoading = ref(false);
const showPricesWithIva = ref(false);
const showQuoteModal = ref(false);
const isZoomed = ref(false);
const zoomedImage = ref('');
const zoomRotation = ref(0);
const zoomAnimState = ref('');
const zoomScale = ref(1);
const minZoom = 1;
const maxZoom = 3;
const tooltip = ref('');
const tooltipPos = ref({ x: 0, y: 0 });
const dragOffset = ref({ x: 0, y: 0 });
const dragStart = ref<{ x: number, y: number } | null>(null);
const dragOrigin = ref({ x: 0, y: 0 });
const rotateTransition = ref(false);
const touchStartX = ref<number|null>(null);
const swipeThreshold = 50;

const openZoom = (image: string) => {
  zoomedImage.value = image;
  isZoomed.value = true;
  zoomRotation.value = 0;
  zoomAnimState.value = 'opening';
  setTimeout(() => { zoomAnimState.value = ''; }, 200);
  document.body.style.overflow = 'hidden';
}
const closeZoom = () => {
  zoomAnimState.value = 'closing';
  setTimeout(() => {
    isZoomed.value = false;
    zoomedImage.value = '';
    zoomRotation.value = 0;
    zoomAnimState.value = '';
    document.body.style.overflow = '';
  }, 200);
}
const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) closeZoom();
}

const rotateLeft = () => {
  rotateTransition.value = true;
  zoomRotation.value = (zoomRotation.value - 90 + 360) % 360;
  setTimeout(() => { rotateTransition.value = false; }, 260); // igual a la duración de la transición
}
const rotateRight = () => {
  rotateTransition.value = true;
  zoomRotation.value = (zoomRotation.value + 90) % 360;
  setTimeout(() => { rotateTransition.value = false; }, 260);
}
const resetRotation = () => {
  zoomRotation.value = 0;
}
const handleWheelZoom = (e: WheelEvent) => {
  if (!isZoomed.value) return;
  e.preventDefault();
  let next = zoomScale.value - e.deltaY * 0.0015;
  next = Math.max(minZoom, Math.min(maxZoom, next));
  zoomScale.value = parseFloat(next.toFixed(2));
}
const resetZoom = () => {
  zoomScale.value = 1;
}
watch(isZoomed, val => { if (!val) zoomScale.value = 1; });

const onImgMouseDown = (e: MouseEvent) => {
  if (zoomScale.value <= 1) return;
  e.preventDefault();
  dragStart.value = { x: e.clientX, y: e.clientY };
  dragOrigin.value = { ...dragOffset.value };
  window.addEventListener('mousemove', onImgMouseMove);
  window.addEventListener('mouseup', onImgMouseUp);
}
const onImgMouseMove = (e: MouseEvent) => {
  if (!dragStart.value) return;
  const dx = e.clientX - dragStart.value.x;
  const dy = e.clientY - dragStart.value.y;
  const next = {
    x: dragOrigin.value.x + dx,
    y: dragOrigin.value.y + dy
  };
  const maxOffset = getMaxOffset();
  dragOffset.value = {
    x: Math.max(-maxOffset.x, Math.min(maxOffset.x, next.x)),
    y: Math.max(-maxOffset.y, Math.min(maxOffset.y, next.y))
  };
}
function onImgMouseUp() {
  dragStart.value = null;
  window.removeEventListener('mousemove', onImgMouseMove);
  window.removeEventListener('mouseup', onImgMouseUp);
}
function getMaxOffset() {
  const scale = zoomScale.value;
  if (scale <= 1) return { x: 0, y: 0 };
  const vw = window.innerWidth * 0.9;
  const vh = window.innerHeight * 0.8;
  const maxX = ((vw * (scale - 1)) / 2);
  const maxY = ((vh * (scale - 1)) / 2);
  return { x: maxX, y: maxY };
}

watch([zoomScale, isZoomed], ([z, open]) => {
  if (z === 1 || !open) dragOffset.value = { x: 0, y: 0 };
});

const zoomPrevImage = () => {
  if (!zoomedImage.value) return;
  const idx = uniqueImages.value.indexOf(zoomedImage.value);
  if (idx > 0) {
    requestAnimationFrame(() => {
      setZoomedImageByIndex(idx - 1);
    });
  }
}
const zoomNextImage = () => {
  if (!zoomedImage.value) return;
  const idx = uniqueImages.value.indexOf(zoomedImage.value);
  if (idx < uniqueImages.value.length - 1) {
    requestAnimationFrame(() => {
      setZoomedImageByIndex(idx + 1);
    });
  }
}
const setZoomedImageByIndex = (idx: number) => {
  zoomedImage.value = uniqueImages.value[idx];
  zoomRotation.value = 0;
  zoomScale.value = 1;
  dragOffset.value = { x: 0, y: 0 };
}
const handleZoomKeydown = (e: KeyboardEvent) => {
  if (!isZoomed.value) return;
  if (e.key === 'ArrowLeft') {
    zoomPrevImage();
    e.preventDefault();
  } else if (e.key === 'ArrowRight') {
    zoomNextImage();
    e.preventDefault();
  } else if (e.key === 'Escape') {
    closeZoom();
    e.preventDefault();
  }
}
watch(isZoomed, (val) => {
  if (val) window.addEventListener('keydown', handleZoomKeydown);
  else window.removeEventListener('keydown', handleZoomKeydown);
});

const onImgTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    touchStartX.value = e.touches[0].clientX;
  }
}
const onImgTouchMove = (e: TouchEvent) => {
  if (touchStartX.value !== null) e.preventDefault();
}
const onImgTouchEnd = (e: TouchEvent) => {
  if (touchStartX.value === null) return;
  const touchEndX = e.changedTouches[0].clientX;
  const dx = touchEndX - touchStartX.value;
  if (Math.abs(dx) > swipeThreshold) {
    if (dx < 0) zoomNextImage();
    else zoomPrevImage();
  }
  touchStartX.value = null;
}

const isPriceLoading = computed(() => {
  return authStore.isAuthenticated() && userStore.isLoadingUsers;
});

const calculatePriceWithIncrease = (price: number) => {
  if (!authStore.isAuthenticated()) {
    return price;
  }

  const currentUser = userStore.users.find(user => user.email === authStore.user?.email);

  if (currentUser?.priceIncrease) {
    const finalPrice = price * (1 + currentUser.priceIncrease / 100);
    return Math.ceil(finalPrice);
  }

  return price;
};

const calculatePriceWithIva = (price: number) => {
  const priceWithIncrease = calculatePriceWithIncrease(price);

  return Math.ceil(priceWithIncrease * 1.19);
};

const loadProduct = async () => {
  isLoading.value = true;
  try {
    if (authStore.isAuthenticated() && !userStore.users.length) {
      await userStore.getUsers();
    }
    if (!productsStore.products || productsStore.products.length === 0) {
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

onMounted(async () => {
  if (!productsStore.products || productsStore.products.length === 0) {
    await productsStore.getAllProducts();
  }
  await loadProduct();
});

watch(() => route.params.id, loadProduct);

const uniqueImages = computed(() => {
  if (!product.value) return [];
  const allImages = product.value.images?.reduce((acc: string[], img) => {
    if (img.urlImage) {
      acc.push(...img.urlImage);
    }
    return acc;
  }, [product.value.mainImage]) || [];
  return [...new Set(allImages)];
});

const visibleImages = computed(() => {
  return uniqueImages.value.slice(
    currentImageIndex.value,
    currentImageIndex.value + visibleThumbnails
  );
});

const selectImage = (image: string) => {
  if (!product.value) return;
  selectedImage.value = image;
};

const selectColor = (item: TableEntry) => {
  if (!product.value) return;
  selectedColor.value = item.color;
  const colorImages = product.value?.images?.find(img => img.color === item.color);
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

function showTooltip(text: string, evt: MouseEvent) {
  tooltip.value = text;
  // Esperar al siguiente tick para asegurar que el tooltip esté en el DOM
  setTimeout(() => {
    const tooltipEl = document.querySelector('.zoom-tooltip') as HTMLElement;
    let x = evt.clientX;
    let y = evt.clientY;
    if (tooltipEl) {
      const padding = 12;
      const rect = tooltipEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Si se sale por la derecha
      if (x + rect.width + padding > vw) {
        x = vw - rect.width - padding;
      }
      // Si se sale por abajo
      if (y + rect.height + padding > vh) {
        y = vh - rect.height - padding;
      }
      // Si se sale por la izquierda
      if (x < padding) {
        x = padding;
      }
      // Si se sale por arriba
      if (y < padding) {
        y = padding;
      }
    }
    tooltipPos.value = { x, y };
  }, 0);
}
function hideTooltip() {
  tooltip.value = '';
}
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
              @click="openZoom(selectedImage || product?.mainImage)"
              style="cursor: zoom-in;"
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
          <div class="color-selector" v-if="product?.tableQuantity?.length  && product.api !== 'cataProm'">
            <button
              v-for="item in product.tableQuantity"
              :key="item.color"
              class="color-button"
              :class="{ active: selectedColor === item.color }"
              :style="{ backgroundColor: formatColor(item.color) }"
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
                <span class="value" v-html="product.description"></span>
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

                <!-- Botón de cotización -->
                <div class="quote-section" v-if="authStore.isAuthenticated()">
                  <RgButton
                    @click="showQuoteModal = true"
                    icon="plus"
                    icon-position="left"
                  >
                    <span>Cotizar</span>
                  </RgButton>
                </div>

                <div class="detail-row" v-if="product.category?.length && product.category?.length > 0">
                  <span class="detail-key">{{ product.category.length > 1 ? 'Categorías:' : 'Categoría:' }}</span>
                  <span class="detail-value categories">
                    <span v-for="category in product.category"
                      :key="category"
                      class="category-tag"
                    >
                      <router-link :to="{name: 'search', query: {category: category}}">{{ category }}</router-link>
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
              <span class="update-label">Inventario actualizado:</span>
              <span class="update-value">{{ getRelativeTime(productsStore.lastUpdateProducts) }}</span>
            </div>
          </div>
          <div class="price-toggle" v-if="authStore.isAuthenticated()">
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
                <th v-if="hasAnyTracking">Estado</th>
                <th v-if="hasAnyTracking">Última<br />Actualización</th>
                <th v-if="authStore.isAuthenticated()">Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in product.tableQuantity" :key="entry.colorName">
                <td>
                  <div class="color-cell">
                    <span
                      class="color-dot"
                      :style="{ backgroundColor: formatColor(entry.color) }"
                    ></span>
                    {{ entry.colorName }}
                  </div>
                </td>
                <td>{{ formatNumber(entry.quantity) }}</td>
                <td v-if="hasAnyTracking">{{ entry.inTracking ? formatNumber(entry.inTracking) : '-' }}</td>
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
                <td v-if="authStore.isAuthenticated()">
                  <div v-if="isPriceLoading" class="price-skeleton"></div>
                  <template v-else>
                    {{ showPricesWithIva
                      ? `$${formatNumber(calculatePriceWithIva(Number(entry.price)))} con IVA`
                      : `$${formatNumber(calculatePriceWithIncrease(Number(entry.price)))} + IVA`
                    }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>

          <SimilarProducts v-if="product" :current-product="product" />
        </div>
      </div>
    </div>

    <QuoteModal
      v-if="product"
      :is-open="showQuoteModal"
      :product="product"
      @close="showQuoteModal = false"
    />
    <transition name="zoom-img-fade" mode="out-in">
      <div
        v-if="isZoomed"
        class="zoom-modal"
        :class="{
          'zoom-modal-opening': zoomAnimState === 'opening',
          'zoom-modal-closing': zoomAnimState === 'closing'
        }"
        @click="handleOverlayClick"
      >
        <button v-if="uniqueImages.length > 1" class="zoom-nav zoom-nav-left"
          :disabled="uniqueImages.indexOf(zoomedImage) <= 0"
          @click="zoomPrevImage"
          @mouseenter="showTooltip('Imagen anterior', $event)"
          @mouseleave="hideTooltip"
          @mousemove="showTooltip('Imagen anterior', $event)"
          aria-label="Imagen anterior"
          tabindex="0"
        >‹</button>
        <button v-if="uniqueImages.length > 1" class="zoom-nav zoom-nav-right"
          :disabled="uniqueImages.indexOf(zoomedImage) >= uniqueImages.length - 1"
          @click="zoomNextImage"
          @mouseenter="showTooltip('Imagen siguiente', $event)"
          @mouseleave="hideTooltip"
          @mousemove="showTooltip('Imagen siguiente', $event)"
          aria-label="Imagen siguiente"
          tabindex="0"
          v-bind="$attrs"
        >›</button>
        <div class="zoom-toolbar">
          <button class="zoom-close"
            @click="closeZoom"
            @mouseenter="showTooltip('Cerrar', $event)"
            @mouseleave="hideTooltip"
            @mousemove="showTooltip('Cerrar', $event)"
            title="Cerrar"
          >✕</button>
          <button class="zoom-rotate"
            @click="rotateLeft"
            @mouseenter="showTooltip('Girar a la izquierda', $event)"
            @mouseleave="hideTooltip"
            @mousemove="showTooltip('Girar a la izquierda', $event)"
            title="Girar a la izquierda"
          >⟲</button>
          <button class="zoom-rotate"
            @click="rotateRight"
            @mouseenter="showTooltip('Girar a la derecha', $event)"
            @mouseleave="hideTooltip"
            @mousemove="showTooltip('Girar a la derecha', $event)"
            title="Girar a la derecha"
          >⟳</button>
          <button class="zoom-rotate zoom-reset"
            @click="resetRotation"
            :disabled="zoomRotation === 0"
            @mouseenter="showTooltip('Restaurar orientación', $event)"
            @mouseleave="hideTooltip"
            @mousemove="showTooltip('Restaurar orientación', $event)"
            title="Restaurar orientación"
          >
            <span style="font-size:1.3rem">⤾</span>
          </button>
          <button class="zoom-rotate zoom-reset"
            @click="resetZoom"
            :disabled="zoomScale === 1"
            @mouseenter="showTooltip('Restaurar zoom', $event)"
            @mouseleave="hideTooltip"
            @mousemove="showTooltip('Restaurar zoom', $event)"
            title="Restaurar zoom"
          >
            <span style="font-size:1.2rem">🔍</span>
          </button>
        </div>
        <div class="zoom-indicator">
          <span>{{ zoomRotation }}° | {{ (zoomScale * 100).toFixed(0) }}%</span>
        </div>
        <transition name="zoom-img-fade" mode="out-in">
          <img
            v-if="zoomedImage"
            :key="zoomedImage"
            :src="zoomedImage"
            class="zoomed-img"
            :class="{ 'with-rotate-transition': rotateTransition }"
            :style="{
              transform: `rotate(${zoomRotation}deg) scale(${zoomScale}) translate(${dragOffset.x}px, ${dragOffset.y}px)` ,
              cursor: zoomScale > 1 ? (dragStart ? 'grabbing' : 'grab') : 'zoom-out'
            }"
            draggable="false"
            alt="Imagen ampliada"
            @wheel.prevent="handleWheelZoom"
            @mousedown="onImgMouseDown"
            @touchstart="onImgTouchStart"
            @touchmove="onImgTouchMove"
            @touchend="onImgTouchEnd"
          />
        </transition>
        <div v-if="tooltip" class="zoom-tooltip" :style="{ left: tooltipPos.x + 12 + 'px', top: tooltipPos.y + 12 + 'px' }">
          {{ tooltip }}
        </div>
      </div>
    </transition>
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
  border-color: var(--primary-color);
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
  padding: 1rem;
  margin: 0;
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
  color: #333;
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
  border-color: var(--primary-color);
}

.color-button.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2);
}

.color-button::after {
  content: attr(title);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

.price-skeleton {
  height: 20px;
  width: 100px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.quote-section {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-start;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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

.zoom-modal {
  position: fixed;
  z-index: 10000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30,30,30,0.25);
  backdrop-filter: blur(12px) brightness(0.95);
  animation: fadeIn 0.2s;
  transition: background 0.25s cubic-bezier(.4,2,.4,1), backdrop-filter 0.25s cubic-bezier(.4,2,.4,1);
}
.zoom-modal-opening {
  animation: fadeIn 0.2s;
}
.zoom-modal-closing {
  animation: fadeOut 0.2s;
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
.zoomed-img {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 22px;
  box-shadow: 0 12px 60px rgba(0,0,0,0.35);
  background: #fff;
  object-fit: contain;
  animation: zoomIn 0.23s;
  transition: box-shadow 0.25s;
  user-select: none;
  will-change: transform;
  -webkit-user-drag: none;
}
.with-rotate-transition {
  transition: transform 0.25s cubic-bezier(.4,2,.4,1), box-shadow 0.25s;
}

.zoom-toolbar {
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 2;
}
.zoom-rotate, .zoom-reset {
  background: rgba(255,255,255,0.92);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.7rem;
  color: var(--primary-color);
  box-shadow: 0 2px 10px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  opacity: 0.92;
  line-height: 1;
  padding: 0;
}
.zoom-reset:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.zoom-indicator {
  position: absolute;
  top: 1.1rem;
  left: 2.5rem;
  z-index: 3;
  background: rgba(255,255,255,0.92);
  border-radius: 18px;
  padding: 0.18rem 0.85rem;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  letter-spacing: 1px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0,0,0,0.18);
  opacity: 0.98;
  transition: opacity 0.12s;
}

.zoom-tooltip {
  position: fixed;
  z-index: 10001;
  background: rgba(30,30,30,0.94);
  color: #fff;
  font-size: 0.98rem;
  padding: 5px 13px;
  border-radius: 8px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0,0,0,0.18);
  opacity: 0.98;
  transition: opacity 0.12s;
}

.zoom-close {
  background: #fff;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 2rem;
  color: #d32f2f;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.17);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, border 0.2s;
  border: 2px solid #fff;
}
.zoom-close:hover {
  background: #d32f2f;
  color: #fff;
  border: 2px solid #d32f2f;
  box-shadow: 0 4px 16px rgba(211,47,47,0.18);
}

.zoom-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 11;
  background: rgba(255,255,255,0.94);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 2.3rem;
  color: var(--primary-color);
  box-shadow: 0 2px 10px rgba(0,0,0,0.12);
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  opacity: 0.92;
  line-height: 1;
  padding: 0;
}
.zoom-nav > * {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.zoom-nav:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.zoom-nav-left {
  left: 2vw;
}
.zoom-nav-right {
  right: 2vw;
}
</style>
