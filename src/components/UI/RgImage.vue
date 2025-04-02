<script setup lang="ts">
import { ref, onMounted } from 'vue'
import noImage from '../../assets/images/no-image.jpg'

const props = defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const imageSource = ref(props.src)

const handleError = () => {
  hasError.value = true
  imageSource.value = noImage
}

const handleLoad = () => {
  isLoading.value = false
}

onMounted(() => {
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    if (imgRef.value) {
      imgRef.value.loading = 'lazy'
    }
  } else {
    // Fallback to Intersection Observer for older browsers
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && imgRef.value) {
          imgRef.value.src = props.src
          observer.unobserve(entry.target)
        }
      })
    })

    if (imgRef.value) {
      observer.observe(imgRef.value)
    }
  }
})
</script>

<template>
  <div class="image-container" :class="{ 'is-loading': isLoading }">
    <img
      ref="imgRef"
      :src="imageSource"
      :alt="alt || ''"
      :width="width"
      :height="height"
      @error="handleError"
      @load="handleLoad"
    />
    <div v-if="isLoading" class="loading-placeholder" />
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;
  border-radius: 6px;
}

.image-container img {
  display: block;
  width: 100%;
  max-height: 350px;
  object-fit: contain;
  transition: opacity 0.3s ease-in-out;
  background-color: #fff;
}

.image-container.is-loading img {
  opacity: 0;
}

.loading-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
