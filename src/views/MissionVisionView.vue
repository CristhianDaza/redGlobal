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
    <div class="card mission" v-motion-fade-visible>
      <section>
        <h2>Misión</h2>
        <p>
          En <strong>RED GLOBAL PROMOCIONAL S.A.S.</strong> llevamos <strong>7 años</strong> transformando ideas en productos que conectan con las personas.
          Desde nuestro inicio, nos hemos especializado en ofrecer <strong>material promocional de alta calidad</strong>,
          diseñado para fortalecer la presencia de marca de nuestros clientes y generar un impacto memorable.
          Nuestro compromiso es brindar <strong>soluciones creativas, funcionales y personalizadas</strong>, adaptadas a las necesidades de cada empresa.
          Gracias a nuestro <strong>equipo apasionado</strong> y a una <strong>red confiable de aliados</strong>,
          hemos logrado posicionarnos como una opción sólida en el mundo de los promocionales.
          Más que productos, <em>entregamos experiencias que comunican, fidelizan y dejan huella</em>.
        </p>
      </section>
    </div>
    <div class="card vision" v-motion-fade-visible>
      <section>
        <h2>Visión</h2>
        <p>
          Ser reconocidos a nivel <strong>nacional e internacional</strong> como la empresa referente en <strong>soluciones promocionales</strong>,
          destacándonos por <strong>transformar ideas en experiencias de marca memorables</strong>.
          Nos proyectamos como <strong>aliados estratégicos</strong> del crecimiento de nuestros clientes, impulsando sus marcas con <strong>creatividad, innovación, cumplimiento</strong>
          y una excelencia basada en la <em>pasión por los detalles</em>.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.mission-vision-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 12px;
  background-color: var(--background-color);
  max-width: 800px;
  margin: 0 auto;
}

.card {
  padding: 16px 20px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card h2 {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin-bottom: 6px;
}

.card p {
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 600px) {
  .card {
    padding: 14px 16px;
  }

  .card h2 {
    font-size: 1.3rem;
  }

  .card p {
    font-size: 0.9rem;
  }
}
</style>
