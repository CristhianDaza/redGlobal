<script setup lang="ts">
import type { ProductsRedGlobal } from '@/types/common.d';
import { ref, watch } from 'vue';
import { useProductsStore } from '@/store';
import { normalizeString } from '@/utils';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  minChars?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'select', product: ProductsRedGlobal): void;
  (e: 'suggestions-update', suggestions: ProductsRedGlobal[]): void;
  (e: 'searchAll'): void;
}>();

const storeProducts = useProductsStore();
const showSuggestions = ref(false);
const suggestions = ref<ProductsRedGlobal[]>([]);

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  filterSuggestions(value);
};

const filterSuggestions = (query: string) => {
  if (!query || query.length < (props.minChars || 3)) {
    suggestions.value = [];
    emit('suggestions-update', []);
    showSuggestions.value = false;
    return;
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  suggestions.value = (storeProducts.products || [])
    .filter(product => {
      const normalizedName = normalizeString(product.name);
      const normalizedDescription = normalizeString(product.description);
      const normalizedId = normalizeString(product.id);
      const normalizedCategory = normalizeString(product.category);

      return searchTerms.every(term => {
        const normalizedTerm = normalizeString(term);
        return normalizedName.includes(normalizedTerm) ||
          normalizedDescription.includes(normalizedTerm) ||
          normalizedCategory.includes(normalizedTerm) ||
          normalizedId.includes(normalizedTerm);
      });
    })

  showSuggestions.value = suggestions.value.length > 0;
  emit('suggestions-update', suggestions.value);
};

const selectSuggestion = (suggestion: ProductsRedGlobal) => {
  emit('update:modelValue', suggestion.name);
  emit('select', suggestion);
  showSuggestions.value = false;
};

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const handleViewAll = () => {
  emit('searchAll');
  showSuggestions.value = false;
};

watch(() => props.modelValue, (newValue) => {
  filterSuggestions(newValue);
});
</script>

<template>
  <div class="autocomplete">
    <input
      type="text"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      @focus="showSuggestions = true"
      @blur="handleBlur"
    />
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions">
      <div
        v-for="suggestion in suggestions.slice(0, 12)"
        :key="suggestion.id"
        class="suggestion-item"
        @mousedown="selectSuggestion(suggestion)"
      >
        <div class="suggestion-content">
          <span class="suggestion-name">{{ suggestion.name }}</span>
          <img
            v-if="suggestion.mainImage"
            :src="suggestion.mainImage"
            :alt="suggestion.name"
            class="suggestion-image"
          />
        </div>
      </div>
      <div v-if="suggestions.length > 12" class="suggestion-item view-all" @mousedown="handleViewAll">
        <div class="suggestion-content">
          <span class="suggestion-name">Ver todos ({{ suggestions.length }} resultados)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.autocomplete {
  position: relative;
  width: 100%;
  height: 32px;
}

.autocomplete input {
  width: 100%;
  padding: 0 1rem;
  font-size: 0.875rem;
  background-color: #f5f5f5;
  color: #333;
  transition: all 0.3s ease;
  height: 40px;
  line-height: 32px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.autocomplete input::placeholder {
  color: #666;
}

.autocomplete input:focus {
  outline: none;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2);
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 9px;
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.suggestion-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.suggestion-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  color: #333;
}

.suggestion-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}
</style>
