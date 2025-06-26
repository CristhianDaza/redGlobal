<script setup lang="ts">
import type { Quote } from '@/types/common.d'
import { defineAsyncComponent } from 'vue'
import TvRelativeTime from '@todovue/tv-relative-time'

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{
  quotes: Quote[]
  totals: { total: number; pending: number; completed: number }
  quoteStatus: { PENDING: string; COMPLETED: string }
  isAdmin: boolean
  canDeleteQuote: (quote: Quote) => boolean
}>()

defineEmits<{
  (e: 'view', quote: Quote): void
  (e: 'complete', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="quotes-section">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="material-icons">request_quote</span>
        <div class="stat-info">
          <h3>Total Cotizaciones</h3>
          <p>{{ totals.total }}</p>
        </div>
      </div>
      <div class="stat-card">
        <span class="material-icons">pending</span>
        <div class="stat-info">
          <h3>Pendientes</h3>
          <p>{{ totals.pending }}</p>
        </div>
      </div>
      <div class="stat-card">
        <span class="material-icons">done</span>
        <div class="stat-info">
          <h3>Completadas</h3>
          <p>{{ totals.completed }}</p>
        </div>
      </div>
    </div>

    <div class="menu-table">
      <table>
        <thead>
        <tr>
          <th>Fecha</th>
          <th>Usuario</th>
          <th>Estado</th>
          <th>Items</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="quotes.length === 0">
          <td colspan="5" class="text-center">
            <p>No hay cotizaciones disponibles</p>
          </td>
        </tr>
        <tr v-else v-for="quote in quotes" :key="quote.id">
          <td><TvRelativeTime v-if="quote.createdAt" :date="quote.createdAt" lang="es" /></td>
          <td>
            <div class="user-info">
              <span>{{ quote.userName }}</span>
              <small>{{ quote.userEmail }}</small>
            </div>
          </td>
          <td>
            <span :class="['status-badge', quote.status]">
              {{ quote.status === quoteStatus.PENDING ? 'Pendiente' : 'Completada' }}
            </span>
          </td>
          <td>{{ quote.items.length }} items</td>
          <td class="actions">
            <RgButton
              icon="view"
              type="icon"
              outlined
              title="Ver Cotización"
              @click="$emit('view', quote)"
              :customStyle="{
                backgroundColor: '#4299e1',
                color: '#ebf8ff',
              }"
            />
            <RgButton
              v-if="quote.status === quoteStatus.PENDING && isAdmin"
              icon="check"
              type="icon"
              outlined
              title="Editar Cotización"
              @click="$emit('complete', quote)"
              :customStyle="{
                backgroundColor: '#368a30',
                color: '#ebf8ff',
              }"
            />
            <RgButton
              v-if="canDeleteQuote(quote)"
              icon="remove"
              type="icon"
              outlined
              title="Eliminar Cotización"
              @click="$emit('delete', quote.id)"
              :customStyle="{
                backgroundColor: '#e53e3e',
                color: '#ebf8ff',
              }"
            />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.quotes-section {
  margin-top: 1rem;
}

.quotes-section .stat-card .material-icons {
  font-size: 2rem;
}

.quotes-section .stat-card:nth-child(1) .material-icons {
  color: var(--primary-color);
}

.quotes-section .stat-card:nth-child(2) .material-icons {
  color: #f59e0b;
}

.quotes-section .stat-card:nth-child(3) .material-icons {
  color: #10b981;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-info small {
  color: #64748b;
  font-size: 0.75rem;
}
</style>
