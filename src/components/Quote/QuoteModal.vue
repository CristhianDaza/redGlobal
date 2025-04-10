<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProductsRedGlobal, TableEntry, QuoteItem } from '../../types/common.d'
import RgModal from '../UI/RgModal.vue'
import { useQuoteStore } from '../../store/useQuoteStore'

const props = defineProps<{
  isOpen: boolean
  product: ProductsRedGlobal
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const quoteStore = useQuoteStore()

const selectedColor = ref<TableEntry | null>(null)
const quantity = ref(1)
const includeMarking = ref(false)
const inkColors = ref(1)

const availableColors = computed(() => {
  return props.product.tableQuantity?.filter(entry => entry.quantity > 0) || []
})

const maxQuantity = computed(() => {
  return selectedColor.value?.quantity || 0
})

const handleColorChange = (color: TableEntry) => {
  selectedColor.value = color
  if (quantity.value > color.quantity) {
    quantity.value = color.quantity
  }
}

const handleSubmit = () => {
  if (!selectedColor.value) return

  const quoteItem: QuoteItem = {
    productId: props.product.id,
    productName: props.product.name,
    productImage: props.product.mainImage,
    color: selectedColor.value.color,
    colorName: selectedColor.value.colorName,
    quantity: quantity.value,
    maxQuantity: selectedColor.value.quantity,
    includeMarking: includeMarking.value,
    inkColors: includeMarking.value ? inkColors.value : undefined
  }

  quoteStore.addItemToQuote(quoteItem)
  emit('close')
}

const handleClose = () => {
  selectedColor.value = null
  quantity.value = 1
  includeMarking.value = false
  inkColors.value = 1
  emit('close')
}
</script>

<template>
  <RgModal
    :is-open="isOpen"
    :title="'Cotizar ' + product.name"
    @close="handleClose"
    @confirm="handleSubmit"
  >
    <div class="quote-form">
      <!-- Información del producto -->
      <div class="product-info">
        <img :src="product.mainImage" :alt="product.name">
        <div class="product-details">
          <h3>{{ product.name }}</h3>
          <p v-if="product.material">Material: {{ product.material }}</p>
          <p v-if="product.size">Tamaño: {{ product.size }}</p>
        </div>
      </div>

      <!-- Selección de color y cantidad -->
      <div class="form-group">
        <label>Color:</label>
        <div class="color-grid">
          <button
            v-for="color in availableColors"
            :key="color.color"
            class="color-button"
            :class="{ active: selectedColor?.color === color.color }"
            @click="handleColorChange(color)"
          >
            <span 
              class="color-preview"
              :style="{ backgroundColor: color.color }"
            ></span>
            <span class="color-name">{{ color.colorName }}</span>
            <span class="color-stock">({{ color.quantity }} disponibles)</span>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="quantity">Cantidad:</label>
        <input
          id="quantity"
          v-model="quantity"
          type="number"
          :min="1"
          :max="maxQuantity"
          :disabled="!selectedColor"
          required
        >
        <span class="help-text" v-if="selectedColor">
          Máximo: {{ maxQuantity }} unidades
        </span>
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
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid #e2e8f0;
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
</style>
