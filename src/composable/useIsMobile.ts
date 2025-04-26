import {onMounted, onUnmounted, ref} from "vue";

export function useIsMobile() {
  const isSize878 = ref(window.innerWidth < 878);
  const isSize610 = ref(window.innerWidth < 610);
  const isSize320 = ref(window.innerWidth < 320);

  const _handleResize = () => {
    isSize878.value = window.innerWidth < 878;
    isSize610.value = window.innerWidth < 610;
    isSize320.value = window.innerWidth < 320;

      console.log(`isSize320: ${isSize320.value}`);
  };

  onMounted(() => {
    window.addEventListener('resize', _handleResize);
    _handleResize();
  });
  onUnmounted(() => {
    window.removeEventListener('resize', _handleResize);
  });

  return {
    isSize610,
    isSize320,
    isSize878,
  }
}
