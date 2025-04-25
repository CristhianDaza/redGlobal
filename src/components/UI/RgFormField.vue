<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: any;
  label?: string;
  type?: string;
  name: string;
  placeholder?: string;
  errors?: string[];
  touched?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  errors: () => [],
  touched: false,
  required: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'blur'): void;
}>();

const hasError = computed(() => props.touched && props.errors.length > 0);
const errorMessage = computed(() => props.errors[0]);

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="form-field">
    <label v-if="label" :for="name" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <input
      :id="name"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="form-input"
      :class="{ 'has-error': hasError }"
      @input="updateValue"
      @blur="$emit('blur')"
    />

    <span v-if="hasError" class="error-message">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #dc2626;
  margin-left: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
}

.form-input.has-error {
  border-color: #dc2626;
}

.error-message {
  font-size: 0.75rem;
  color: #dc2626;
}
</style>
