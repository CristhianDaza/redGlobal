<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  category: string;
  subcategories: string[];
  image?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['select']);

const isHovered = ref(false);

const getDefaultImage = (category: string) => {
  const images: { [key: string]: string } = {
    'Bolígrafos': '/images/categories/pens.jpg',
    'Mugs y Vasos': '/images/categories/mugs.jpg',
    'Paraguas': '/images/categories/umbrellas.jpg',
    'Llaveros': '/images/categories/keychains.jpg',
    'Maletines y Morrales': '/images/categories/bags.jpg',
    'Libretas': '/images/categories/notebooks.jpg',
    'Tecnología': '/images/categories/tech.jpg',
    'Hogar': '/images/categories/home.jpg',
    'Oficina': '/images/categories/office.jpg',
    'Deportes': '/images/categories/sports.jpg',
    'Ecológicos': '/images/categories/eco.jpg',
    'Salud y Cuidado': '/images/categories/health.jpg',
    'Accesorios y Varios': '/images/categories/accessories.jpg',
    'Otros': '/images/categories/others.jpg'
  };
  return images[category] || '/images/categories/default.jpg';
};
</script>

<template>
  <div class="category-card"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="category-image">
      <img :src="props.image || getDefaultImage(props.category)" :alt="props.category">
      <div class="category-overlay" :class="{ 'show': isHovered }">
        <h3>{{ props.category }}</h3>
        <ul class="subcategories-list">
          <li v-for="sub in props.subcategories.slice(0, 5)" 
              :key="sub"
              @click="emit('select', props.category, sub)">
            {{ sub }}
          </li>
          <li v-if="props.subcategories.length > 5" class="more-items">
            + {{ props.subcategories.length - 5 }} más
          </li>
        </ul>
      </div>
    </div>
    <h4 class="category-title">{{ props.category }}</h4>
  </div>
</template>

<style scoped>
.category-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-image {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
}

.category-overlay.show {
  opacity: 1;
}

.category-overlay h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.subcategories-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
}

.subcategories-list li {
  margin: 0.5rem 0;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subcategories-list li:hover {
  color: #2196f3;
}

.more-items {
  color: #2196f3;
  font-style: italic;
}

.category-title {
  padding: 1rem;
  margin: 0;
  text-align: center;
  font-size: 1.1rem;
  color: #333;
}

@media (max-width: 768px) {
  .category-overlay {
    padding: 1rem;
  }

  .category-overlay h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .subcategories-list {
    font-size: 0.8rem;
  }
}
</style>
