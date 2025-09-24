<script lang="ts" setup>
import { computed } from 'vue';

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
      <div class="modal-header">
        <div class="header-icon">
          <span class="material-icons">sync</span>
        </div>
        <h2 class="modal-title">Actualización de Productos</h2>
        <p class="modal-subtitle">Sincronizando inventario desde múltiples proveedores</p>
      </div>

      <div class="modal-content">
        <ul class="api-list">
          <li class="api-item" :class="{ 'completed': !storeProducts.isLoadingApiPromos, 'error': !storeProducts.isLoadingApiPromos && !storeProducts.isSuccessApiPromos }">
            <div class="api-info">
              <span class="api-label">API Promos</span>
              <span class="api-description">Productos Promo Opción</span>
            </div>
            <div class="status-container">
              <div class="status-icon">
                <span class="material-icons loading" v-if="storeProducts.isLoadingApiPromos">sync</span>
                <template v-else>
                  <span class="material-icons success" v-if="storeProducts.isSuccessApiPromos">check_circle</span>
                  <span class="material-icons error" v-else>error</span>
                </template>
              </div>
            </div>
          </li>
          
          <li class="api-item" :class="{ 'completed': !storeProducts.isLoadingApiMarpico, 'error': !storeProducts.isLoadingApiMarpico && !storeProducts.isSuccessApiMarpico }">
            <div class="api-info">
              <span class="api-label">API Marpico</span>
              <span class="api-description">Productos Marpico Promocionales</span>
            </div>
            <div class="status-container">
              <div class="status-icon">
                <span class="material-icons loading" v-if="storeProducts.isLoadingApiMarpico">sync</span>
                <template v-else>
                  <span class="material-icons success" v-if="storeProducts.isSuccessApiMarpico">check_circle</span>
                  <span class="material-icons error" v-else>error</span>
                </template>
              </div>
            </div>
          </li>
          
          <li class="api-item" :class="{ 'completed': !storeProducts.isLoadingApiStockSur, 'error': !storeProducts.isLoadingApiStockSur && !storeProducts.isSuccessApiStockSur }">
            <div class="api-info">
              <span class="api-label">API Stock Sur</span>
              <span class="api-description">Productos CDO Promocionales</span>
            </div>
            <div class="status-container">
              <div class="status-icon">
                <span class="material-icons loading" v-if="storeProducts.isLoadingApiStockSur">sync</span>
                <template v-else>
                  <span class="material-icons success" v-if="storeProducts.isSuccessApiStockSur">check_circle</span>
                  <span class="material-icons error" v-else>error</span>
                </template>
              </div>
            </div>
          </li>
          
          <li class="api-item" :class="{ 'completed': !storeProducts.isLoadingApiCataProm, 'error': !storeProducts.isLoadingApiCataProm && !storeProducts.isSuccessApiCataProm }">
            <div class="api-info">
              <span class="api-label">API Catálogos</span>
              <span class="api-description">Productos Catalogos Promocionales</span>
            </div>
            <div class="status-container">
              <div class="status-icon">
                <span class="material-icons loading" v-if="storeProducts.isLoadingApiCataProm">sync</span>
                <template v-else>
                  <span class="material-icons success" v-if="storeProducts.isSuccessApiCataProm">check_circle</span>
                  <span class="material-icons error" v-else>error</span>
                </template>
              </div>
            </div>
          </li>
        </ul>

        <div class="saving-section" v-if="allApisCompleted">
          <div class="saving-content">
            <div class="saving-icon">
              <span class="material-icons loading" v-if="storeProducts.isUpdating">save</span>
              <span class="material-icons success" v-else>check_circle</span>
            </div>
            <div class="saving-info">
              <span class="saving-label">Guardando en base de datos</span>
              <span class="saving-description">Procesando productos sincronizados</span>
            </div>
          </div>
        </div>

        <div class="success-message" v-if="allApisCompleted && !storeProducts.isUpdating">
          <div class="success-icon">
            <span class="material-icons">celebration</span>
          </div>
          <div class="success-content">
            <h3>¡Actualización Completada!</h3>
            <p>Todos los productos se sincronizaron correctamente</p>
          </div>
        </div>
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
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
}

.modal {
  background: white;
  border-radius: 16px;
  min-width: 480px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, #667eea 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  backdrop-filter: blur(10px);
}

.header-icon .material-icons {
  font-size: 2rem;
  animation: pulse 2s infinite;
}

.modal-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.modal-subtitle {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 400;
}

.modal-content {
  padding: 2rem;
}

.api-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.api-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.api-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #e2e8f0;
  transition: all 0.3s ease;
}

.api-item.completed::before {
  background: #22c55e;
}

.api-item.error::before {
  background: #ef4444;
}

.api-item.completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.api-item.error {
  background: #fef2f2;
  border-color: #fecaca;
}

.api-info {
  flex: 1;
}

.api-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.api-description {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 400;
}

.status-container {
  margin-left: 1rem;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  transition: all 0.3s ease;
}

.status-icon .material-icons {
  font-size: 1.5rem;
}

.material-icons.success {
  color: #22c55e;
  animation: spinReverse 0.6s ease-out;
}

.material-icons.error {
  color: #ef4444;
}

.material-icons.loading {
  color: var(--primary-color);
}

.saving-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.saving-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.saving-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.saving-icon .material-icons {
  color: white;
  font-size: 1.5rem;
}

.saving-info {
  flex: 1;
}

.saving-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.saving-description {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
}

.success-message {
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border: 2px solid #bbf7d0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  animation: successPulse 0.6s ease-out;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  animation: bounce 1s ease-out;
}

.success-icon .material-icons {
  color: white;
  font-size: 2.5rem;
}

.success-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #166534;
}

.success-content p {
  margin: 0;
  font-size: 1rem;
  color: #15803d;
  opacity: 0.9;
}

.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { 
    transform: rotate(-360deg); 
  }
}

@keyframes spinReverse {
  0% { 
    transform: rotate(-360deg) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: rotate(-180deg) scale(1.1);
    opacity: 0.7;
  }
  100% { 
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
  }
  50% { 
    opacity: 0.7; 
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

@keyframes successPulse {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .modal {
    min-width: 320px;
    margin: 1rem;
  }
  
  .modal-header {
    padding: 1.5rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .api-item {
    padding: 1rem;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
}
</style>

