<script setup lang="ts">
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
</script>

<template>
  <div class="mission-vision-container">
    <!-- Professional SVG Background -->
    <svg class="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--primary-color);stop-opacity:0.05" />
          <stop offset="50%" style="stop-color:var(--primary-color);stop-opacity:0.02" />
          <stop offset="100%" style="stop-color:var(--primary-color);stop-opacity:0.08" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--primary-color)" stroke-width="0.5" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-gradient)"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <circle cx="200" cy="150" r="100" fill="var(--primary-color)" opacity="0.03"/>
      <circle cx="1000" cy="600" r="150" fill="var(--primary-color)" opacity="0.02"/>
      <path d="M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z" fill="var(--primary-color)" opacity="0.03"/>
    </svg>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="section-title">Misión</h2>
          <p class="section-text">
            En RED GLOBAL PROMOCIONAL S.A.S. llevamos 7 años transformando ideas en productos que conectan con las personas. Desde nuestro inicio, nos hemos especializado en ofrecer material promocional de alta calidad, diseñado para fortalecer la presencia de marca de nuestros clientes y generar un impacto memorable.
          </p>
          <p class="section-text">
            Nuestro compromiso es brindar soluciones creativas, funcionales y personalizadas, adaptadas a las necesidades de cada empresa. Gracias a nuestro equipo apasionado y a una red confiable de aliados, hemos logrado posicionarnos como una opción sólida en el mundo de los promocionales. Más que productos, entregamos experiencias que comunican, fidelizan y dejan huella.
          </p>
        </div>
        <div class="image-content">
          <div class="image-placeholder mission-image">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="placeholder-svg">
              <rect width="100%" height="100%" fill="var(--primary-color)" opacity="0.1"/>
              <circle cx="200" cy="150" r="80" fill="var(--primary-color)" opacity="0.2"/>
              <path d="M120,150 L200,100 L280,150 L200,200 Z" fill="var(--primary-color)" opacity="0.3"/>
              <text x="200" y="260" text-anchor="middle" fill="var(--primary-color)" font-size="16" font-weight="600">Misión</text>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="vision-section">
      <div class="content-wrapper reverse">
        <div class="text-content">
          <h2 class="section-title">Visión</h2>
          <p class="section-text">
            Ser reconocidos a nivel nacional e internacional como la empresa referente en soluciones promocionales, destacándonos por transformar ideas en experiencias de marca memorables.
          </p>
          <p class="section-text">
            Nos proyectamos como aliados estratégicos del crecimiento de nuestros clientes, impulsando sus marcas con creatividad, innovación, cumplimiento y una excelencia basada en la pasión por los detalles.
          </p>
        </div>
        <div class="image-content">
          <div class="image-placeholder vision-image">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="placeholder-svg">
              <rect width="100%" height="100%" fill="var(--primary-color)" opacity="0.1"/>
              <polygon points="200,50 350,150 200,250 50,150" fill="var(--primary-color)" opacity="0.2"/>
              <circle cx="200" cy="150" r="40" fill="var(--primary-color)" opacity="0.4"/>
              <path d="M180,140 L200,120 L220,140 L200,160 Z" fill="white"/>
              <text x="200" y="280" text-anchor="middle" fill="var(--primary-color)" font-size="16" font-weight="600">Visión</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.mission-vision-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.background-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.mission-section,
.vision-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  min-height: 400px;
}

.content-wrapper.reverse {
  direction: rtl;
}

.content-wrapper.reverse > * {
  direction: ltr;
}

.text-content {
  padding: 20px;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), transparent);
  border-radius: 2px;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-color);
  margin-bottom: 20px;
  text-align: justify;
  font-weight: 400;
}

.image-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.image-placeholder {
  width: 100%;
  max-width: 400px;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 2px solid rgba(0, 0, 0, 0.05);
}

.image-placeholder:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.15),
    0 12px 24px rgba(0, 0, 0, 0.08);
}

.placeholder-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.mission-image {
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb, 0, 123, 255), 0.05), rgba(var(--primary-color-rgb, 0, 123, 255), 0.1));
}

.vision-image {
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb, 0, 123, 255), 0.08), rgba(var(--primary-color-rgb, 0, 123, 255), 0.03));
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-wrapper,
  .content-wrapper.reverse {
    grid-template-columns: 1fr;
    gap: 40px;
    direction: ltr;
  }
  
  .mission-section,
  .vision-section {
    padding: 60px 20px;
  }
  
  .section-title {
    font-size: 2.2rem;
    text-align: center;
  }
  
  .section-text {
    font-size: 1rem;
    text-align: left;
  }
  
  .image-placeholder {
    max-width: 300px;
    height: 250px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .mission-section,
  .vision-section {
    padding: 40px 15px;
  }
  
  .content-wrapper {
    gap: 30px;
  }
}
</style>
