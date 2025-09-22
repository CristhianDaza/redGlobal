<script setup lang="ts">
import type { ProductsRedGlobal, TableEntry, QuoteItem } from '@/types/common.d'
import { ref, computed, defineAsyncComponent, watch, onUnmounted } from 'vue'
import { useAuthStore, useUserStore, useQuoteStore } from '@/store'
import { formatColor } from '@/utils'

const RgModal = defineAsyncComponent(/* webpackChunkName: "rgModal" */() => import('@/components/UI/RgModal.vue'))
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'))

const props = defineProps<{
  isOpen: boolean
  product: ProductsRedGlobal
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const authStore = useAuthStore()
const userStore = useUserStore()
const quoteStore = useQuoteStore()

const selectedColors = ref<Map<string, { color: TableEntry, quantities: number[] }>>(new Map())
const includeMarking = ref(false)
const inkColors = ref(1)
const isLoading = ref(false)

const resetForm = () => {
  selectedColors.value.clear()
  includeMarking.value = false
  inkColors.value = 1
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscKey)
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscKey)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.body.style.overflow = ''
})

const availableColors = computed(() => {
  return props.product.tableQuantity?.filter(entry => entry.quantity > 0) || []
})

const handleColorChange = (color: TableEntry) => {
  if (selectedColors.value.has(color.color)) {
    selectedColors.value.delete(color.color)
  } else {
    selectedColors.value.set(color.color, { color, quantities: [1] })
  }
  selectedColors.value = new Map(selectedColors.value)
}

const updateQuantity = (color: TableEntry, index: number, newQuantity: number) => {
  if (selectedColors.value.has(color.color)) {
    const entry = selectedColors.value.get(color.color)!
    if (newQuantity <= color.quantity && newQuantity > 0) {
      entry.quantities[index] = newQuantity
      selectedColors.value = new Map(selectedColors.value)
    }
  }
}

const addQuantityField = (color: TableEntry) => {
  if (selectedColors.value.has(color.color)) {
    const entry = selectedColors.value.get(color.color)!
    entry.quantities.push(1)
    selectedColors.value = new Map(selectedColors.value)
  }
}

const removeQuantityField = (color: TableEntry, index: number) => {
  if (selectedColors.value.has(color.color)) {
    const entry = selectedColors.value.get(color.color)!
    if (entry.quantities.length > 1) {
      entry.quantities.splice(index, 1)
      selectedColors.value = new Map(selectedColors.value)
    }
  }
}

const calculatePriceWithIncrease = (price: number) => {
  const currentUser = userStore.users.find(user => user.email === authStore.user?.email?.toLowerCase());

  if (currentUser?.priceIncrease) {
    const finalPrice = price * (1 + currentUser.priceIncrease / 100);
    return Math.ceil(finalPrice);
  }

  return price;
}

const handleSubmit = async () => {
  if (selectedColors.value.size === 0) return
  isLoading.value = true

  try {
    for (const { color, quantities } of selectedColors.value.values()) {
      const unitPrice = calculatePriceWithIncrease(Number(color.price));
      
      for (const quantity of quantities) {
        if (quantity > 0) {
          const quoteItem: QuoteItem = {
            productId: props.product.id,
            productName: props.product.name,
            productImage: props.product.mainImage,
            color: color.color,
            colorName: color.colorName,
            quantity: quantity,
            maxQuantity: color.quantity,
            includeMarking: includeMarking.value,
            inkColors: includeMarking.value ? inkColors.value : undefined,
            unitPrice: unitPrice,
            totalPrice: unitPrice * quantity
          }
          await quoteStore.addItemToQuote(quoteItem)
        }
      }
    }

    resetForm()
    emit('close')
  } catch (error) {
    console.error('Error al agregar items a la cotización:', error)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <RgModal
    :is-open="isOpen"
    :title="'Cotizar ' + product.name"
    :max-width="'800px'"
    @close="handleClose"
  >
    <div class="quote-form">
      <div class="product-info">
        <img :src="product.mainImage" :alt="product.name">
        <div class="product-details">
          <h3>{{ product.name }}</h3>
          <p v-if="product.description" v-html="product.description"></p>
          <p v-if="product.size">Medidas: {{ product.size }}</p>
        </div>
      </div>

      <div class="form-group">
        <label>Colores:</label>
        <div class="color-grid">
          <button
            v-for="color in availableColors"
            :key="color.color"
            class="color-button"
            :class="{ active: selectedColors.has(color.color) }"
            @click="handleColorChange(color)"
          >
            <span
              class="color-preview"
              :style="{ backgroundColor: formatColor(color.color)}"
            ></span>
            <span class="color-name">{{ color.colorName }}</span>
            <span class="color-stock">({{ color.quantity }} disponibles)</span>
          </button>
        </div>
      </div>

      <div v-if="selectedColors.size > 0" class="selected-colors">
        <div
          v-for="[colorKey, { color, quantities }] in selectedColors"
          :key="colorKey"
          class="selected-color-item"
        >
          <div class="color-header">
            <div class="color-info">
              <span
                class="color-preview"
                :style="{ backgroundColor: formatColor(color.color) }"
              ></span>
              <span class="color-name">{{ color.colorName }}</span>
              <span class="color-stock">({{ color.quantity }} disponibles)</span>
            </div>
            <RgButton
              text="+ Agregar cantidad"
              type="default"
              :custom-style="{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white'
              }"
              @click="addQuantityField(color)"
            />
          </div>
          <div class="quantities-list">
            <div
              v-for="(quantity, index) in quantities"
              :key="index"
              class="quantity-row"
            >
              <div class="quantity-control">
                <label :for="'quantity-' + colorKey + '-' + index">Cantidad {{ index + 1 }}:</label>
                <input
                  :id="'quantity-' + colorKey + '-' + index"
                  :value="quantity"
                  type="number"
                  :min="1"
                  :max="color.quantity"
                  @input="e => updateQuantity(color, index, Number((e.target as HTMLInputElement).value))"
                  required
                >
              </div>
              <RgButton
                v-if="quantities.length > 1"
                text="Eliminar"
                type="default"
                :custom-style="{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#ef4444',
                  color: 'white'
                }"
                @click="removeQuantityField(color, index)"
              />
            </div>
          </div>
          <div class="help-text">
            Máximo: {{ color.quantity }} unidades por cantidad
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="includeMarking"
          >
          Incluir marcación
        </label>
      </div>

      <div class="form-group" v-if="includeMarking">
        <label for="inkColors">Número de tintas:</label>
        <select
          id="inkColors"
          v-model="inkColors"
          required
        >
          <option value="1">1 tinta</option>
          <option value="2">2 tintas</option>
          <option value="3">3 tintas</option>
          <option value="4">4 tintas</option>
        </select>
      </div>

    </div>
    <template #footer>
      <div class="button-container">
        <RgButton
          text="Cancelar"
          type="default"
          :disabled="isLoading"
          @click="handleClose"
        />
        <RgButton
          text="Agregar a Cotización"
          type="default"
          :custom-style="{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            boxShadow: 'var(--primary-color) 0px 0px 5px'
          }"
          :disabled="selectedColors.size === 0 || isLoading || ![...selectedColors.values()].some(item => item.quantities.some(q => q > 0))"
          @click="handleSubmit"
        >
          <template #default>
            <span v-if="!isLoading">Agregar a Cotización</span>
            <span v-else class="loading-spinner"></span>
          </template>
        </RgButton>
      </div>
    </template>
  </RgModal>
</template>

<style scoped>
.quote-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.quote-form::-webkit-scrollbar {
  width: 6px;
}

.quote-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.quote-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.quote-form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.product-info {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-info img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0.5rem;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-details h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1e293b;
}

.product-details p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #4a5568;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #fafafa;
}

.color-grid::-webkit-scrollbar {
  width: 6px;
}

.color-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.color-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.color-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.color-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.color-button:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.color-button.active {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.2);
  transform: translateY(-1px);
}

.color-preview {
  min-width: 1.2rem;
  min-height: 1.2rem;
  border-radius: 0.25rem;
}

.color-name {
  font-size: 0.875rem;
  color: #4a5568;
}

.color-stock {
  font-size: 0.75rem;
  color: #64748b;
}

input[type="number"],
select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  max-width: 200px;
}

input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color), 0.1);
}

.help-text {
  font-size: 0.875rem;
  color: #64748b;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.selected-colors {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.selected-color-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.color-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.quantities-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quantity-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.quantity-control input {
  max-width: 120px;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
