<script lang="ts" setup>
import { computed, watch, onUnmounted } from 'vue';

import { useProductsStore } from '@/store';

const storeProducts = useProductsStore();

const allApisCompleted = computed(() => {
  return (
    !storeProducts.isLoadingApiPromos &&
    !storeProducts.isLoadingApiMarpico &&
    !storeProducts.isLoadingApiStockSur&&
    !storeProducts.isLoadingApiCataProm
  );
});
</script>

<template>
  <div v-if="storeProducts.isUpdating" class="modal-overlay">
    <div class="modal">
      <h2 class="modal-title">Actualización de Productos</h2>
      <ul class="api-list">
        <li>
          <span class="api-label">API Promos</span>
          <span class="status-icon">
            <span class="material-icons loading" v-if="storeProducts.isLoadingApiPromos">refresh</span>
            <template v-else>
              <span class="material-icons success" v-if="storeProducts.isSuccessApiPromos">check_circle</span>
              <span class="material-icons error" v-else>error</span>
            </template>
          </span>
        </li>
        <li>
          <span class="api-label">API Marpico</span>
          <span class="status-icon">
            <span class="material-icons loading" v-if="storeProducts.isLoadingApiMarpico">refresh</span>
            <template v-else>
              <span class="material-icons success" v-if="storeProducts.isSuccessApiMarpico">check_circle</span>
              <span class="material-icons error" v-else>error</span>
            </template>
          </span>
        </li>
        <li>
          <span class="api-label">API Stock Sur</span>
          <span class="status-icon">
            <span class="material-icons loading" v-if="storeProducts.isLoadingApiStockSur">refresh</span>
            <template v-else>
              <span class="material-icons success" v-if="storeProducts.isSuccessApiStockSur">check_circle</span>
              <span class="material-icons error" v-else>error</span>
            </template>
          </span>
        </li>
        <li>
          <span class="api-label">API Catálogos</span>
          <span class="status-icon">
            <span class="material-icons loading" v-if="storeProducts.isLoadingApiCataProm">refresh</span>
            <template v-else>
              <span class="material-icons success" v-if="storeProducts.isSuccessApiCataProm">check_circle</span>
              <span class="material-icons error" v-else>error</span>
            </template>
          </span>
        </li>
      </ul>

      <div class="saving-section" v-if="allApisCompleted">
        <span class="saving-label">Guardando productos en la base de datos</span>
        <span class="status-icon">
          <span class="material-icons loading" v-if="storeProducts.isUpdating">refresh</span>
          <span class="material-icons success" v-else>check</span>
        </span>
      </div>

      <div class="success-message" v-if="allApisCompleted && !storeProducts.isUpdating">
        <span class="material-icons success big">celebration</span>
        <p>¡Todos los productos se actualizaron correctamente!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: color-mix(in srgb, var(--primary-color) 15%, transparent);
  backdrop-filter: blur(12px) saturate(1.3) brightness(0.9);
  -webkit-backdrop-filter: blur(12px) saturate(1.3) brightness(0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-out;
}

.modal {
  background: white;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 0.75rem;
  min-width: 340px;
  max-width: 90vw;
  text-align: left;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  animation: slideIn 0.3s ease-out;
}

.modal-title {
  margin: 0 0 1.3rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.01em;
  text-align: center;
}

.api-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}
.api-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e0e7ef;
  border-radius: 7px;
  padding: 0.7rem 1rem;
  margin-bottom: 0.7rem;
  font-size: 1.05rem;
  font-weight: 500;
  color: #334155;
  box-shadow: 0 1px 3px rgba(16, 38, 84, 0.04);
}
.api-label {
  flex: 1;
}
.status-icon {
  margin-left: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 1.45rem;
}
.material-icons.success {
  color: #22c55e;
  font-size: 1.45rem;
}
.material-icons.error {
  color: #ef4444;
  font-size: 1.45rem;
}
.material-icons.loading {
  color: #3b82f6;
  font-size: 1.45rem;
}
.saving-section {
  margin: 1.7rem 0 0.5rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  font-size: 1.05rem;
  color: #334155;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(16, 38, 84, 0.03);
}
.saving-label {
  margin-right: 1.2rem;
}
.success-message {
  margin-top: 2rem;
  padding: 1.2rem 1rem 0.8rem 1rem;
  background: linear-gradient(90deg, #e0ffe6 0%, #f0fff4 100%);
  border-radius: 8px;
  text-align: center;
  font-size: 1.15rem;
  color: #166534;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(34,197,94,0.09);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success-message .big {
  font-size: 2.2rem;
  margin-bottom: 0.3rem;
  color: #22c55e;
}
.loading {
  animation: spin 1s linear infinite;
  transform-origin: center center;
}
@keyframes spin {
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>

