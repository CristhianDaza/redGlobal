<script setup lang="ts">
import type { Quote, QuoteAdmin } from '@/types/common.d'
import { defineAsyncComponent, computed, ref } from 'vue'
import TvRelativeTime from '@todovue/tv-relative-time'

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

const props = defineProps<{
  quotes: Quote[]
  totals: { total: number; pending: number; completed: number }
  quoteStatus: { PENDING: string; COMPLETED: string }
  isAdmin: boolean
  canDeleteQuote: (quote: Quote) => boolean
}>()

const emit = defineEmits<{
  (e: 'view', quote: Quote): void
  (e: 'complete', quote: QuoteAdmin): void
  (e: 'delete', id: string): void
  (e: 'download'): void
}>()

const sortKey = ref<'createdAt' | 'userName' | 'status'>('createdAt')
const sortAsc = ref(false)

const sortedQuotes = computed(() => {
  return [...props.quotes].sort((a, b) => {
    const aValue = a[sortKey.value]
    const bValue = b[sortKey.value]

    if (aValue == null) return 1
    if (bValue == null) return -1

    if (aValue < bValue) return sortAsc.value ? -1 : 1
    if (aValue > bValue) return sortAsc.value ? 1 : -1
    return 0
  })
})

function changeSort(key: typeof sortKey.value) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}
</script>

<template>
  <div class="quotes-section">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="material-icons">request_quote</span>
        <div class="stat-info">
          <h3>Total Cotizaciones</h3>
          <p>{{ props.totals.total }}</p>
        </div>
      </div>
      <div class="stat-card">
        <span class="material-icons">pending</span>
        <div class="stat-info">
          <h3>Pendientes</h3>
          <p>{{ props.totals.pending }}</p>
        </div>
      </div>
      <div class="stat-card">
        <span class="material-icons">done</span>
        <div class="stat-info">
          <h3>Completadas</h3>
          <p>{{ props.totals.completed }}</p>
        </div>
      </div>
      <div class="stat-card">
        <span class="material-icons">download</span>
        <div class="stat-info">
          <h3>Descargar Cotizaciones</h3>
          <p>
            <RgButton
              icon="download"
              type="icon"
              outlined
              title="Descargar Cotizaciones"
              @click="$emit('download')"
              :customStyle="{ backgroundColor: '#4a5568', color: '#ebf8ff' }"
            />
          </p>
        </div>
      </div>
    </div>

    <div class="rg-table">
      <table>
        <thead>
        <tr>
          <th @click="changeSort('createdAt')" style="cursor: pointer">
            Fecha {{ sortKey === 'createdAt' ? (sortAsc ? '⬆️' : '⬇️') : '' }}
          </th>
          <th @click="changeSort('userName')" style="cursor: pointer">
            Usuario {{ sortKey === 'userName' ? (sortAsc ? '⬆️' : '⬇️') : '' }}
          </th>
          <th @click="changeSort('status')" style="cursor: pointer">
            Estado {{ sortKey === 'status' ? (sortAsc ? '⬆️' : '⬇️') : '' }}
          </th>
          <th>Items</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="props.quotes.length === 0">
          <td colspan="5" class="text-center">
            <p>No hay cotizaciones disponibles</p>
          </td>
        </tr>
        <tr v-else v-for="quote in sortedQuotes" :key="quote.id">
          <td>
            <TvRelativeTime v-if="quote.createdAt" :date="quote.createdAt" lang="es" />
          </td>
          <td>
            <div class="user-info">
              <span>{{ quote.userName }}</span>
              <small>{{ quote.userEmail }}</small>
            </div>
          </td>
          <td>
            <span
              :class="[
              'status-badge',
              quote.status === props.quoteStatus.PENDING
                ? 'status-pending'
                : 'status-completed'
            ]"
              class="status"
            >
              {{ quote.status === props.quoteStatus.PENDING ? ' Pendiente ' : ' Completada ' }}
            </span>
          </td>
          <td>{{ quote.items.length }} items</td>
          <td class="actions">
            <RgButton
              icon="view"
              type="icon"
              outlined
              title="Ver Cotización"
              @click="emit('view', quote)"
              :customStyle="{ backgroundColor: '#4299e1', color: '#ebf8ff' }"
            />
            <RgButton
              v-if="props.canDeleteQuote(quote)"
              icon="remove"
              type="icon"
              outlined
              title="Eliminar Cotización"
              @click="emit('delete', quote.id)"
              :customStyle="{ backgroundColor: '#e53e3e', color: '#ebf8ff' }"
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
