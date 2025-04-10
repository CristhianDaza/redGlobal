import { ref, computed } from 'vue';

export interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

export interface FieldRules {
  [key: string]: ValidationRule[];
}

export interface FormErrors {
  [key: string]: string[];
}

export interface UseFormOptions<T> {
  initialValues: T;
  rules?: FieldRules;
}

// Reglas de validación predefinidas
export const rules = {
  required: (message = 'Este campo es requerido'): ValidationRule => ({
    validator: (value: any) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    },
    message
  }),

  email: (message = 'Email inválido'): ValidationRule => ({
    validator: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message
  }),

  phone: (message = 'Teléfono inválido'): ValidationRule => ({
    validator: (value: string) => {
      const phoneRegex = /^[\d\s+()-]{7,15}$/;
      return phoneRegex.test(value);
    },
    message
  }),

  minLength: (length: number, message = `Mínimo ${length} caracteres`): ValidationRule => ({
    validator: (value: string) => value.length >= length,
    message
  }),

  maxLength: (length: number, message = `Máximo ${length} caracteres`): ValidationRule => ({
    validator: (value: string) => value.length <= length,
    message
  })
};

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const form = ref<T>({ ...options.initialValues });
  const errors = ref<FormErrors>({});
  const touched = ref<Set<string>>(new Set());

  const validateField = (field: keyof T) => {
    if (!options.rules?.[field as string]) return true;

    const fieldErrors: string[] = [];
    const value = form.value[field];

    options.rules[field as string].forEach(rule => {
      if (!rule.validator(value)) {
        fieldErrors.push(rule.message);
      }
    });

    errors.value[field as string] = fieldErrors;
    return fieldErrors.length === 0;
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(form.value).forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const touchField = (field: keyof T) => {
    touched.value.add(field as string);
    validateField(field);
  };

  const resetForm = () => {
    form.value = { ...options.initialValues };
    errors.value = {};
    touched.value = new Set();
  };

  const isValid = computed(() => {
    return Object.values(errors.value).every(fieldErrors => fieldErrors.length === 0);
  });

  const isDirty = computed(() => {
    return JSON.stringify(form.value) !== JSON.stringify(options.initialValues);
  });

  return {
    form,
    errors,
    touched,
    isValid,
    isDirty,
    validateField,
    validateForm,
    touchField,
    resetForm
  };
}
