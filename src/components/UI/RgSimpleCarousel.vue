<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick, type CSSProperties } from 'vue';
import type { CarouselItem } from '@/types/common.d';

interface Props {
  items: CarouselItem[];
  interval?: number;
  pauseOnHover?: boolean;
  height?: string;
  aspectRatio?: string;
  showIndicators?: boolean;
  showCaptions?: boolean;
  transitionMs?: number;
  imageFit?: 'cover' | 'contain';
  swipeThreshold?: number;
  showPlayPause?: boolean;
  loopSeamless?: boolean;
  autoAspect?: boolean;
  backgroundColor?: string;
  effect?: 'slide' | 'fade';
  navSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  interval: 4000,
  pauseOnHover: true,
  height: '600px',
  aspectRatio: '',
  showIndicators: true,
  showCaptions: false,
  transitionMs: 600,
  imageFit: 'contain',
  swipeThreshold: 40,
  showPlayPause: true,
  loopSeamless: true,
  autoAspect: true,
  backgroundColor: '#000',
  effect: 'slide',
  navSize: 54
});

const isFade = computed(() => props.effect === 'fade');

const slidePos = ref(0);
const currentIndex = ref(0);
let timer: number | undefined;
const isHovered = ref(false);
const isTransitioning = ref(false);
const isPlaying = ref(true);
const internalAspect = ref<string | null>(null);

const pointerStartX = ref(0);
const pointerStartY = ref(0);
const pointerDown = ref(false);
const pointerMoved = ref(false);

const total = computed(() => props.items.length);
const hasMultiple = computed(() => total.value > 1);
const useClones = computed(() => hasMultiple.value && props.loopSeamless && !isFade.value);

const displayItems = computed<CarouselItem[]>(() => {
  if (!useClones.value) return props.items;
  if (props.items.length === 0) return [];
  const first = props.items[0];
  const last = props.items[props.items.length - 1];
  return [last, ...props.items, first];
});

function initPositions() {
  if (isFade.value) {
    slidePos.value = 0;
    currentIndex.value = 0;
    return;
  }
  if (useClones.value) {
    slidePos.value = 1;
    currentIndex.value = 0;
  } else {
    slidePos.value = 0;
    currentIndex.value = 0;
  }
}

const carouselStyle = computed(() => {
  const style: Record<string, string> = {
    '--carousel-height': props.height,
    '--carousel-bg': props.backgroundColor,
    '--nav-size': props.navSize + 'px',
    '--fade-ms': props.transitionMs + 'ms',
    '--nav-icon-offset-y': '0px'
  };
  const ar = props.aspectRatio || internalAspect.value;
  if (ar) {
    style.aspectRatio = ar;
    style.height = 'auto';
  }
  return style;
});

const imageFitClass = computed(() => props.imageFit === 'contain' ? 'fit-contain' : 'fit-cover');

function clearTimer() {
  if (timer) { clearInterval(timer); timer = undefined; }
}

function startTimer() {
  clearTimer();
  if (!hasMultiple.value || !isPlaying.value) return;
  timer = window.setInterval(() => {
    if (props.pauseOnHover && isHovered.value) return;
    next();
  }, props.interval);
}

function next() {
  if (!hasMultiple.value || isTransitioning.value) return;
  if (isFade.value) {
    currentIndex.value = (currentIndex.value + 1) % total.value;
    return;
  }
  isTransitioning.value = true;
  slidePos.value += 1;
  updateLogicalIndex();
}

function prev() {
  if (!hasMultiple.value || isTransitioning.value) return;
  if (isFade.value) {
    currentIndex.value = (currentIndex.value - 1 + total.value) % total.value;
    return;
  }
  isTransitioning.value = true;
  slidePos.value -= 1;
  updateLogicalIndex();
}

function goTo(i: number) {
  if (i < 0 || i >= total.value) return;
  if (isTransitioning.value && !isFade.value) return;
  if (isFade.value) {
    currentIndex.value = i;
    return;
  }
  isTransitioning.value = true;
  if (useClones.value) {
    slidePos.value = i + 1;
  } else {
    slidePos.value = i;
  }
  currentIndex.value = i;
}

function updateLogicalIndex() {
  if (!useClones.value) {
    if (slidePos.value >= total.value) slidePos.value = 0;
    if (slidePos.value < 0) slidePos.value = total.value - 1;
    currentIndex.value = slidePos.value;
    return;
  }
  const lastRealIndex = total.value - 1;
  if (slidePos.value === displayItems.value.length - 1) {
    currentIndex.value = 0;
  } else if (slidePos.value === 0) {
    currentIndex.value = lastRealIndex;
  } else {
    currentIndex.value = slidePos.value - 1;
  }
}

function onTransitionEnd() {
  if (isFade.value) return; // no-op en fade
  if (!useClones.value) { isTransitioning.value = false; return; }
  const len = displayItems.value.length;
  if (slidePos.value === len - 1) {
    disableTransitionOnce();
    slidePos.value = 1;
  } else if (slidePos.value === 0) {
    disableTransitionOnce();
    slidePos.value = len - 2;
  }
  isTransitioning.value = false;
}

/* Transición instantánea (sin flicker) */
const trackEl = ref<HTMLElement | null>(null);
let restoreTransitionTimeout: number | undefined;

function disableTransitionOnce() {
  const el = trackEl.value;
  if (!el) return;
  const original = el.style.transition;
  el.style.transition = 'none';
  void el.offsetHeight;
  restoreTransitionTimeout && clearTimeout(restoreTransitionTimeout);
  restoreTransitionTimeout = window.setTimeout(() => {
    el.style.transition = original;
  }, 20);
}

function togglePlay() { isPlaying.value = !isPlaying.value; }
function onMouseEnter() { if (props.pauseOnHover) isHovered.value = true; }
function onMouseLeave() { if (props.pauseOnHover) isHovered.value = false; }

function onImageLoad(item: CarouselItem) {
  if (!props.autoAspect) return;
  if (internalAspect.value) return;
  const img = new Image();
  img.src = item.imageUrl;
  img.onload = () => {
    if (img.naturalWidth && img.naturalHeight) {
      internalAspect.value = `${img.naturalWidth}/${img.naturalHeight}`;
    }
  };
}

function onPointerDown(e: PointerEvent) {
  if (!hasMultiple.value) return;
  pointerDown.value = true;
  pointerMoved.value = false;
  pointerStartX.value = e.clientX;
  pointerStartY.value = e.clientY;
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { once: true });
}
function onPointerMove(e: PointerEvent) {
  if (!pointerDown.value) return;
  const dx = e.clientX - pointerStartX.value;
  const dy = e.clientY - pointerStartY.value;
  if (Math.abs(dx) > 5) pointerMoved.value = true;
  if (Math.abs(dy) > Math.abs(dx)) return;
}
function onPointerUp(e: PointerEvent) {
  window.removeEventListener('pointermove', onPointerMove);
  if (!pointerDown.value) return;
  pointerDown.value = false;
  const dx = e.clientX - pointerStartX.value;
  const absDx = Math.abs(dx);
  if (!pointerMoved.value || absDx < props.swipeThreshold) return;
  if (dx < 0) next(); else prev();
}

const trackStyle = computed<CSSProperties>(() => {
  if (isFade.value) {
    return { position: 'relative', width: '100%', height: '100%' } as CSSProperties;
  }
  const pct = slidePos.value * 100; // cada slide ocupa 100% viewport
  return {
    transform: `translateX(-${pct}%)`,
    transition: isTransitioning.value ? `transform ${props.transitionMs}ms ease` : 'transform 0ms linear'
  } as CSSProperties;
});

const showArrows = computed(() => hasMultiple.value);

watch(() => props.items, () => {
  initPositions();
  nextTick(() => startTimer());
});

watch(isPlaying, () => startTimer());
watch(useClones, () => initPositions());
watch(isFade, () => initPositions());

onMounted(() => {
  initPositions();
  startTimer();
});

onBeforeUnmount(() => {
  clearTimer();
  window.removeEventListener('pointermove', onPointerMove);
  restoreTransitionTimeout && clearTimeout(restoreTransitionTimeout);
});

function play() { if (!isPlaying.value) { isPlaying.value = true; startTimer(); } }
function pause() { if (isPlaying.value) { isPlaying.value = false; clearTimer(); } }

defineExpose({ next, prev, goTo, play, pause });

function fadeSlideClass(idx:number) {
  if (!isFade.value) return null;
  return {
    'rg-fade-slide': true,
    'is-active': idx === (currentIndex.value)
  };
}
</script>

<template>
  <div
    class="rg-simple-carousel"
    :style="carouselStyle"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    aria-roledescription="Carrusel"
  >
    <div class="rg-sc__viewport" ref="viewportEl">
      <div
        class="rg-sc__track"
        :style="trackStyle"
        ref="trackEl"
        @pointerdown="onPointerDown"
        @transitionend="onTransitionEnd"
      >
        <div
          v-for="(item, idx) in displayItems"
          :key="idx + '_' + (item.id || 'clone')"
          class="rg-sc__slide"
          :class="fadeSlideClass(idx)"
        >
          <router-link :to="item.toRoute" class="rg-sc__link" :aria-label="item.title">
            <img
              :src="item.imageUrl"
              :alt="item.title"
              class="rg-sc__image"
              :class="imageFitClass"
              draggable="false"
              @load="onImageLoad(item)" />
            <div class="rg-sc__caption" v-if="showCaptions && item.title">{{ item.title }}</div>
          </router-link>
        </div>
      </div>
    </div>

    <button
      v-if="showArrows"
      class="rg-sc__nav rg-sc__nav--prev"
      type="button"
      aria-label="Anterior"
      @click="prev"
    >
      <svg class="rg-sc__nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img">
        <polyline points="15 4 9 12 15 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button
      v-if="showArrows"
      class="rg-sc__nav rg-sc__nav--next"
      type="button"
      aria-label="Siguiente"
      @click="next"
    >
      <svg class="rg-sc__nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img">
        <polyline points="9 4 15 12 9 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <button
      v-if="showPlayPause && hasMultiple"
      class="rg-sc__play"
      type="button"
      :aria-label="isPlaying ? 'Pausar carrusel' : 'Reanudar carrusel'"
      @click="togglePlay"
    >
      <span v-if="isPlaying">❚❚</span>
      <span v-else>▶</span>
    </button>

    <div v-if="showIndicators && hasMultiple" class="rg-sc__dots">
      <button
        v-for="(item, i) in items"
        :key="item.id || i"
        class="rg-sc__dot"
        :class="{ 'is-active': i === currentIndex }"
        @click="goTo(i)"
        :aria-label="'Ir al slide ' + (i + 1)"
      />
    </div>

    <p class="rg-sc__sr" aria-live="polite">Slide {{ currentIndex + 1 }} de {{ total }}</p>
  </div>
</template>

<style scoped>
/* Eliminado :root; definimos variables por defecto en el contenedor para que el analizador las resuelva */
.rg-simple-carousel {
  --carousel-height: 600px;
  --carousel-bg: #000;
  --nav-size: 54px;
  --fade-ms: 600ms;
  position: relative;
  width: 100%;
  height: var(--carousel-height);
  overflow: hidden;
  background: var(--carousel-bg);
  border-radius: 6px;
  display: block;
}
.rg-sc__viewport { width: 100%; height: 100%; overflow: hidden; }
.rg-sc__track { display:flex; height:100%; will-change:transform; touch-action:pan-y; user-select:none; }
.rg-sc__slide { flex:0 0 100%; position: relative; height: 100%; display:flex; align-items:center; justify-content:center; }
.rg-sc__link { display:block; width:100%; height:100%; text-decoration:none; color:inherit; }
.rg-sc__image { width:100%; height:100%; display:block; }
.rg-sc__image.fit-cover { object-fit:cover; }
.rg-sc__image.fit-contain { object-fit:contain; background:#000; }
.rg-sc__caption { position:absolute; left:0; right:0; bottom:0; padding:.75rem 1rem; background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 100%); color:#fff; font-size:.95rem; line-height:1.2; }

/* NAV BUTTONS */
.rg-sc__nav { position:absolute; top:50%; transform:translateY(-50%); width: var(--nav-size); height: var(--nav-size); border:none; border-radius:50%; background:rgba(255,255,255,0.97); color:#ff4444; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 18px rgba(0,0,0,0.35); transition:background .25s, transform .25s, color .25s; z-index:10; }
.rg-sc__nav-icon { width: calc(var(--nav-size) * 0.52); height: calc(var(--nav-size) * 0.52); display:block; pointer-events:none; }

.rg-sc__nav:hover { background:#ff4444; color:#fff; transform:translateY(-50%) scale(1.08); }
.rg-sc__nav:active { transform:translateY(-50%) scale(.9); }
.rg-sc__nav--prev { left:18px; }
.rg-sc__nav--next { right:18px; }

/* Play/Pause */
.rg-sc__play { position:absolute; top:14px; right:14px; width:44px; height:44px; border:none; border-radius:10px; background:rgba(0,0,0,.55); color:#fff; font-size:1.1rem; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,.35); transition:background .25s, transform .25s; z-index:12; }
.rg-sc__play:hover { background:rgba(255,68,68,.9); }

/* Indicators */
.rg-sc__dots { position:absolute; left:50%; bottom:14px; transform:translateX(-50%); display:flex; gap:10px; z-index:11; }
.rg-sc__dot { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,0.9); background:rgba(255,255,255,0.3); cursor:pointer; padding:0; transition:background .3s, transform .3s, border-color .3s; }
.rg-sc__dot.is-active { background:#ff4444; border-color:#ff4444; transform:scale(1.3); }
.rg-sc__dot:hover { background:#ff4444; border-color:#ff4444; }

.rg-sc__sr { position:absolute; left:-9999px; top:auto; width:1px; height:1px; overflow:hidden; }

/* Fade effect */
.rg-fade-slide { position:absolute; inset:0; opacity:0; pointer-events:none; transition: opacity var(--fade-ms) ease; }
.rg-fade-slide.is-active { opacity:1; pointer-events:auto; }

/* Para fade el track debe permitir stacking */
.rg-simple-carousel :deep(.rg-sc__track) { position: relative; }

@media (max-width: 768px) {
  .rg-simple-carousel { height:auto; }
  .rg-sc__nav { width:50px; height:50px; }
  .rg-sc__nav-icon { width: calc(var(--nav-size) * 0.56); height: calc(var(--nav-size) * 0.56); }
}
</style>
