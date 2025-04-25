<script setup lang="ts">
import type { ProductsRedGlobal, TableEntry, QuoteItem } from '@/types/common.d'
import { ref, computed, defineAsyncComponent } from 'vue'
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

const selectedColors = ref<Map<string, { color: TableEntry, quantity: number }>>(new Map())
const includeMarking = ref(false)
const inkColors = ref(1)
const isLoading = ref(false)

const resetForm = () => {
  selectedColors.value.clear()
  includeMarking.value = false
  inkColors.value = 1
}

const availableColors = computed(() => {
  return props.product.tableQuantity?.filter(entry => entry.quantity > 0) || []
})

const handleColorChange = (color: TableEntry) => {
  if (selectedColors.value.has(color.color)) {
    selectedColors.value.delete(color.color)
  } else {
    selectedColors.value.set(color.color, { color, quantity: 1 })
  }
  selectedColors.value = new Map(selectedColors.value)
}

const updateQuantity = (color: TableEntry, newQuantity: number) => {
  if (selectedColors.value.has(color.color)) {
    const entry = selectedColors.value.get(color.color)!
    if (newQuantity <= color.quantity && newQuantity > 0) {
      entry.quantity = newQuantity
      selectedColors.value = new Map(selectedColors.value)
    }
  }
}

const calculatePriceWithIncrease = (price: number) => {
  const currentUser = userStore.users.find(user => user.email === authStore.user?.email);

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
    for (const { color, quantity } of selectedColors.value.values()) {
      const unitPrice = calculatePriceWithIncrease(Number(color.price));
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
    @close="handleClose"
  >
    <div class="quote-form">
      <!-- Información del producto -->
      <div class="product-info">
        <img :src="product.mainImage" :alt="product.name">
        <div class="product-details">
          <h3>{{ product.name }}</h3>
          <p v-if="product.description" v-html="product.description"></p>
          <p v-if="product.size">Medidas: {{ product.size }}</p>
        </div>
      </div>

      <!-- Selección de color y cantidad -->
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

      <!-- Cantidades por color seleccionado -->
      <div v-if="selectedColors.size > 0" class="selected-colors">
        <div
          v-for="[colorKey, { color, quantity }] in selectedColors"
          :key="colorKey"
          class="selected-color-item"
        >
          <div class="color-info">
            <span
              class="color-preview"
              :style="{ backgroundColor: color.color }"
            ></span>
            <span class="color-name">{{ color.colorName }}</span>
          </div>
          <div class="quantity-control">
            <label :for="'quantity-' + colorKey">Cantidad:</label>
            <input
              :id="'quantity-' + colorKey"
              :value="quantity"
              type="number"
              :min="1"
              :max="color.quantity"
              @input="e => updateQuantity(color, Number((e.target as HTMLInputElement).value))"
              required
            >
            <span class="help-text">
              Máximo: {{ color.quantity }} unidades
            </span>
          </div>

        </div>
      </div>

      <!-- Opciones de marcación -->
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
          :disabled="selectedColors.size === 0 || isLoading || ![...selectedColors.values()].some(item => item.quantity > 0)"
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
}

.product-info {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.product-info img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 0.25rem;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.color-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.color-button:hover {
  border-color: var(--primary-color);
}

.color-button.active {
  border-color: var(--primary-color);
  background: #f0f9ff;
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
  margin-top: 1rem;
}

.selected-color-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  align-items: center;
}

.quantity-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
