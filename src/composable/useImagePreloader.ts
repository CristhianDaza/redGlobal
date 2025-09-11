import { ref } from 'vue';
import { logger } from '@/services';

export interface PreloadOptions {
  priority?: 'high' | 'low';
  crossOrigin?: 'anonymous' | 'use-credentials';
  timeout?: number;
}

export function useImagePreloader() {
  const loadedImages = ref(new Set<string>());
  const failedImages = ref(new Set<string>());
  const loadingImages = ref(new Set<string>());
  
  const preloadImage = (src: string, options: PreloadOptions = {}): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.value.has(src)) {
        resolve();
        return;
      }
      
      if (failedImages.value.has(src)) {
        reject(new Error(`Image previously failed to load: ${src}`));
        return;
      }
      
      if (loadingImages.value.has(src)) {
        // Ya se está cargando, esperar a que termine
        const checkLoading = () => {
          if (loadedImages.value.has(src)) {
            resolve();
          } else if (failedImages.value.has(src)) {
            reject(new Error(`Image failed to load: ${src}`));
          } else if (loadingImages.value.has(src)) {
            setTimeout(checkLoading, 50);
          }
        };
        checkLoading();
        return;
      }
      
      loadingImages.value.add(src);
      
      const img = new Image();
      const { priority = 'low', crossOrigin, timeout = 10000 } = options;
      
      // Configurar prioridad si es soportada
      if ('fetchPriority' in img) {
        (img as any).fetchPriority = priority;
      }
      
      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }
      
      let timeoutId: number | null = null;
      
      const cleanup = () => {
        loadingImages.value.delete(src);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
      
      img.onload = () => {
        cleanup();
        loadedImages.value.add(src);
        logger.debug(`Image preloaded successfully: ${src}`, 'ImagePreloader');
        resolve();
      };
      
      img.onerror = () => {
        cleanup();
        failedImages.value.add(src);
        logger.warn(`Image failed to preload: ${src}`, 'ImagePreloader');
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      // Timeout para evitar cargas infinitas
      timeoutId = window.setTimeout(() => {
        cleanup();
        failedImages.value.add(src);
        logger.warn(`Image preload timeout: ${src}`, 'ImagePreloader');
        reject(new Error(`Image load timeout: ${src}`));
      }, timeout);
      
      img.src = src;
    });
  };
  
  const preloadImages = async (
    urls: string[], 
    options: PreloadOptions = {},
    concurrent: number = 3
  ): Promise<void> => {
    const chunks: string[][] = [];
    for (let i = 0; i < urls.length; i += concurrent) {
      chunks.push(urls.slice(i, i + concurrent));
    }
    
    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map(url => preloadImage(url, options))
      );
    }
  };
  
  const isImageLoaded = (src: string): boolean => {
    return loadedImages.value.has(src);
  };
  
  const isImageFailed = (src: string): boolean => {
    return failedImages.value.has(src);
  };
  
  const isImageLoading = (src: string): boolean => {
    return loadingImages.value.has(src);
  };
  
  const clearCache = (): void => {
    loadedImages.value.clear();
    failedImages.value.clear();
    loadingImages.value.clear();
  };
  
  const getStats = () => {
    return {
      loaded: loadedImages.value.size,
      failed: failedImages.value.size,
      loading: loadingImages.value.size
    };
  };
  
  return {
    preloadImage,
    preloadImages,
    isImageLoaded,
    isImageFailed,
    isImageLoading,
    clearCache,
    getStats
  };
}
