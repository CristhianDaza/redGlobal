<script setup lang="ts">
import type { ButtonProps } from '@/types/common.d'
import TvButton from '@todovue/tv-button';

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  iconPosition: 'right',
  disabled: false,
  outlined: false,
  full: false,
});

const emit = defineEmits<{
  (e: 'click', ev?: MouseEvent): void
}>();

const defaultStyle = {
  backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
  color: '#fff',
};

const onWrapperClick = (e: MouseEvent) => {
  // Asegura que no se propague al padre (por ejemplo, la tarjeta que abre el catálogo)
  if (e && typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  }
  if (props.disabled) return;
  emit('click', e);
};
</script>

<template>
  <div class="button-container" @click="onWrapperClick">
    <TvButton
      :custom-style="props.customStyle || defaultStyle"
      :type="props.type"
      :icon="props.icon"
      :disabled="props.disabled"
      :icon-position="props.iconPosition"
      rounded
      :outlined="props.outlined"
      :is-full="props.full"
      class="modern-button"
    >
      <slot>{{ props.text }}</slot>
    </TvButton>
  </div>
</template>

<style scoped>
.button-container {
  display: inline-flex;
  align-items: center;
}

.button-container :deep(.modern-button) {
  position: relative;
  overflow: hidden;
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 14px 0 rgba(0, 0, 0, 0.1),
    0 2px 4px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.button-container :deep(.modern-button::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.button-container :deep(.modern-button:hover) {
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px 0 rgba(0, 0, 0, 0.15),
    0 4px 10px 0 rgba(0, 0, 0, 0.1);
}

.button-container :deep(.modern-button:hover::before) {
  left: 100%;
}

.button-container :deep(.modern-button:active) {
  transform: translateY(-1px);
  box-shadow:
    0 6px 20px 0 rgba(0, 0, 0, 0.12),
    0 3px 8px 0 rgba(0, 0, 0, 0.08);
}

.button-container :deep(.modern-button:disabled) {
  transform: none;
  box-shadow:
    0 2px 8px 0 rgba(0, 0, 0, 0.06),
    0 1px 2px 0 rgba(0, 0, 0, 0.04);
  opacity: 0.6;
  cursor: not-allowed;
}

.button-container :deep(.modern-button:disabled::before) {
  display: none;
}

/* Outlined button variant */
.button-container :deep(.modern-button.tv-btn-outlined) {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.button-container :deep(.modern-button.tv-btn-outlined:hover) {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Icon styling */
.button-container :deep(.modern-button .tv-icon) {
  transition: transform 0.3s ease;
}

.button-container :deep(.modern-button:hover .tv-icon) {
  transform: scale(1.1);
}
</style>
