<template>
  <div 
    ref="imageContainer" 
    class="lazy-image-container"
    :class="{ 'loading': isLoading, 'loaded': isLoaded, 'error': hasError }"
  >
    <img
      v-if="shouldLoad"
      :src="optimizedSrc"
      :alt="alt"
      :class="imageClass"
      @load="handleLoad"
      @error="handleError"
      :loading="nativeLoading ? 'lazy' : 'eager'"
    />
    
    <div v-if="isLoading" class="image-placeholder">
      <div class="placeholder-shimmer"></div>
      <span v-if="showLoadingText" class="loading-text">{{ loadingText }}</span>
    </div>
    
    <div v-if="hasError" class="image-error">
      <span class="material-icons">broken_image</span>
      <span v-if="showErrorText">{{ errorText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useIntersectionObserver } from '@/composable/useIntersectionObserver';
import { getOptimizedImageUrl, getTransformedImageUrl } from '@/config/cloudinary';
import { logger } from '@/services';

interface Props {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  quality?: 'auto' | 'low' | 'medium' | 'high';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  eager?: boolean;
  nativeLoading?: boolean;
  showLoadingText?: boolean;
  showErrorText?: boolean;
  loadingText?: string;
  errorText?: string;
  imageClass?: string;
  rootMargin?: string;
  threshold?: number;
  fallbackSrc?: string;
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: undefined,
  height: undefined,
  quality: 'auto',
  format: 'auto',
  eager: false,
  nativeLoading: false,
  showLoadingText: false,
  showErrorText: true,
  loadingText: 'Cargando...',
  errorText: 'Error al cargar imagen',
  imageClass: '',
  rootMargin: '50px',
  threshold: 0.1,
  fallbackSrc: '/src/assets/images/no-image.jpg'
});

const imageContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const isLoaded = ref(false);
const hasError = ref(false);
const shouldLoad = ref(props.eager);

const isCloudinaryUrl = computed(() => {
  return props.src.includes('cloudinary.com') || props.src.includes('res.cloudinary.com');
});

const optimizedSrc = computed(() => {
  if (!props.src || hasError.value) {
    return props.fallbackSrc;
  }

  if (isCloudinaryUrl.value) {
    try {
      const publicIdMatch = props.src.match(/\/v\d+\/(.+?)(?:\.|$)/);
      if (publicIdMatch && publicIdMatch[1]) {
        const publicId = publicIdMatch[1];
        
        if (props.width && props.height) {
          return getTransformedImageUrl(publicId, props.width, props.height);
        } else {
          return getOptimizedImageUrl(publicId);
        }
      }
    } catch (error) {
      logger.warn('Error optimizing Cloudinary image', 'RgLazyImage', { src: props.src, error });
    }
  }

  return props.src;
});

const handleIntersection = () => {
  if (!shouldLoad.value) {
    shouldLoad.value = true;
    isLoading.value = true;
    logger.debug('Image entered viewport, starting load', 'RgLazyImage', { src: props.src });
  }
};

const handleLoad = () => {
  isLoading.value = false;
  isLoaded.value = true;
  hasError.value = false;
  logger.debug('Image loaded successfully', 'RgLazyImage', { src: optimizedSrc.value });
};

const handleError = () => {
  isLoading.value = false;
  isLoaded.value = false;
  hasError.value = true;
  logger.warn('Image failed to load', 'RgLazyImage', { src: optimizedSrc.value });
  
  if (props.fallbackSrc && optimizedSrc.value !== props.fallbackSrc) {
    // El computed optimizedSrc manejará el fallback automáticamente
  }
};

useIntersectionObserver(
  imageContainer,
  handleIntersection,
  {
    rootMargin: props.rootMargin,
    threshold: props.threshold
  }
);

watch(() => props.eager, (newEager) => {
  if (newEager && !shouldLoad.value) {
    shouldLoad.value = true;
    isLoading.value = true;
  }
});

onMounted(() => {
  if (props.eager) {
    shouldLoad.value = true;
    isLoading.value = true;
  }
});
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.lazy-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.lazy-image-container.loading img {
  opacity: 0;
}

.lazy-image-container.loaded img {
  opacity: 1;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.placeholder-shimmer {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.loading-text {
  position: absolute;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  color: #6b7280;
  font-size: 0.875rem;
}

.image-error .material-icons {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #d1d5db;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .loading-text,
  .image-error {
    font-size: 0.75rem;
  }
  
  .image-error .material-icons {
    font-size: 1.5rem;
  }
}
</style>
