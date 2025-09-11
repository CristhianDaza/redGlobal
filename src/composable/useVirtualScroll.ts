import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue';

export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScroll<T>(
  items: Ref<T[]>,
  options: VirtualScrollOptions
) {
  const scrollTop = ref(0);
  const containerRef = ref<HTMLElement | null>(null);
  
  const { itemHeight, containerHeight, overscan = 5 } = options;
  
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  
  const startIndex = computed(() => {
    const index = Math.floor(scrollTop.value / itemHeight);
    return Math.max(0, index - overscan);
  });
  
  const endIndex = computed(() => {
    const index = startIndex.value + visibleCount + overscan * 2;
    return Math.min(items.value.length - 1, index);
  });
  
  const visibleItems = computed(() => {
    return items.value.slice(startIndex.value, endIndex.value + 1);
  });
  
  const totalHeight = computed(() => {
    return items.value.length * itemHeight;
  });
  
  const offsetY = computed(() => {
    return startIndex.value * itemHeight;
  });
  
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
  };
  
  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', handleScroll, { passive: true });
    }
  });
  
  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll);
    }
  });
  
  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex
  };
}
