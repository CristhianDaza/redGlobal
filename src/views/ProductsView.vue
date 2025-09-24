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

const totalSubcategories = categories.reduce((total, cat) => total + cat.subcategories.length, 0);

const popularCategories = [
  {
    name: "Tecnología",
    icon: "devices",
    description: "USB, audífonos, accesorios tech y más",
    count: categories.find(c => c.category === "Tecnología")?.subcategories.length || 0
  },
  {
    name: "Maletines y Morrales",
    icon: "work",
    description: "Maletines, morrales y accesorios de viaje",
    count: categories.find(c => c.category === "Maletines y Morrales")?.subcategories.length || 0
  },
  {
    name: "Mugs y Vasos",
    icon: "local_cafe",
    description: "Mugs personalizados, vasos y accesorios",
    count: categories.find(c => c.category === "Mugs y Vasos")?.subcategories.length || 0
  },
  {
    name: "Bolígrafos",
    icon: "edit",
    description: "Bolígrafos metálicos, plásticos y ecológicos",
    count: categories.find(c => c.category === "Bolígrafos")?.subcategories.length || 0
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
    <!-- Categories Section -->
    <div class="categories-section">
      <div class="section-header">
        <h2>
          <span class="material-icons">category</span>
          Explora por Categorías
        </h2>
        <p class="section-description">
          Encuentra exactamente lo que necesitas navegando por nuestras categorías especializadas.
        </p>
      </div>

      <div class="categories-grid">
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

    <!-- Popular Categories -->
    <div class="popular-section">
      <div class="section-header">
        <h2>
          <span class="material-icons">trending_up</span>
          Categorías Populares
        </h2>
        <p class="section-description">
          Las categorías más solicitadas por nuestros clientes.
        </p>
      </div>

      <div class="popular-grid">
        <div 
          v-for="popular in popularCategories" 
          :key="popular.name"
          class="popular-card"
          @click="handleCategorySelect(popular.name)"
        >
          <div class="popular-icon">
            <span class="material-icons">{{ popular.icon }}</span>
          </div>
          <div class="popular-content">
            <h3>{{ popular.name }}</h3>
            <p>{{ popular.description }}</p>
            <span class="popular-count">{{ popular.count }} subcategorías</span>
          </div>
          <div class="popular-arrow">
            <span class="material-icons">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-view {
  background: #f8fafc;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, #4299e1 100%);
  color: white;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.hero-icon {
  font-size: 3.5rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  opacity: 0.95;
  margin: 0;
}

.hero-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Categories Section */
.categories-section {
  padding: 0 2rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.section-header .material-icons {
  color: var(--primary-color);
  font-size: 2.5rem;
}

.section-description {
  color: #718096;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

/* Popular Section */
.popular-section {
  padding: 3rem 2rem;
  background: white;
  margin-top: 3rem;
}

.popular-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.popular-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popular-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.popular-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.popular-content {
  flex: 1;
}

.popular-content h3 {
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.popular-content p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.popular-count {
  color: var(--primary-color);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.popular-arrow {
  color: var(--primary-color);
  opacity: 0.7;
  transition: all 0.3s ease;
}

.popular-card:hover .popular-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .hero-icon {
    font-size: 3rem;
  }
  
  .categories-section {
    padding: 0 1rem 2rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .popular-section {
    padding: 2rem 1rem;
  }
  
  .popular-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .hero-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.75rem;
  }
}
</style>
