<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useProductsStore } from '../store/useProductsStore';
import RgHero from '../components/home/RgHero.vue';
import RgCategories from '../components/home/RgCategories.vue';
import RgVarietyBanner from '../components/home/RgVarietyBanner.vue';
import RgCard from '../components/UI/RgCard.vue';

const store = useProductsStore();
const router = useRouter();

onMounted(async () => {
  await store.getAllProducts();
});

const popularProducts = computed(() => {
  if (!store.products) return [];
  return store.products.slice(0, 10); // Mostrar los primeros 10 productos
});

const handleClickButton = () => {
  router.push({ name: 'products' });
}
</script>

<template>
  <main class="home">
    <RgHero
      title="Hacemos de tus regalos corporativos la mejor experiencia."
      subtitle="Personaliza"
      subtitle2=" tus productos."
      buttonText="Productos"
      @click="handleClickButton"
      background-image="https://firebasestorage.googleapis.com/v0/b/mega2024-6a453.appspot.com/o/cat-07.png?alt=media&token=67742bed-a013-46d9-b5ec-7abc9c617068"
      description="Lore ipsum dolor sit amet consectetur adipisicing elit. Dolorum, quod."
    />

    <div class="container">
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
    </div>
    <RgVarietyBanner
      titleInit="Tenemos"
      titleEnd="de productos, para que encuentres el que más se adapte a tu necesidad."
      highlightWord="variedad"
    />
  </main>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.home {
  margin: 0;
  padding: 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 3rem 0 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 2rem;
  padding: 1rem 0;
  justify-content: center;
}

.container {
  width: 90%;
  margin: 0 auto;
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
