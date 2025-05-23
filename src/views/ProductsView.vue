<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '@/store';
const CategoryList = defineAsyncComponent(/* webpackChunkName: "categoryList" */() => import('@/components/categories/CategoryList.vue'));

const router = useRouter();
const productsStore = useProductsStore();

const categories = [
  {
    category: "Bolígrafos",
    subcategories: [
      "Bolígrafos Metálicos",
      "Bolígrafos Plásticos",
      "Bolígrafos Ecológicos",
      "Bolígrafos en Aluminio",
      "Bolígrafos con Resaltador",
      "Memorias - Bolígrafos"
    ]
  },
  {
    category: "Mugs y Vasos",
    subcategories: [
      "Mug - Producción Nacional",
      "Mug Sublimación",
      "Mug Metálicos",
      "Mugs y Vasos Metálicos",
      "Mug Cerámica",
      "Mug Plásticos",
      "Vasos Plásticos y Ecológicos",
      "Vasos y Copas"
    ]
  },
  {
    category: "Paraguas",
    subcategories: [
      "Paraguas - Mini 21 Pulgadas",
      "Paraguas",
      "Paraguas Mini",
      "Paraguas Fashion",
      "Paraguas Golf",
      "Paraguas - Normales 23 a 30 Pulgadas"
    ]
  },
  {
    category: "Llaveros",
    subcategories: [
      "Llaveros - Metálicos",
      "Llaveros",
      "Llaveros con Linterna",
      "Llaveros Metálicos",
      "Master Line - Llaveros",
      "Llaveros - Plásticos",
      "Llaveros - Especiales",
      "Llaveros - Producción Nacional",
      "Llaveros - Pito"
    ]
  },
  {
    category: "Maletines y Morrales",
    subcategories: [
      "Maletines - Producción Nacional",
      "Maletines - Neveras",
      "Maletines - Algodón",
      "Maletines - Cambrel",
      "Maletines - Yute",
      "Maletines - Poliester",
      "Saldos - Maletines y Bolsos",
      "Carpetas, Maletas y Morrales",
      "Morrales",
      "Maletines - Trolley",
      "Maletas y Estuches de Viaje",
      "Maletines Deportivos",
      "Tula, Morral",
      "Maletines - Morral",
      "Maletines - Organizadores de Viajes",
      "Maletines",
      "Maletines - Portapasaporte"
    ]
  },
  {
    category: "Libretas",
    subcategories: [
      "Libretas Ecológicas",
      "Libretas",
      "Libretas Plásticas"
    ]
  },
  {
    category: "Tecnología",
    subcategories: [
      "Tecnología",
      "Saldos - Tecnología",
      "Tecnología - Recreación y Aventura",
      "Tecnología - Audífonos",
      "Memorias - Plásticas",
      "Usb",
      "Memorias - Metálicas",
      "Tecnología - USB memorias",
      "Tecnología - Producción Nacional"
    ]
  },
  {
    category: "Hogar",
    subcategories: [
      "Hogar",
      "Hogar -Bar",
      "Artículos Hogar",
      "Hogar - Producción Nacional",
      "Accesorios de Hogar"
    ]
  },
  {
    category: "Oficina",
    subcategories: [
      "Accesorios de Escritorio",
      "Oficina - Producción Nacional",
      "Oficina y Negocios",
      "Oficina - Portadocumentos y Portafolios",
      "Oficina - Ecológicos",
      "Artículos Escritorio",
      "Identificadores - Oficina",
      "Oficina - Tarjeteros",
      "Relojes - Mesa y Escritorio"
    ]
  },
  {
    category: "Deportes",
    subcategories: [
      "Fútbol",
      "Deportes"
    ]
  },
  {
    category: "Ecológicos",
    subcategories: [
      "EcoNature",
      "Ecología",
      "Ecológicos",
      "Marca Ecopromo"
    ]
  },
  {
    category: "Salud y Cuidado",
    subcategories: [
      "Artículos Cuidado Personal - COVID-19",
      "Salud y Cuidado Personal",
      "Cuidado Personal",
      "Especializados en Salud",
      "Limas y Manicure"
    ]
  },
  {
    category: "Accesorios y Varios",
    subcategories: [
      "Artículos Escritura Plásticos",
      "Accesorios de Mascota",
      "Artículos Escritura Metálicos",
      "Accesorios para Móviles",
      "Artículos Smartphone Tablet y Computador",
      "Accesorios de Mercado",
      "Accesorios de Viaje",
      "Accesorios de Cocina",
      "Artículos Escritura",
      "Golf - Accesorios",
      "Artículos Reflectivos y de Precaución",
      "Accesorios de Computador"
    ]
  }
];

const handleSubCategorySelect = (subCategory: string) => {
  router.push({
    name: 'search',
    query: { category: subCategory }
  });
};

const handleCategorySelect = (category: string) => {
  router.push({
    name: 'search',
    query: { category }
  });
};

useHead({
  title: 'Productos – Red Global Promocional',
  meta: [
    { name: 'description', content: 'Explora todos nuestros productos promocionales y regalos corporativos. Encuentra la mejor opción para tu empresa.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Productos – Red Global Promocional' },
    { property: 'og:description', content: 'Explora todos nuestros productos promocionales y regalos corporativos. Encuentra la mejor opción para tu empresa.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:url', content: 'https://redglobalpromocionales.com/products' }
  ],
  link: [
    { rel: 'canonical', href: 'https://redglobalpromocionales.com/products' }
  ]
});

onMounted(async () => {
  if (!productsStore.products || productsStore.products.length === 0) {
    await productsStore.getAllProducts();
  }
});
</script>

<template>
  <div class="products-view">
    <div class="categories-list">
      <CategoryList
        v-for="cat in categories"
        :key="cat.category"
        :category="cat.category"
        :subcategories="cat.subcategories"
        @select="handleSubCategorySelect"
        @select-category="handleCategorySelect"
      />
    </div>
  </div>
</template>

<style scoped>
.products-view {
  padding: 2rem;
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .products-view {
    padding: 1rem;
  }

  .categories-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
