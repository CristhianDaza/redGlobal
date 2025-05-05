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
      :outlined="props.outlined"
      :is-full="props.full"
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
