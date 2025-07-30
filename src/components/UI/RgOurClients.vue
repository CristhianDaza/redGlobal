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
  const clones = 5
  const result: OurClients[] = []
  for (let i = 0; i < clones; i++) {
    result.push(...shuffle(props.images))
  }
  return result
}
</script>

<template>
  <div class="clients-wrapper">
    <div
      v-for="(_, index) in 3"
      :key="index"
      class="row"
      :class="{ reverse: index % 2 === 1 }"
    >
      <div class="tape">
        <img
          v-for="(img, idx) in generateRow()"
          :key="idx + '-' + img.id"
          :src="img.imageUrl"
          class="logo"
          :alt="img.title"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.clients-wrapper {
  background: var(--background-color);
  padding: 2rem 0;
  overflow: hidden;
}

.row {
  display: flex;
  overflow: hidden;
  margin: 1rem 0;
  position: relative;
}

.tape {
  display: flex;
  animation: scroll 40s linear infinite;
}

.row.reverse .tape {
  animation-direction: reverse;
}

.logo {
  height: 60px;
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
