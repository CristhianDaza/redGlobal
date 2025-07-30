<script setup lang="ts">
import type { OurClients } from '@/types/common.d'

const props = defineProps<{
  images: OurClients[]
}>()

const shuffle = (array: OurClients[]): OurClients[] => {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const generateRow = (): OurClients[] => {
  const row = shuffle(props.images)
  return [...row, ...row]
}

const handleMouse = (e: MouseEvent, state: 'add' | 'remove') => {
  const el = e.currentTarget as HTMLElement
  if (state === 'add') el.classList.add('paused')
  else el.classList.remove('paused')
}
</script>

<template>
  <h2>Nuestros <span>Clientes</span></h2>
  <div v-if="props.images.length" class="clients-wrapper">
    <div
      v-for="(_, index) in 3"
      :key="index"
      class="row"
      :class="{ reverse: index % 2 === 1 }"
    >
      <div
        class="tape"
        @mouseenter="(e) => handleMouse(e, 'add')"
        @mouseleave="(e) => handleMouse(e, 'remove')"
      >
        <img
          v-for="(img, idx) in generateRow()"
          :key="index + '-' + idx + '-' + img.id"
          :src="img.imageUrl"
          class="logo"
          :alt="img.title"
          :title="img.title"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  font-size: 2.3rem;
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
  margin-top: 2rem;
}

.row {
  display: flex;
  overflow: hidden;
  margin: 1rem 0;
  position: relative;
}

.tape {
  display: flex;
  animation: scroll 10s linear infinite;
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
