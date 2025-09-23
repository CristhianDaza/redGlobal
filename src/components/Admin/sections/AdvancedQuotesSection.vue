<script setup lang="ts">
import type { Quote, QuoteStatus } from '@/types/common.d'
import { QuoteStatus as QuoteStatusEnum } from '@/types/common.d'
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import TvRelativeTime from '@todovue/tv-relative-time'
import { useAdvancedQuotes } from '@/composable/admin/useAdvancedQuotes'

const RgButton = defineAsyncComponent(() => import('@/components/UI/RgButton.vue'))

const emit = defineEmits<{
  (e: 'view', quote: Quote): void
}>()

// Composable
const {
  quotes,
  isLoading,
  isUpdating,
  quoteStats,
  quotesTotals,
  loadQuotes,
  loadQuoteStats,
  updateQuoteStatus,
  updateQuotePriority,
  deleteQuote,
  exportQuotes,
  searchQuotes,
  refreshData
} = useAdvancedQuotes()

// Estados y filtros locales
const searchTerm = ref('')
const statusFilter = ref<QuoteStatus | 'all'>('all')
const priorityFilter = ref<string>('all')
const dateFilter = ref<string>('all')
const assignedFilter = ref<string>('all')
const sortKey = ref<keyof Quote>('createdAt')
const sortAsc = ref(false)
const viewMode = ref<'table' | 'cards'>('table')

// Estados de cotización con colores y etiquetas
const statusConfig = {
  pending: { label: 'Pendiente', color: '#f59e0b', bgColor: '#fef3c7' },
  in_review: { label: 'En Revisión', color: '#3b82f6', bgColor: '#dbeafe' },
  quoted: { label: 'Cotizada', color: '#8b5cf6', bgColor: '#ede9fe' },
  negotiating: { label: 'Negociando', color: '#f97316', bgColor: '#fed7aa' },
  approved: { label: 'Aprobada', color: '#10b981', bgColor: '#d1fae5' },
  completed: { label: 'Completada', color: '#059669', bgColor: '#a7f3d0' },
  cancelled: { label: 'Cancelada', color: '#ef4444', bgColor: '#fecaca' },
  expired: { label: 'Expirada', color: '#6b7280', bgColor: '#f3f4f6' }
}

const priorityConfig = {
  low: { label: 'Baja', color: '#10b981' },
  medium: { label: 'Media', color: '#f59e0b' },
  high: { label: 'Alta', color: '#f97316' },
  urgent: { label: 'Urgente', color: '#ef4444' }
}

// Filtros computados
const filteredQuotes = computed(() => {
  let filtered = [...quotes.value]

  // Filtro de búsqueda
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(quote => 
      quote.userName.toLowerCase().includes(term) ||
      quote.userEmail.toLowerCase().includes(term) ||
      quote.id.toLowerCase().includes(term) ||
      quote.items.some(item => item.productName.toLowerCase().includes(term))
    )
  }

  // Filtro de estado
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(quote => quote.status === statusFilter.value)
  }

  // Filtro de prioridad
  if (priorityFilter.value !== 'all') {
    filtered = filtered.filter(quote => quote.priority === priorityFilter.value)
  }

  // Filtro de fecha
  if (dateFilter.value !== 'all') {
    const now = new Date()
    const filterDate = new Date()
    
    switch (dateFilter.value) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0)
        filtered = filtered.filter(quote => new Date(quote.createdAt) >= filterDate)
        break
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        filtered = filtered.filter(quote => new Date(quote.createdAt) >= filterDate)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        filtered = filtered.filter(quote => new Date(quote.createdAt) >= filterDate)
        break
    }
  }

  return filtered
})

const sortedQuotes = computed(() => {
  return [...filteredQuotes.value].sort((a, b) => {
    const aValue = a[sortKey.value]
    const bValue = b[sortKey.value]

    if (aValue == null) return 1
    if (bValue == null) return -1

    if (aValue < bValue) return sortAsc.value ? -1 : 1
    if (aValue > bValue) return sortAsc.value ? 1 : -1
    return 0
  })
})

// Estadísticas computadas
const stats = computed(() => {
  const filtered = filteredQuotes.value
  return {
    total: filtered.length,
    byStatus: Object.keys(statusConfig).reduce((acc, status) => {
      acc[status] = filtered.filter(q => q.status === status).length
      return acc
    }, {} as Record<string, number>),
    byPriority: Object.keys(priorityConfig).reduce((acc, priority) => {
      acc[priority] = filtered.filter(q => q.priority === priority).length
      return acc
    }, {} as Record<string, number>),
    avgValue: filtered.reduce((sum, q) => sum + (q.estimatedValue || 0), 0) / filtered.length || 0,
    conversionRate: filtered.filter(q => q.status === 'completed').length / filtered.length * 100 || 0
  }
})

// Funciones
function changeSort(key: keyof Quote) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function handleUpdateQuoteStatus(quote: Quote, newStatus: QuoteStatus) {
  updateQuoteStatus(quote.id, newStatus)
}

function handleUpdateQuotePriority(quote: Quote, newPriority: string) {
  updateQuotePriority(quote.id, newPriority)
}

function getStatusColor(status: QuoteStatus) {
  return statusConfig[status]?.color || '#6b7280'
}

function getStatusBgColor(status: QuoteStatus) {
  return statusConfig[status]?.bgColor || '#f3f4f6'
}

function getPriorityColor(priority?: string) {
  return priority ? priorityConfig[priority as keyof typeof priorityConfig]?.color || '#6b7280' : '#6b7280'
}

function clearFilters() {
  searchTerm.value = ''
  statusFilter.value = 'all'
  priorityFilter.value = 'all'
  dateFilter.value = 'all'
  assignedFilter.value = 'all'
}

function handleExportQuotes() {
  exportQuotes({
    status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
    priority: priorityFilter.value !== 'all' ? priorityFilter.value : undefined,
    dateFrom: dateFilter.value === 'week' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    dateTo: dateFilter.value === 'today' ? new Date().toISOString() : undefined
  })
}

// Cargar datos al montar el componente
onMounted(async () => {
  await refreshData()
})
</script>

<template>
  <div class="advanced-quotes-section">
    <!-- Header con estadísticas -->
    <div class="quotes-header">
      <div class="header-title">
        <h2>Gestión Avanzada de Cotizaciones</h2>
        <p class="subtitle">{{ stats.total }} cotizaciones encontradas</p>
      </div>
      
      <div class="header-actions">
        <RgButton @click="handleExportQuotes" icon="download" outlined>
          Exportar
        </RgButton>
        <RgButton @click="viewMode = viewMode === 'table' ? 'cards' : 'table'" icon="view_module" outlined>
          {{ viewMode === 'table' ? 'Vista Tarjetas' : 'Vista Tabla' }}
        </RgButton>
      </div>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">assessment</span>
        </div>
        <div class="stat-info">
          <h3>{{ stats.total }}</h3>
          <p>Total Cotizaciones</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">trending_up</span>
        </div>
        <div class="stat-info">
          <h3>{{ stats.conversionRate.toFixed(1) }}%</h3>
          <p>Tasa Conversión</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">attach_money</span>
        </div>
        <div class="stat-info">
          <h3>${{ stats.avgValue.toLocaleString() }}</h3>
          <p>Valor Promedio</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">schedule</span>
        </div>
        <div class="stat-info">
          <h3>{{ stats.byStatus.pending || 0 }}</h3>
          <p>Pendientes</p>
        </div>
      </div>
    </div>

    <!-- Filtros avanzados -->
    <div class="filters-section">
      <div class="filters-row">
        <div class="filter-group">
          <label>Buscar</label>
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Cliente, email, ID, producto..."
            class="filter-input"
          >
        </div>
        
        <div class="filter-group">
          <label>Estado</label>
          <select v-model="statusFilter" class="filter-select">
            <option value="all">Todos los estados</option>
            <option v-for="(config, status) in statusConfig" :key="status" :value="status">
              {{ config.label }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Prioridad</label>
          <select v-model="priorityFilter" class="filter-select">
            <option value="all">Todas las prioridades</option>
            <option v-for="(config, priority) in priorityConfig" :key="priority" :value="priority">
              {{ config.label }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Fecha</label>
          <select v-model="dateFilter" class="filter-select">
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
          </select>
        </div>
        
        <div class="filter-actions">
          <RgButton @click="clearFilters" outlined size="small">
            Limpiar
          </RgButton>
        </div>
      </div>
    </div>

    <!-- Vista de tabla -->
    <div v-if="viewMode === 'table'" class="quotes-table-container">
      <table class="quotes-table">
        <thead>
          <tr>
            <th @click="changeSort('createdAt')" class="sortable">
              Fecha
              <span class="material-icons sort-icon">
                {{ sortKey === 'createdAt' ? (sortAsc ? 'keyboard_arrow_up' : 'keyboard_arrow_down') : 'unfold_more' }}
              </span>
            </th>
            <th @click="changeSort('userName')" class="sortable">
              Cliente
              <span class="material-icons sort-icon">
                {{ sortKey === 'userName' ? (sortAsc ? 'keyboard_arrow_up' : 'keyboard_arrow_down') : 'unfold_more' }}
              </span>
            </th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Items</th>
            <th @click="changeSort('estimatedValue')" class="sortable">
              Valor Est.
              <span class="material-icons sort-icon">
                {{ sortKey === 'estimatedValue' ? (sortAsc ? 'keyboard_arrow_up' : 'keyboard_arrow_down') : 'unfold_more' }}
              </span>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quote in sortedQuotes" :key="quote.id" class="quote-row">
            <td>
              <div class="date-cell">
                <TvRelativeTime :date="quote.createdAt" lang="es" />
                <small class="quote-id">ID: {{ quote.id.slice(-6) }}</small>
              </div>
            </td>
            
            <td>
              <div class="client-cell">
                <strong>{{ quote.userName }}</strong>
                <small>{{ quote.userEmail }}</small>
              </div>
            </td>
            
            <td>
              <select 
                :value="quote.status" 
                @change="handleUpdateQuoteStatus(quote, ($event.target as HTMLSelectElement).value as QuoteStatus)"
                class="status-select"
                :style="{ 
                  color: getStatusColor(quote.status),
                  backgroundColor: getStatusBgColor(quote.status)
                }"
              >
                <option v-for="(config, status) in statusConfig" :key="status" :value="status">
                  {{ config.label }}
                </option>
              </select>
            </td>
            
            <td>
              <select 
                :value="quote.priority || 'medium'" 
                @change="handleUpdateQuotePriority(quote, ($event.target as HTMLSelectElement).value)"
                class="priority-select"
                :style="{ color: getPriorityColor(quote.priority) }"
              >
                <option v-for="(config, priority) in priorityConfig" :key="priority" :value="priority">
                  {{ config.label }}
                </option>
              </select>
            </td>
            
            <td>
              <div class="items-cell">
                <span class="items-count">{{ quote.items.length }} productos</span>
                <div class="items-preview">
                  <span v-for="(item, index) in quote.items.slice(0, 2)" :key="index" class="item-tag">
                    {{ item.productName }}
                  </span>
                  <span v-if="quote.items.length > 2" class="more-items">
                    +{{ quote.items.length - 2 }} más
                  </span>
                </div>
              </div>
            </td>
            
            <td>
              <div class="value-cell">
                <strong v-if="quote.estimatedValue">
                  ${{ quote.estimatedValue.toLocaleString() }}
                </strong>
                <span v-else class="no-value">Sin estimar</span>
              </div>
            </td>
            
            <td>
              <div class="actions-cell">
                <RgButton @click="$emit('view', quote)" icon="visibility" type="icon" size="small" outlined>
                </RgButton>
                <RgButton 
                  v-if="quote.status !== 'completed'" 
                  @click="handleUpdateQuoteStatus(quote, QuoteStatusEnum.COMPLETED)" 
                  icon="check_circle" 
                  type="icon" 
                  size="small"
                  :customStyle="{ color: '#10b981' }"
                >
                </RgButton>
                <RgButton @click="deleteQuote(quote.id)" icon="delete" type="icon" size="small" outlined>
                </RgButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vista de tarjetas -->
    <div v-else class="quotes-cards-container">
      <div class="quotes-grid">
        <div v-for="quote in sortedQuotes" :key="quote.id" class="quote-card">
          <div class="card-header">
            <div class="card-title">
              <h4>{{ quote.userName }}</h4>
              <span class="quote-id">{{ quote.id.slice(-6) }}</span>
            </div>
            <div class="card-status">
              <span 
                class="status-badge"
                :style="{ 
                  color: getStatusColor(quote.status),
                  backgroundColor: getStatusBgColor(quote.status)
                }"
              >
                {{ statusConfig[quote.status]?.label }}
              </span>
            </div>
          </div>
          
          <div class="card-content">
            <div class="card-info">
              <div class="info-item">
                <span class="material-icons">email</span>
                <span>{{ quote.userEmail }}</span>
              </div>
              <div class="info-item">
                <span class="material-icons">schedule</span>
                <TvRelativeTime :date="quote.createdAt" lang="es" />
              </div>
              <div class="info-item">
                <span class="material-icons">inventory</span>
                <span>{{ quote.items.length }} productos</span>
              </div>
              <div v-if="quote.estimatedValue" class="info-item">
                <span class="material-icons">attach_money</span>
                <span>${{ quote.estimatedValue.toLocaleString() }}</span>
              </div>
            </div>
            
            <div class="card-priority" v-if="quote.priority">
              <span 
                class="priority-badge"
                :style="{ color: getPriorityColor(quote.priority) }"
              >
                {{ priorityConfig[quote.priority as keyof typeof priorityConfig]?.label }}
              </span>
            </div>
          </div>
          
          <div class="card-actions">
            <RgButton @click="$emit('view', quote)" size="small" outlined>
              Ver Detalles
            </RgButton>
            <RgButton 
              v-if="quote.status !== 'completed'" 
              @click="handleUpdateQuoteStatus(quote, QuoteStatusEnum.COMPLETED)" 
              size="small"
              :customStyle="{ backgroundColor: '#10b981', color: 'white' }"
            >
              Completar
            </RgButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-if="sortedQuotes.length === 0" class="empty-state">
      <div class="empty-icon">
        <span class="material-icons">search_off</span>
      </div>
      <h3>No se encontraron cotizaciones</h3>
      <p>Intenta ajustar los filtros o crear una nueva cotización</p>
      <RgButton @click="clearFilters" outlined>
        Limpiar Filtros
      </RgButton>
    </div>
  </div>
</template>

<style scoped>
.advanced-quotes-section {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

.quotes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-title h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.subtitle {
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-info p {
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filters-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-input,
.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.quotes-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.quotes-table {
  width: 100%;
  border-collapse: collapse;
}

.quotes-table th {
  background: #f9fafb;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.quotes-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.quotes-table th.sortable:hover {
  background: #f3f4f6;
}

.sort-icon {
  font-size: 16px;
  margin-left: 0.25rem;
  opacity: 0.5;
}

.quotes-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.quote-row:hover {
  background: #f9fafb;
}

.date-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.quote-id {
  color: #6b7280;
  font-size: 0.75rem;
}

.client-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.client-cell strong {
  color: #1f2937;
}

.client-cell small {
  color: #6b7280;
  font-size: 0.875rem;
}

.status-select,
.priority-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.items-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.items-count {
  font-weight: 500;
  color: #374151;
}

.items-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.item-tag {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #6b7280;
}

.more-items {
  background: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.value-cell strong {
  color: #059669;
  font-weight: 600;
}

.no-value {
  color: #9ca3af;
  font-style: italic;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.quotes-cards-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.quotes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.quote-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.quote-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.card-title h4 {
  margin: 0;
  color: #1f2937;
  font-size: 1.125rem;
}

.status-badge,
.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-content {
  margin-bottom: 1.5rem;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.info-item .material-icons {
  font-size: 16px;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  margin-bottom: 1rem;
}

.empty-icon .material-icons {
  font-size: 4rem;
  color: #d1d5db;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: #6b7280;
}

@media (max-width: 768px) {
  .filters-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .quotes-table-container {
    overflow-x: auto;
  }
  
  .quotes-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
