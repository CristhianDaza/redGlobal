import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useIntersectionObserver(
  target: Ref<Element | null>,
  callback: (entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {}
) {
  const isIntersecting = ref(false);
  const isSupported = typeof window !== 'undefined' && 'IntersectionObserver' in window;
  
  let observer: IntersectionObserver | null = null;

  const defaultOptions = {
    root: options.root || null,
    rootMargin: options.rootMargin || '50px',
    threshold: options.threshold || 0.1
  };

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  const observe = () => {
    if (!isSupported || !target.value) return;

    cleanup();

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isIntersecting.value = entry.isIntersecting;
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, defaultOptions);

    observer.observe(target.value);
  };

  onMounted(() => {
    if (target.value) {
      observe();
    }
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    isIntersecting,
    isSupported,
    observe,
    cleanup
  };
}
