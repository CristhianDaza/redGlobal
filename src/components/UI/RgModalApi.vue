<script lang="ts" setup>
import {computed, onMounted, onUnmounted, watch} from 'vue';

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
      <h2>Progreso de actualización</h2>
      <ul class="api-list">
        <li>
          Descargando API Promos:
          <span class="status-icon">
            <span class="material-icons loading" v-if="storeProducts.isLoadingApiPromos">refresh</span>
            <span class="material-icons" v-else>check</span>
          </span>
        </li>
        <li>
          Descargando API Marpico:
          <span class="status-icon">
            <span class="material-icons loading" v-if="storeProducts.isLoadingApiMarpico" >refresh</span>
            <span class="material-icons" v-else>check</span>
          </span>
        </li>
        <li>
          Descargando API Stock Sur:
          <span class="status-icon">
            <span class="material-icons loading" v-if="storeProducts.isLoadingApiStockSur" >refresh</span>
            <span class="material-icons" v-else>check</span>
          </span>
        </li>
        <li>
          Descargando API Catalogos:
          <span class="status-icon">
            <span class="material-icons loading" v-if="storeProducts.isLoadingApiCataProm" >refresh</span>
            <span class="material-icons" v-else>check</span>
          </span>
        </li>
      </ul>

      <div class="saving-section" v-if="allApisCompleted">
        <p>Guardando productos en la base de datos:</p>
        <span class="status-icon">
          <span class="material-icons loading" v-if="storeProducts.isUpdating">refresh</span>
          <span class="material-icons" v-else>check</span>
        </span>
      </div>

      <div class="success-message" v-if="allApisCompleted && !storeProducts.isUpdating">
        <p>¡Todo fue correcto!</p>
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
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Estilo del modal */
.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

/* Lista de APIs */
.api-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.api-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

.status-icon {
  margin-left: 1rem;
  display: inline-block;
  width: 24px;
  height: 24px;
  text-align: center;
  vertical-align: middle;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

/* Sección de guardado */
.saving-section {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Mensaje de éxito */
.success-message {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: green;
}

.loading {
  animation: spin 1s linear infinite;
  transform-origin: center center;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}
</style>
