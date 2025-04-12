<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuoteStore } from '../../store/useQuoteStore'
import { useUserStore } from '../../store/useUserStore'
import { useAuthStore } from '../../store/useAuthStore'
import RgButton from '../UI/RgButton.vue'
import RgModal from '../UI/RgModal.vue'
import RgEmptyState from '../UI/RgEmptyState.vue'
import { formatColor } from '../../utils'
import { NotificationService } from '../../components/Notification/NotificationService'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isLoading = ref(false)

const quoteStore = useQuoteStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const currentQuote = computed(() => quoteStore.currentQuote)
const hasItems = computed(() => currentQuote.value.length > 0)

const userColor = computed(() => {
  const user = userStore.users.find(u => u.email === authStore.user?.email)
  return user?.primaryColor || '#ff4444'
})

const handleRemoveItem = (index: number) => {
  isLoading.value = true
  quoteStore.removeQuoteItem(index)
  NotificationService.push({
    title: 'Producto eliminado',
    description: 'El producto ha sido eliminado de la cotización',
    type: 'success'
  })
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
  NotificationService.push({
    title: 'Cotización limpiada',
    description: 'Todos los productos han sido eliminados de la cotización',
    type: 'success'
  })
  isLoading.value = false
}

const handleSubmitQuote = async () => {
  try {
    isLoading.value = true
    await quoteStore.submitQuote()
    emit('close')

    NotificationService.push({
      title: 'Cotización enviada',
      description: 'La cotización se ha enviado correctamente',
      type: 'success'
    })
  } catch (error) {
    console.error('Error al enviar cotización:', error)
    NotificationService.push({
      title: 'Error al enviar cotización',
      description: 'Ocurrió un error al enviar la cotización',
      type: 'error'
    })
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
      <!-- Lista de productos -->
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

      <!-- Acciones -->
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
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #4a5568;
  padding: 0;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
}

.remove-btn:hover {
  color: #ef4444;
}

.cart-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

.cart-actions .rg-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
