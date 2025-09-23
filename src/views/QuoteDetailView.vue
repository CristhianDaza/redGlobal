<script setup lang="ts">
import type { QuoteStatus } from '@/types/common.d'
import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TvRelativeTime from '@todovue/tv-relative-time'
import { useAdvancedQuotes } from '@/composable/admin/useAdvancedQuotes'

const RgButton = defineAsyncComponent(() => import('@/components/UI/RgButton.vue'))

const route = useRoute()
const router = useRouter()

const {
  quotes,
  isLoading,
  isUpdating,
  loadQuotes,
  updateQuoteStatus,
  updateQuoteField,
  addQuoteComment,
  deleteQuoteComment
} = useAdvancedQuotes()

const activeTab = ref<'details' | 'comments' | 'history'>('details')
const newComment = ref('')
const isInternalComment = ref(false)
const editingField = ref<string | null>(null)
const tempValues = ref<Record<string, any>>({})

const currentQuote = computed(() => {
  const quoteId = route.params.id as string
  return quotes.value.find(q => q.id === quoteId || q.idDoc === quoteId) || null
})
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

const totalValue = computed(() => {
  if (!currentQuote.value?.items) return 0
  return currentQuote.value.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
})

function goBack() {
  router.push('/admin?tab=advanced-quotes')
}

async function handleUpdateStatus(newStatus: QuoteStatus) {
  if (!currentQuote.value) return
  await updateQuoteStatus(currentQuote.value.id, newStatus, `Estado cambiado a ${statusConfig[newStatus].label}`)
}

async function handleAddComment() {
  if (!currentQuote.value || !newComment.value.trim()) return
  
  await addQuoteComment(currentQuote.value.id, newComment.value.trim(), isInternalComment.value)
  newComment.value = ''
  isInternalComment.value = false
}

async function handleDeleteComment(index: number) {
  if (!currentQuote.value) return
  await deleteQuoteComment(currentQuote.value.id, index)
}

function formatDate(dateString: string) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

function startEditing(field: string, currentValue: any) {
  editingField.value = field
  tempValues.value[field] = currentValue
}

async function saveField(field: string) {
  if (!currentQuote.value) return
  
  await updateQuoteField(currentQuote.value.id, field, tempValues.value[field])
  editingField.value = null
  delete tempValues.value[field]
}

function cancelEditing() {
  editingField.value = null
  tempValues.value = {}
}

onMounted(async () => {
  if (quotes.value.length === 0) {
    await loadQuotes()
  }
  
  if (!currentQuote.value) {
    router.push('/admin?tab=advanced-quotes')
  }
})

watch(() => route.params.id, async (newId) => {
  if (newId && quotes.value.length === 0) {
    await loadQuotes()
  }
})
</script>

<template>
  <div class="quote-detail-view">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando cotización...</p>
    </div>
    <div v-else-if="!currentQuote" class="not-found-container">
      <div class="not-found-content">
        <h2>Cotización no encontrada</h2>
        <p>La cotización que buscas no existe o ha sido eliminada.</p>
        <RgButton @click="goBack">Volver al Admin</RgButton>
      </div>
    </div>

    <div v-else class="quote-container">
      <div class="quote-header">
        <div class="header-left">
          <RgButton @click="goBack" icon="arrow-left" type="icon" outlined>
          </RgButton>
          <div class="header-info">
            <h1>Cotización #{{ currentQuote.id.slice(-6) }}</h1>
            <p class="header-meta">
              <span>{{ currentQuote.userName }}</span>
              <span class="separator">•</span>
              <TvRelativeTime :date="currentQuote.createdAt" lang="es" />
            </p>
          </div>
        </div>
        
        <div class="header-right">
          <span 
            class="status-badge"
            :style="{ 
              color: statusConfig[currentQuote.status]?.color,
              backgroundColor: statusConfig[currentQuote.status]?.bgColor
            }"
          >
            {{ statusConfig[currentQuote.status]?.label }}
          </span>
        </div>
      </div>

      <div class="quote-tabs">
        <button 
          @click="activeTab = 'details'" 
          :class="['tab-button', { active: activeTab === 'details' }]"
        >
          <span class="tab-icon">ℹ️</span>
          Detalles
        </button>
        <button 
          @click="activeTab = 'comments'" 
          :class="['tab-button', { active: activeTab === 'comments' }]"
        >
          <span class="tab-icon">💬</span>
          Comentarios
          <span v-if="currentQuote.comments?.length" class="comment-count">
            {{ currentQuote.comments.length }}
          </span>
        </button>
        <button 
          @click="activeTab = 'history'" 
          :class="['tab-button', { active: activeTab === 'history' }]"
        >
          <span class="tab-icon">📋</span>
          Historial
          <span v-if="currentQuote.statusHistory?.length" class="history-count">
            {{ currentQuote.statusHistory.length }}
          </span>
        </button>
      </div>

      <div class="quote-content">
        <div v-if="activeTab === 'details'" class="tab-content">
          <div class="details-grid">
            <div class="detail-section">
              <h3>Información del Cliente</h3>
              <div class="detail-item">
                <label>Nombre:</label>
                <span>{{ currentQuote.userName }}</span>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ currentQuote.userEmail }}</span>
              </div>
              <div class="detail-item">
                <label>Fecha de creación:</label>
                <TvRelativeTime :date="currentQuote.createdAt" lang="es" />
              </div>
            </div>

            <div class="detail-section">
              <h3>Gestión</h3>
              <div class="detail-item">
                <label>Estado:</label>
                <div class="status-field">
                  <select 
                    :value="currentQuote.status" 
                    @change="handleUpdateStatus(($event.target as HTMLSelectElement)?.value as QuoteStatus)"
                    class="status-select"
                    :disabled="isUpdating"
                  >
                    <option v-for="(config, status) in statusConfig" :key="status" :value="status">
                      {{ config.label }}
                    </option>
                  </select>
                  <div v-if="isUpdating" class="updating-indicator">
                    <div class="spinner"></div>
                    <span>Actualizando...</span>
                  </div>
                </div>
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
                    <RgButton @click="cancelEditing" icon="cancel" type="icon" size="small" outlined />
                  </div>
                </div>
                <div v-else class="editable-field" @click="startEditing('priority', currentQuote.priority || 'medium')">
                  <span>{{ priorityConfig[currentQuote.priority as keyof typeof priorityConfig]?.label || 'Media' }}</span>
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
                    <RgButton @click="cancelEditing" icon="cancel" type="icon" size="small" outlined />
                  </div>
                </div>
                <div v-else class="editable-field" @click="startEditing('estimatedValue', currentQuote.estimatedValue || 0)">
                  <span>${{ (currentQuote.estimatedValue || 0).toLocaleString() }}</span>
                  <span class="material-icons edit-icon">edit</span>
                </div>
              </div>
            </div>
          </div>

          <div class="products-section">
            <h3>Productos Cotizados</h3>
            <div class="products-list">
              <div v-for="(item, index) in currentQuote.items" :key="index" class="product-item">
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
                  <RgButton @click="cancelEditing" icon="cancel" type="icon" size="small" outlined />
                </div>
              </div>
              <div v-else class="editable-field" @click="startEditing('clientNotes', currentQuote.clientNotes || '')">
                <p>{{ currentQuote.clientNotes || 'Sin notas del cliente' }}</p>
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
                  <RgButton @click="cancelEditing" icon="cancel" type="icon" size="small" outlined />
                </div>
              </div>
              <div v-else class="editable-field" @click="startEditing('internalNotes', currentQuote.internalNotes || '')">
                <p>{{ currentQuote.internalNotes || 'Sin notas internas' }}</p>
                <span class="material-icons edit-icon">edit</span>
              </div>
            </div>
          </div>
        </div>

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
                <RgButton @click="handleAddComment" :disabled="!newComment.trim() || isUpdating">
                  Agregar Comentario
                </RgButton>
              </div>
            </div>
            
            <div class="comments-list">
              <div class="empty-state" v-if="!currentQuote.comments?.length">
                <span class="empty-icon">💬</span>
                <p>No hay comentarios aún</p>
              </div>
              
              <div v-else class="comments-container">
                <div 
                  v-for="(comment, index) in currentQuote.comments" 
                  :key="index"
                  class="comment-item"
                  :class="{ 'internal-comment': comment.isInternal }"
                >
                  <div class="comment-header">
                    <div class="comment-meta">
                      <span class="comment-author">{{ comment.author || 'Usuario' }}</span>
                      <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                      <span v-if="comment.isInternal" class="internal-badge">Interno</span>
                    </div>
                    <RgButton 
                      @click="handleDeleteComment(index)" 
                      icon="remove" 
                      type="icon" 
                      size="small"
                      :customStyle="{ color: '#ef4444', borderColor: '#ef4444' }"
                      outlined
                      :disabled="isUpdating"
                    >
                    </RgButton>
                  </div>
                  <div class="comment-content">
                    {{ comment.text }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'history'" class="tab-content">
          <div class="history-section">
            <div class="empty-state" v-if="!currentQuote.statusHistory?.length">
              <span class="empty-icon">📋</span>
              <p>No hay historial disponible</p>
            </div>
            
            <div v-else class="history-container">
              <div 
                v-for="(entry, index) in currentQuote.statusHistory" 
                :key="index"
                class="history-item"
              >
                <div class="history-icon">
                  <span 
                    class="status-dot"
                    :style="{ backgroundColor: statusConfig[entry.status]?.color || '#6b7280' }"
                  ></span>
                </div>
                <div class="history-content">
                  <div class="history-header">
                    <span class="history-status">
                      {{ statusConfig[entry.status]?.label || entry.status }}
                    </span>
                    <span class="history-date">
                      {{ formatDate(entry.changedAt) }}
                    </span>
                  </div>
                  <div class="history-meta">
                    <span class="history-author">Por: {{ entry.changedBy }}</span>
                  </div>
                  <div v-if="entry.notes" class="history-notes">
                    {{ entry.notes }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quote-detail-view {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
}

.loading-container,
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.not-found-content h2 {
  margin: 0 0 1rem 0;
  color: #374151;
}

.not-found-content p {
  margin: 0 0 2rem 0;
  color: #6b7280;
}

.quote-container {
  max-width: 1200px;
  margin: 0 auto;
}

.quote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-info h1 {
  margin: 0;
  color: #1f2937;
  font-size: 1.75rem;
  font-weight: 700;
}

.header-meta {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.separator {
  color: #d1d5db;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quote-tabs {
  display: flex;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 2rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  flex: 1;
  justify-content: center;
  position: relative;
}

.tab-button:hover {
  color: #374151;
  background: #f9fafb;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: #f8fafc;
}

.comment-count,
.history-count {
  background: #3b82f6;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
}

.history-count {
  background: #8b5cf6;
}

.quote-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
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

.status-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.updating-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.add-comment {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.comment-input {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 1rem;
}

.comment-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.comments-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.comment-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comment-item.internal-comment {
  background: #fef3c7;
  border-color: #f59e0b;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.comment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.comment-author {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.comment-date {
  color: #6b7280;
  font-size: 0.75rem;
}

.internal-badge {
  background: #f59e0b;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.comment-content {
  color: #374151;
  line-height: 1.5;
  font-size: 0.875rem;
  white-space: pre-wrap;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.empty-state .empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.history-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.history-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.history-icon {
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
}

.history-content {
  flex: 1;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-status {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.history-date {
  color: #6b7280;
  font-size: 0.75rem;
}

.history-meta {
  margin-bottom: 0.5rem;
}

.history-author {
  color: #6b7280;
  font-size: 0.75rem;
}

.history-notes {
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
  background: #f9fafb;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border-left: 3px solid #e5e7eb;
}

@media (max-width: 768px) {
  .quote-detail-view {
    padding: 1rem;
  }
  
  .quote-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-left {
    flex-direction: column;
    text-align: center;
  }
  
  .details-grid,
  .notes-section {
    grid-template-columns: 1fr;
  }
  
  .quote-tabs {
    flex-direction: column;
  }
  
  .tab-button {
    justify-content: flex-start;
    border-bottom: none;
    border-left: 3px solid transparent;
  }
  
  .tab-button.active {
    border-left-color: #3b82f6;
    border-bottom-color: transparent;
  }
}
</style>
