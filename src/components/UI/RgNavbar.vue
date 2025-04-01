<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-menu">
        <router-link :to="{ name }" v-for="({id, title, name}) in menuStore.getMenuItems" :key="id">
          <button 
            class="menu-item"
          >
            {{ title }}
          </button>
        </router-link>
      </div>
      <div class="navbar-actions">
        <p><span class="material-icons">phone</span> (+57) 312 345 6789</p>
      </div>
    </div>
  </nav>

  <div class="navbar-brand">
    <img src="https://www.redglobalpromo.com.co/wp-content/uploads/2019/07/Logoheader-1.png" alt="Logo" class="logo">
    <div class="search-container">
      <RgAutocomplete
        v-model="searchQuery"
        placeholder="Buscar productos...."
        :min-chars="3"
        @select="handleSelect"
        @keyup.enter="handleSearch"
      />
      <TvButton
        @click="handleSearch"
        type="icon"
        icon="search"
      />
    </div>
    <p><span class="material-icons">person</span> Iniciar Sesion</p>
  </div>
</template>

<script setup lang="ts">
import type { ProductsRedGlobal } from '../../types/common';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../../store/useMenuStore';
import TvButton from '@todovue/tvbutton';
import RgAutocomplete from './RgAutocomplete.vue';

const router = useRouter();
const menuStore = useMenuStore();
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { search: searchQuery.value }
    });
    resetSearch();
  }
};

const handleSelect = (product: ProductsRedGlobal) => {
  router.push({
    name: 'product',
    params: { id: product.id },
  });
  resetSearch();
};

const resetSearch = () => {
  searchQuery.value = '';
};
</script>

<style scoped>
.navbar {
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  margin: 0 2rem;
  padding: .5rem;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  height: 40px;
  width: auto;
}

.navbar-menu {
  flex: 1;
  display: flex;
  gap: 2rem;
  font-weight: 800;
}

.menu-item {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s ease;
  position: relative;
}

.menu-item:hover {
  color: #000;
}

.menu-item:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1rem;
  right: 1rem;
  height: 2px;
  background: currentColor;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;

  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    color: #666;

    .material-icons {
      font-size: 18px;
      color: #ff4444;
    }
  }
}

.search-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: color 0.2s ease;
}

.search-button:hover {
  color: #000;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
  z-index: 1001;
}

.search-container {
  width: 100%;
  max-width: 600px;
  position: relative;
  padding: 0 2rem;
  display: flex;
  align-items: center;
}

.search-container :deep(.autocomplete) {
  flex: 1;
}

.search-container :deep(.autocomplete input) {
  border-radius: 16px 0 0 16px !important;
  padding-right: 0;
}

.search-container :deep(.tv-btn-icon) {
  border-radius: 0 16px 16px 0;
  height: 32px;
  width: 32px;
  z-index: 1;
  background-color: #ff4444;
  color: white;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-container :deep(.tv-btn-icon svg) {
  width: 16px;
  height: 16px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  margin: 0.5rem 1rem;
  padding: 1rem 2rem 0;
  flex-wrap: wrap;

  .search-container {
    display: flex;
    align-items: stretch;
    flex: 1;
    min-width: 280px;
    max-width: 500px;
  }

  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s ease;
    white-space: nowrap;

    .material-icons {
      font-size: 18px;
      color: #ff4444;
    }

    &:hover {
      color: #ff4444;
    }
  }

  .logo {
    height: 40px;
    width: auto;
  }
}

@media (max-width: 768px) {
  .navbar-brand {
    gap: 0.5rem;
    padding: 1rem;
    justify-content: center;

    .search-container {
      order: 3;
      min-width: 100%;
      margin-top: 1rem;
    }

    .logo {
      height: 32px;
    }

    p {
      font-size: 12px;
    }
  }
}
</style>
