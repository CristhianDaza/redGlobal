<script setup lang="ts">
import type { QuoteAdmin } from '@/types/common'
import { defineAsyncComponent } from 'vue'
import TvRelativeTime from '@todovue/tv-relative-time'
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'))

defineProps<{
  isOpen: boolean
  quote: QuoteAdmin | null
  quoteStatus: { PENDING: string; COMPLETED: string }
  isAdmin: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'complete', id: string): void
}>()
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content quote-details-modal">
      <header class="modal-header">
        <h2>Detalles de la Cotización</h2>
        <button class="close-button" @click="$emit('close')">
          <span class="material-icons">close</span>
        </button>
      </header>

      <div class="modal-body" v-if="quote">
        <div class="quote-info">
          <p><strong>Fecha:</strong><TvRelativeTime :date="quote.createdAt" lang="es" /></p>
          <p><strong>Cliente:</strong> {{ quote.userName }}</p>
          <p><strong>Email:</strong> {{ quote.userEmail }}</p>
          <p><strong>Estado:</strong>
            <span :class="['status-badge', quote.status]">
              {{ quote.status === quoteStatus.PENDING ? 'Pendiente' : 'Completada' }}
            </span>
          </p>
          <p v-if="isAdmin"><strong>Nota:</strong> El precio es + IVA</p>
        </div>

        <div class="quote-items">
          <h3>Items Solicitados</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Marcado</th>
                <th v-if="isAdmin">Precio Unit.</th>
                <th v-if="isAdmin">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in quote.items" :key="item.productId">
                <td>
                  <div class="product-info">
                    <img :src="item.productImage" :alt="item.productId" class="product-thumbnail">
                    <span>{{ item.productId }}</span>
                  </div>
                </td>
                <td>
                  <div class="color-info">
                    <span class="color-circle" :style="{ backgroundColor: item.color }"></span>
                    <span>{{ item.colorName }}</span>
                  </div>
                </td>
                <td>{{ item.quantity }}</td>
                <td>
                  <div v-if="item.includeMarking" class="marking-info">
                    <span class="material-icons text-success">check_circle</span>
                    <span>{{ item.inkColors }} colores</span>
                  </div>
                  <span v-else>No</span>
                </td>
                <td v-if="isAdmin">${{ (item.unitPrice || 0).toLocaleString('es-CO') }}</td>
                <td v-if="isAdmin">${{ (item.totalPrice || 0).toLocaleString('es-CO') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <footer
        class="modal-footer quote-modal-footer"
        v-if="isAdmin && quote && quote.status === quoteStatus.PENDING"
      >
        <RgButton
          text="Marcar como Completada"
          @click="$emit('complete', quote.id)"
          type="default"
          class="complete-quote-btn"
        />
      </footer>
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.close-button {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f7fafc;
  color: #4a5568;
}

.modal-body {
  padding: 1.5rem;
}

.quote-info {
  margin-bottom: 2rem;
}

.quote-info p {
  margin: 0.5rem 0;
}

.quote-items {
  margin-bottom: 2rem;
}

.quote-items h3,
.quote-notes h3 {
  font-size: 1.125rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.quote-items table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.quote-items th,
.quote-items td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.quote-items th {
  background: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}


.quote-modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e5e7eb;
}

.complete-quote-btn {
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.complete-quote-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 0.25rem;
}

.color-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
}

.marking-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.text-success {
  color: #10b981;
}
</style>
