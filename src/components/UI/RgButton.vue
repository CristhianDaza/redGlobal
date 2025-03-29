<script setup lang="ts">
import TvButton from '@todovue/tvbutton';

defineProps<{
  text: string;
  icon?: string;
  onClick?: (event: MouseEvent) => void;
  customStyle?: Record<string, string>;
}>();

const defaultStyle = {
  backgroundColor: '#ff4444',
  color: '#fff',
};
</script>

<template>
  <div class="button-container">
    <TvButton
      @click="$emit('click', $event)"
      :custom-style="customStyle || defaultStyle"
      rounded
    >
      {{ text }}
    </TvButton>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  align-items: flex-start;
}
</style>