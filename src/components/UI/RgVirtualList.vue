<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <div
      class="virtual-list-spacer"
      :style="{ height: totalHeight + 'px' }"
    >
      <div
        class="virtual-list-content"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <slot
          name="item"
          v-for="(item, index) in visibleItems"
          :key="getItemKey(item, startIndex + index)"
          :item="item"
          :index="startIndex + index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { useVirtualScroll } from '@/composable/useVirtualScroll';
import { toRefs } from 'vue';

interface Props {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  keyField?: keyof T;
}

const props = withDefaults(defineProps<Props>(), {
  overscan: 5,
  keyField: 'id' as keyof T
});

const { items } = toRefs(props);

const {
  containerRef,
  visibleItems,
  totalHeight,
  offsetY,
  startIndex
} = useVirtualScroll(items, {
  itemHeight: props.itemHeight,
  containerHeight: props.containerHeight,
  overscan: props.overscan
});

const getItemKey = (item: T, index: number): string | number => {
  if (props.keyField && item && typeof item === 'object') {
    const key = item[props.keyField];
    return key !== undefined ? String(key) : index;
  }
  return index;
};

const handleScroll = (event: Event) => {
  // El scroll es manejado por el composable useVirtualScroll
  console.log('Scroll event:', event);
};
</script>

<style scoped>
.virtual-list-container {
  overflow-y: auto;
  position: relative;
}

.virtual-list-spacer {
  position: relative;
  width: 100%;
}

.virtual-list-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>
