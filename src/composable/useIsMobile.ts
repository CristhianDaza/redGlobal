import { onMounted, onUnmounted, ref } from 'vue';

export function useIsMobile() {
  const hasWindow = typeof window !== 'undefined';

  const isSize878 = ref(hasWindow ? window.innerWidth < 878 : false);
  const isSize610 = ref(hasWindow ? window.innerWidth < 610 : false);
  const isSize320 = ref(hasWindow ? window.innerWidth < 320 : false);
  const isSize483 = ref(hasWindow ? window.innerWidth < 483 : false);

  const _handleResize = () => {
    if (!hasWindow) return;
    const w = window.innerWidth;
    isSize878.value = w < 878;
    isSize610.value = w < 610;
    isSize320.value = w < 320;
    isSize483.value = w < 483;
  };

  onMounted(() => {
    if (hasWindow) {
      window.addEventListener('resize', _handleResize, { passive: true });
      _handleResize();
    }
  });

  onUnmounted(() => {
    if (hasWindow) {
      window.removeEventListener('resize', _handleResize);
    }
  });

  return {
    isSize610,
    isSize320,
    isSize878,
    isSize483,
  };
}
