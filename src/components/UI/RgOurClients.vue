<script setup lang="ts">
import type { OurClients } from '@/types/common.d'
import { computed } from 'vue'

const props = defineProps<{
  images: OurClients[]
}>()

const repeatUntilMin = (logos: OurClients[], minTotal: number): OurClients[] => {
  const result: OurClients[] = []
  while (result.length < minTotal) {
    result.push(...logos)
  }
  return result
}

const rows = computed(() => {
  const chunkSize = Math.ceil(props.images.length / 3)
  return [0, 1, 2].map(i => {
    const slice = props.images.slice(i * chunkSize, (i + 1) * chunkSize)
    const duplicated = repeatUntilMin(slice, 20) // duplicar hasta al menos 20 logos
    return [...duplicated]
  })
})


const handleMouse = (e: MouseEvent, state: 'add' | 'remove') => {
  const el = e.currentTarget as HTMLElement
  if (state === 'add') el.classList.add('paused')
  else el.classList.remove('paused')
}
</script>

<template>
  <div v-if="props?.images?.length >= 3" class="clients-wrapper">
    <h2 class="clients-title">
      Nuestros <span>Clientes</span>
    </h2>
    <div
      v-for="(rowImages, index) in rows"
      :key="index"
      class="row"
      :class="{ reverse: index % 2 === 1 }"
    >
      <div
        class="tape"
        @mouseenter="(e) => handleMouse(e, 'add')"
        @mouseleave="(e) => handleMouse(e, 'remove')"
      >
        <template
          v-for="(img) in rowImages"
          :key="'main-' + index + '-' + idx + '-' + img.id"
        >
          <img
            :src="img.imageUrl"
            class="logo"
            :alt="img.title"
            :title="img.title"
          />
        </template>
        <template
          v-for="(img) in rowImages"
          :key="'clone-' + index + '-' + idx + '-' + img.id"
        >
          <img
            :src="img.imageUrl"
            class="logo"
            :alt="img.title"
            :title="img.title"
          />
        </template>

      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  font-size: 3.5rem;
  margin-top: 5rem;
  color: var(--text-color);
}

span {
  color: var(--primary-color);
}

.clients-wrapper {
  background: var(--background-color);
  padding: 2rem 0;
  overflow: hidden;
  margin-top: 1rem;
}

.row {
  display: flex;
  overflow: hidden;
  margin: 1rem 0;
  position: relative;
}

.tape {
  display: flex;
  animation: scroll 50s linear infinite;
  min-width: 200%;
}


.tape.paused {
  animation-play-state: paused;
}

.row.reverse .tape {
  animation-direction: reverse;
}

.logo {
  height: 70px;
  margin: 0 1.5rem;
  flex-shrink: 0;
  object-fit: contain;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
