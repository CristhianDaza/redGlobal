<script setup lang="ts">
import { useProductsStore } from '../store/useProductsStore';
import RgHero from '../components/home/RgHero.vue';
import RgCategories from '../components/home/RgCategories.vue';
import RgVarietyBanner from '../components/home/RgVarietyBanner.vue';
import RgCard from '../components/UI/RgCard.vue';
import { onMounted, computed } from 'vue';

const store = useProductsStore();

onMounted(async () => {
  await store.getAllProducts();
});

const popularProducts = computed(() => {
  if (!store.products) return [];
  return store.products.slice(0, 10); // Mostrar los primeros 10 productos
});
</script>

<template>
  <main class="home">
    <RgHero
      title="Hacemos de tus regalos corporativos la mejor experiencia."
      subtitle="Para empresas"
      buttonText="Descubre más"
    />

    <RgCategories />

    <section class="popular-products">
      <h2 class="section-title">Productos Populares</h2>
      <div class="products-grid">
        <RgCard
          v-for="product in popularProducts"
          :key="product.id"
          :products-view="product"
        />
      </div>
    </section>

    <RgVarietyBanner
      title="de productos,"
      highlightWord="variedad"
      description="para que encuentres el que más se adapte a tu necesidad."
    />
  </main>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 3rem 0 2rem;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 2rem;
  padding: 1rem 0;
  justify-content: center;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
    margin: 2rem 0 1rem;
  }
}
</style>
