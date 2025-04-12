<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('./RgButton.vue'));

defineProps<{
  title?: string;
  message?: string;
  showActions?: boolean;
}>();

const defaultProps = {
  title: 'No hay resultados',
  message: 'No encontramos productos que coincidan con tu búsqueda',
  showActions: true
};

const actions = [
  {
    text: 'Ver catálogo digital',
    link: '/catalogo',
    customStyle: {
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
      color: '#fff'
    }
  },
  {
    text: 'Explorar productos',
    link: '/products',
    customStyle: {
      backgroundColor: '#f5f5f5',
      color: '#333'
    }
  }
];
</script>

<template>
  <div class="empty-state">
    <div class="empty-state-content">
      <div class="icon-container">
        <span class="material-icons primary-icon">search_off</span>
        <span class="material-icons secondary-icon">inventory_2</span>
      </div>
      <h2>{{ title || defaultProps.title }}</h2>
      <p>{{ message || defaultProps.message }}</p>
      <div v-if="showActions !== false" class="action-buttons">
        <RgButton
          v-for="action in actions"
          :key="action.link"
          :text="action.text"
          :custom-style="action.customStyle"
          @click="$router.push(action.link)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
}

.empty-state-content {
  text-align: center;
  max-width: 400px;
}

.icon-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.material-icons {
  font-size: 4rem;
}

.primary-icon {
  color: var(--primary-color);
  position: relative;
  z-index: 2;
  animation: float 3s ease-in-out infinite;
}

.secondary-icon {
  color: #1be799;
  position: absolute;
  left: -10px;
  top: 10px;
  opacity: 0.2;
  transform: scale(1.2);
}

h2 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
