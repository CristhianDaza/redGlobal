<script setup lang="ts">
import TvButton from '@todovue/tvbutton';

interface ButtonProps {
  text?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  type?: 'default' | 'icon';
  onClick?: (event: MouseEvent) => void;
  customStyle?: Record<string, string>;
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  iconPosition: 'right',
  disabled: false
});

const defaultStyle = {
  backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
  color: '#fff',
};
</script>

<template>
  <div class="button-container">
    <TvButton
      @click="$emit('click', $event)"
      :custom-style="props.customStyle || defaultStyle"
      :type="props.type"
      :icon="props.icon"
      :disabled="props.disabled"
      :icon-position="props.iconPosition"
      rounded
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
</style>