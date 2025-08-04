<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { useHead } from '@vueuse/head';

useHead({
  title: 'Misión y Visión – Red Global Promocional',
  meta: [
    { name: 'description', content: 'Conoce nuestra misión y visión en Red Global Promocional.' },
    { property: 'og:title', content: 'Misión y Visión – Red Global Promocional' },
    { property: 'og:description', content: 'Conoce nuestra misión y visión en Red Global Promocional.' },
    { property: 'og:type', content: 'website' },
  ],
});

const missionText = ref<HTMLElement | null>(null);
const visionText = ref<HTMLElement | null>(null);
const showVision = ref(false);

const typeText = (element: HTMLElement, text: string, delay = 20, done?: () => void) => {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text[i];
      i++;
    } else {
      clearInterval(interval);
      if (done) done();
    }
  }, delay);
};

onMounted(() => {
  if (missionText.value) {
    typeText(
      missionText.value,
      `En RED GLOBAL PROMOCIONAL S.A.S. llevamos 7 años transformando ideas en productos que conectan con las personas. Desde nuestro inicio, nos hemos especializado en ofrecer material promocional de alta calidad, diseñado para fortalecer la presencia de marca de nuestros clientes y generar un impacto memorable. Nuestro compromiso es brindar soluciones creativas, funcionales y personalizadas, adaptadas a las necesidades de cada empresa. Gracias a nuestro equipo apasionado y a una red confiable de aliados, hemos logrado posicionarnos como una opción sólida en el mundo de los promocionales. Más que productos, entregamos experiencias que comunican, fidelizan y dejan huella.`,
      20,
      async () => {
        showVision.value = true;
        await nextTick();

        if (visionText.value) {
          typeText(
            visionText.value,
            `Ser reconocidos a nivel nacional e internacional como la empresa referente en soluciones promocionales, destacándonos por transformar ideas en experiencias de marca memorables. Nos proyectamos como aliados estratégicos del crecimiento de nuestros clientes, impulsando sus marcas con creatividad, innovación, cumplimiento y una excelencia basada en la pasión por los detalles.`
          );
        }
      }
    );
  }
});
</script>

<template>
  <div class="mission-vision-wrapper">
    <svg v-if="!showVision" class="header-illustration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" preserveAspectRatio="none">
      <path d="M0,0 C150,100 350,0 500,100 L500,0 L0,0 Z" style="fill: #d0ebff;"></path>
    </svg>

    <div class="card fancy-card">
      <h2 class="typewriter-title">Misión</h2>
      <p class="typewriter-text" ref="missionText"></p>
    </div>

    <transition name="fade">
      <div v-if="showVision" class="card fancy-card">
        <svg class="section-illustration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" preserveAspectRatio="none">
          <path d="M0,0 C200,100 300,0 500,100 L500,0 L0,0 Z" style="fill: #ffd6e0;"></path>
        </svg>
        <h2 class="typewriter-title" style="animation-delay: 1s">Visión</h2>
        <p class="typewriter-text" ref="visionText"></p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.mission-vision-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f3f7fa, #fff);
  border-radius: 18px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  position: relative;
}

.header-illustration,
.section-illustration {
  width: 100%;
  height: 80px;
  display: block;
  margin-bottom: -30px;
}

.fancy-card {
  background: white;
  border-radius: 16px;
  padding: 36px 28px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border-left: 8px solid var(--primary-color);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease forwards;
}

.typewriter-title {
  font-size: 2.2rem;
  color: var(--primary-color);
  margin-bottom: 20px;
  font-weight: 700;
  border-bottom: 2px solid var(--primary-color);
  display: inline-block;
  padding-bottom: 4px;
  animation: fadeInDown 0.6s ease-out;
}

.typewriter-text {
  font-size: 1.1rem;
  color: var(--text-color);
  line-height: 1.7;
  white-space: pre-line;
  min-height: 280px;
  border-left: 4px solid #eee;
  padding-left: 16px;
  font-family: 'Courier New', monospace;
}

.fade-enter-active {
  transition: opacity 1s ease;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .typewriter-title {
    font-size: 1.6rem;
  }
  .typewriter-text {
    font-size: 1rem;
    min-height: 200px;
  }
  .fancy-card {
    padding: 24px 18px;
  }
}
</style>
