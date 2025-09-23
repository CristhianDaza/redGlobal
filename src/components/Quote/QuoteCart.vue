<script setup lang="ts">
import { computed, ref, defineAsyncComponent } from 'vue'
import { useQuoteStore, useUserStore, useAuthStore } from '@/store'
import { formatColor } from '@/utils'

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'))
const RgModal = defineAsyncComponent(/* webpackChunkName: "RgModal" */() => import('@/components/UI/RgModal.vue'))
const RgEmptyState = defineAsyncComponent(/* webpackChunkName: "rgEmptyState" */() => import('@/components/UI/RgEmptyState.vue'))

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isLoading = ref(false)
const clientNotes = ref('')

const quoteStore = useQuoteStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const currentQuote = computed(() => quoteStore.currentQuote)
const hasItems = computed(() => currentQuote.value.length > 0)

const userColor = computed(() => {
  const user = userStore.users.find(u => u.email === authStore.user?.email?.toLowerCase())
  return user?.primaryColor || '#ff4444'
})

const handleRemoveItem = (index: number) => {
  isLoading.value = true
  quoteStore.removeQuoteItem(index)
  isLoading.value = false
}

const handleUpdateQuantity = (index: number, newQuantity: number) => {
  isLoading.value = true
  if (newQuantity <= 0) return
  const item = currentQuote.value[index]
  if (newQuantity > item.maxQuantity) {
    newQuantity = item.maxQuantity
  }
  quoteStore.updateQuoteItem(index, { quantity: newQuantity })
  isLoading.value = false
}

const handleUpdateInkColors = (index: number, colors: number) => {
  isLoading.value = true
  quoteStore.updateQuoteItem(index, { inkColors: colors })
  isLoading.value = false
}

const handleToggleMarking = (index: number) => {
  const item = currentQuote.value[index]
  quoteStore.updateQuoteItem(index, {
    includeMarking: !item.includeMarking,
    inkColors: !item.includeMarking ? 1 : undefined
  })
}

const handleClearCart = () => {
  isLoading.value = true
  quoteStore.clearQuote()
  isLoading.value = false
}

const handleSubmitQuote = async () => {
  try {
    isLoading.value = true
    await quoteStore.submitQuote(clientNotes.value.trim() || undefined)
    clientNotes.value = '' // Limpiar las notas después del envío
    emit('close')
  } catch (error) {
    console.error('Error al enviar cotización:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <RgModal
    :is-open="isOpen"
    title="Mi Cotización"
    :show-confirm="hasItems"
    confirm-text="Enviar Cotización"
    :confirm-class="hasItems ? 'primary' : 'default'"
    :custom-style="{
      backgroundColor: hasItems ? userColor : '#718096',
      color: 'white'
    }"
    @close="$emit('close')"
    @confirm="handleSubmitQuote"
    :loading="isLoading"
  >
    <div v-if="hasItems" class="quote-cart">
      <div class="quote-items">
        <div
          v-for="(item, index) in currentQuote"
          :key="item.productId + item.color"
          class="quote-item"
        >
          <div class="item-image">
            <img :src="item.productImage" :alt="item.productName">
          </div>

          <div class="item-details">
            <h3>{{ item.productName }}</h3>

            <div class="color-info">
              <span
                class="color-preview"
                :style="{ backgroundColor: formatColor(item.colorName) }"
              ></span>
              <span>{{ item.colorName }}</span>
            </div>

            <div class="quantity-control">
              <label>Cantidad:</label>
              <div class="quantity-input">
                <button
                  class="quantity-btn"
                  @click="handleUpdateQuantity(index, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                >
                  -
                </button>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  :min="1"
                  :max="item.maxQuantity"
                  @input="(e) => {
                    const target = e.target as HTMLInputElement
                    handleUpdateQuantity(index, Number(target.value))
                  }"
                >
                <button
                  class="quantity-btn"
                  @click="handleUpdateQuantity(index, item.quantity + 1)"
                  :disabled="item.quantity >= item.maxQuantity"
                >
                  +
                </button>
              </div>
              <span class="max-quantity">Máximo: {{ item.maxQuantity }}</span>
            </div>

            <div class="marking-options">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="item.includeMarking"
                  @change="handleToggleMarking(index)"
                >
                Incluir marcación
              </label>

              <div v-if="item.includeMarking" class="ink-colors">
                <label>Número de tintas:</label>
                <select
                  :value="item.inkColors"
                  @change="(e) => {
                    const target = e.target as HTMLSelectElement
                    handleUpdateInkColors(index, Number(target.value))
                  }"
                >
                  <option value="1">1 tinta</option>
                  <option value="2">2 tintas</option>
                  <option value="3">3 tintas</option>
                  <option value="4">4 tintas</option>
                </select>
              </div>
            </div>
          </div>

          <button
            class="remove-btn"
            @click="handleRemoveItem(index)"
          >
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>

      <div class="client-notes-section">
        <label for="clientNotes" class="notes-label">Notas adicionales (opcional):</label>
        <textarea
          id="clientNotes"
          v-model="clientNotes"
          class="notes-textarea"
          placeholder="Agrega cualquier información adicional sobre tu cotización..."
          rows="3"
        ></textarea>
      </div>

      <div class="cart-actions">
        <RgButton
          @click="handleClearCart"
          icon="remove"
          icon-position="left"
        >
          Limpiar todo
        </RgButton>
      </div>
    </div>

    <RgEmptyState
      v-else
      icon="shopping_cart"
      title="No hay productos en tu cotización"
      description="Agrega productos desde el catálogo para crear tu cotización"
    />
  </RgModal>
</template>

<style scoped>
.quote-cart {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quote-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.quote-item {
  display: grid;
  grid-template-columns: 100px 1fr 40px;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  position: relative;
}

.item-image {
  width: 100px;
  height: 100px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0.25rem;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-details h3 {
  margin: 0;
  font-size: 1rem;
  color: #1e293b;
}

.color-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.color-preview {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  border: 1px solid #e2e8f0;
}

.quantity-control {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.quantity-control label {
  font-size: 0.875rem;
  color: #4a5568;
}

.quantity-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 120px;
}

.quantity-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #495057;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.quantity-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
  pointer-events: none;
}

.quantity-btn:hover::before {
  left: 100%;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 2px 6px rgba(255, 68, 68, 0.25);
  transform: translateY(-1px);
}

.quantity-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(255, 68, 68, 0.2);
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f8f9fa !important;
  color: #6c757d !important;
  border-color: #e9ecef !important;
  box-shadow: none !important;
  transform: none !important;
}

.quantity-input input {
  width: 60px;
  text-align: center;
  padding: 0.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
}

.max-quantity {
  font-size: 0.75rem;
  color: #64748b;
}

.marking-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
  cursor: pointer;
}

.ink-colors {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.ink-colors label {
  color: #4a5568;
}

.ink-colors select {
  padding: 0.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: white;
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 50%;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.remove-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
  pointer-events: none;
}

.remove-btn:hover::before {
  left: 100%;
}

.remove-btn:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.25);
  transform: translateY(-1px);
}

.remove-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(220, 53, 69, 0.2);
}

.client-notes-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.notes-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.notes-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.notes-textarea:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.notes-textarea::placeholder {
  color: #9ca3af;
}

.cart-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
