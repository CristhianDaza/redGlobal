<script setup lang="ts">
import type { Quote, QuoteStatus, QuoteComment } from '@/types/common.d'
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import TvRelativeTime from '@todovue/tv-relative-time'

const RgButton = defineAsyncComponent(() => import('@/components/UI/RgButton.vue'))

const props = defineProps<{
  quote: Quote | null
  isVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updateStatus', data: { quoteId: string, status: QuoteStatus, notes?: string }): void
  (e: 'addComment', data: { quoteId: string, comment: string, isInternal: boolean }): void
  (e: 'updateField', data: { quoteId: string, field: string, value: any }): void
}>()

// Estados locales
const activeTab = ref<'details' | 'comments' | 'history'>('details')
const newComment = ref('')
const isInternalComment = ref(false)
const editingField = ref<string | null>(null)
const tempValues = ref<Record<string, any>>({})

// Estados de cotización
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

// Computadas
const totalValue = computed(() => {
  if (!props.quote?.items) return 0
  return props.quote.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
})

// Funciones
function closeModal() {
  emit('close')
  activeTab.value = 'details'
  newComment.value = ''
  editingField.value = null
  tempValues.value = {}
}

function updateStatus(newStatus: QuoteStatus) {
  if (!props.quote) return
  emit('updateStatus', { 
    quoteId: props.quote.id, 
    status: newStatus,
    notes: `Estado cambiado a ${statusConfig[newStatus].label}`
  })
}

function addComment() {
  if (!props.quote || !newComment.value.trim()) return
  
  emit('addComment', {
    quoteId: props.quote.id,
    comment: newComment.value.trim(),
    isInternal: isInternalComment.value
  })
  
  newComment.value = ''
}

function startEditing(field: string, currentValue: any) {
  editingField.value = field
  tempValues.value[field] = currentValue
}

function saveField(field: string) {
  if (!props.quote) return
  
  emit('updateField', {
    quoteId: props.quote.id,
    field,
    value: tempValues.value[field]
  })
  
  editingField.value = null
  delete tempValues.value[field]
}

function cancelEditing() {
  editingField.value = null
  tempValues.value = {}
}

// Watchers
watch(() => props.isVisible, (visible) => {
  if (!visible) {
    closeModal()
  }
})
</script>

<template>
  <div v-if="isVisible && quote" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-info">
          <h2>Cotización #{{ quote.id.slice(-6) }}</h2>
          <div class="header-meta">
            <span 
              class="status-badge"
              :style="{ 
                color: statusConfig[quote.status]?.color,
                backgroundColor: statusConfig[quote.status]?.bgColor
              }"
            >
              {{ statusConfig[quote.status]?.label }}
            </span>
            <span v-if="quote.priority" 
              class="priority-badge"
              :style="{ color: priorityConfig[quote.priority as keyof typeof priorityConfig]?.color }"
            >
              {{ priorityConfig[quote.priority as keyof typeof priorityConfig]?.label }}
            </span>
          </div>
        </div>
        <RgButton @click="closeModal" icon="close" type="icon" outlined />
      </div>

      <!-- Tabs -->
      <div class="modal-tabs">
        <button 
          @click="activeTab = 'details'" 
          :class="['tab-button', { active: activeTab === 'details' }]"
        >
          <span class="material-icons">info</span>
          Detalles
        </button>
        <button 
          @click="activeTab = 'comments'" 
          :class="['tab-button', { active: activeTab === 'comments' }]"
        >
          <span class="material-icons">comment</span>
          Comentarios
        </button>
        <button 
          @click="activeTab = 'history'" 
          :class="['tab-button', { active: activeTab === 'history' }]"
        >
          <span class="material-icons">history</span>
          Historial
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Tab: Detalles -->
        <div v-if="activeTab === 'details'" class="tab-content">
          <div class="details-grid">
            <!-- Información del cliente -->
            <div class="detail-section">
              <h3>Información del Cliente</h3>
              <div class="detail-item">
                <label>Nombre:</label>
                <span>{{ quote.userName }}</span>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ quote.userEmail }}</span>
              </div>
              <div class="detail-item">
                <label>Fecha de creación:</label>
                <TvRelativeTime :date="quote.createdAt" lang="es" />
              </div>
            </div>

            <!-- Gestión de estado -->
            <div class="detail-section">
              <h3>Gestión</h3>
              <div class="detail-item">
                <label>Estado:</label>
                <select 
                  :value="quote.status" 
                  @change="updateStatus($event.target.value as QuoteStatus)"
                  class="status-select"
                >
                  <option v-for="(config, status) in statusConfig" :key="status" :value="status">
                    {{ config.label }}
                  </option>
                </select>
              </div>
              
              <div class="detail-item">
                <label>Prioridad:</label>
                <div v-if="editingField === 'priority'" class="edit-field">
                  <select v-model="tempValues.priority" class="edit-input">
                    <option v-for="(config, priority) in priorityConfig" :key="priority" :value="priority">
                      {{ config.label }}
                    </option>
                  </select>
                  <div class="edit-actions">
                    <RgButton @click="saveField('priority')" icon="check" type="icon" size="small" />
                    <RgButton @click="cancelEditing" icon="close" type="icon" size="small" outlined />
                  </div>
                </div>
                <div v-else class="editable-field" @click="startEditing('priority', quote.priority || 'medium')">
                  <span>{{ priorityConfig[quote.priority as keyof typeof priorityConfig]?.label || 'Media' }}</span>
                  <span class="material-icons edit-icon">edit</span>
                </div>
              </div>

              <div class="detail-item">
                <label>Valor estimado:</label>
                <div v-if="editingField === 'estimatedValue'" class="edit-field">
                  <input 
                    v-model.number="tempValues.estimatedValue" 
                    type="number" 
                    class="edit-input"
                    placeholder="0"
                  >
                  <div class="edit-actions">
                    <RgButton @click="saveField('estimatedValue')" icon="check" type="icon" size="small" />
                    <RgButton @click="cancelEditing" icon="close" type="icon" size="small" outlined />
                  </div>
                </div>
                <div v-else class="editable-field" @click="startEditing('estimatedValue', quote.estimatedValue || 0)">
                  <span>${{ (quote.estimatedValue || 0).toLocaleString() }}</span>
                  <span class="material-icons edit-icon">edit</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Productos cotizados -->
          <div class="products-section">
            <h3>Productos Cotizados</h3>
            <div class="products-list">
              <div v-for="(item, index) in quote.items" :key="index" class="product-item">
                <img :src="item.productImage" :alt="item.productName" class="product-image">
                <div class="product-info">
                  <h4>{{ item.productName }}</h4>
                  <p>Color: {{ item.colorName }}</p>
                  <p>Cantidad: {{ item.quantity.toLocaleString() }}</p>
                  <p v-if="item.includeMarking">Incluye marcación</p>
                </div>
                <div class="product-price">
                  <span class="unit-price">${{ item.unitPrice.toLocaleString() }} c/u</span>
                  <span class="total-price">${{ item.totalPrice.toLocaleString() }}</span>
                </div>
              </div>
            </div>
            <div class="total-section">
              <div class="total-item">
                <strong>Total: ${{ totalValue.toLocaleString() }}</strong>
              </div>
            </div>
          </div>

          <!-- Notas -->
          <div class="notes-section">
            <div class="note-item">
              <h4>Notas del Cliente</h4>
              <div v-if="editingField === 'clientNotes'" class="edit-field">
                <textarea 
                  v-model="tempValues.clientNotes" 
                  class="edit-textarea"
                  placeholder="Notas del cliente..."
                ></textarea>
                <div class="edit-actions">
                  <RgButton @click="saveField('clientNotes')" icon="check" type="icon" size="small" />
                  <RgButton @click="cancelEditing" icon="close" type="icon" size="small" outlined />
                </div>
              </div>
              <div v-else class="editable-field" @click="startEditing('clientNotes', quote.clientNotes || '')">
                <p>{{ quote.clientNotes || 'Sin notas del cliente' }}</p>
                <span class="material-icons edit-icon">edit</span>
              </div>
            </div>

            <div class="note-item">
              <h4>Notas Internas</h4>
              <div v-if="editingField === 'internalNotes'" class="edit-field">
                <textarea 
                  v-model="tempValues.internalNotes" 
                  class="edit-textarea"
                  placeholder="Notas internas..."
                ></textarea>
                <div class="edit-actions">
                  <RgButton @click="saveField('internalNotes')" icon="check" type="icon" size="small" />
                  <RgButton @click="cancelEditing" icon="close" type="icon" size="small" outlined />
                </div>
              </div>
              <div v-else class="editable-field" @click="startEditing('internalNotes', quote.internalNotes || '')">
                <p>{{ quote.internalNotes || 'Sin notas internas' }}</p>
                <span class="material-icons edit-icon">edit</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Comentarios -->
        <div v-if="activeTab === 'comments'" class="tab-content">
          <div class="comments-section">
            <div class="add-comment">
              <textarea 
                v-model="newComment" 
                placeholder="Agregar comentario..."
                class="comment-input"
              ></textarea>
              <div class="comment-actions">
                <label class="checkbox-label">
                  <input v-model="isInternalComment" type="checkbox">
                  Comentario interno
                </label>
                <RgButton @click="addComment" :disabled="!newComment.trim()">
                  Agregar Comentario
                </RgButton>
              </div>
            </div>
            
            <div class="comments-list">
              <div class="empty-state" v-if="!quote.comments?.length">
                <span class="material-icons">comment</span>
                <p>No hay comentarios aún</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Historial -->
        <div v-if="activeTab === 'history'" class="tab-content">
          <div class="history-section">
            <div class="empty-state" v-if="!quote.statusHistory?.length">
              <span class="material-icons">history</span>
              <p>No hay historial disponible</p>
            </div>
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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-info h2 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.header-meta {
  display: flex;
  gap: 0.75rem;
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

.modal-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #374151;
  background: #f9fafb;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
}

.detail-section h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item label {
  font-weight: 500;
  color: #374151;
}

.editable-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.editable-field:hover {
  background: #f3f4f6;
}

.edit-icon {
  font-size: 16px;
  color: #9ca3af;
}

.edit-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-input,
.edit-textarea {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.edit-textarea {
  min-height: 80px;
  resize: vertical;
}

.edit-actions {
  display: flex;
  gap: 0.25rem;
}

.status-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.products-section {
  margin-bottom: 2rem;
}

.products-section h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-info h4 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.product-info p {
  margin: 0.125rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.product-price {
  text-align: right;
}

.unit-price {
  display: block;
  color: #6b7280;
  font-size: 0.875rem;
}

.total-price {
  display: block;
  color: #1f2937;
  font-weight: 600;
  font-size: 1.125rem;
}

.total-section {
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  text-align: right;
}

.notes-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.note-item {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
}

.note-item h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.comments-section {
  max-height: 400px;
  overflow-y: auto;
}

.add-comment {
  margin-bottom: 1.5rem;
}

.comment-input {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 0.75rem;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.empty-state .material-icons {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .modal-container {
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
  
  .details-grid,
  .notes-section {
    grid-template-columns: 1fr;
  }
}
</style>
