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
      <span class="title-emphasis">Clientes</span>
      <span class="title-sub">que confían en nosotros</span>
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
          :key="img.id"
        >
          <img
            :src="img.imageUrl"
            :alt="img.title"
            class="logo"
            width="120"
            height="70"
          />
        </template>
        <template
          v-for="(img) in rowImages"
          :key="img.id"
        >
          <img
            :src="img.imageUrl"
            :alt="img.title"
            class="logo"
            width="120"
            height="70"
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

:deep(.logo) {
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

.clients-title {
  text-align: center;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  margin-top: 5rem;
  color: var(--text-color);
  font-weight: 700;
  line-height: 1.1;
  position: relative;
}
.clients-title::after {
  content: '';
  display: block;
  width: 140px;
  height: 5px;
  margin: 0.9rem auto 0;
  background: linear-gradient(90deg, var(--primary-color), #4da3ff);
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.clients-title .title-emphasis {
  display: block;
  background: linear-gradient(90deg, var(--primary-color), #4da3ff);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
}
.clients-title .title-sub {
  display: block;
  margin-top: .4rem;
  font-size: clamp(1rem, 1.1vw + .9rem, 1.55rem);
  font-weight: 400;
  color: var(--text-color) !important;
  letter-spacing: .5px;
  opacity: .9;
}
</style>
