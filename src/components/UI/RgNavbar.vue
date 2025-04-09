<script setup lang="ts">
import type { ProductsRedGlobal } from '../../types/common';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../../store/useMenuStore';
import { useAuthStore } from '../../store/useAuthStore';
import TvButton from '@todovue/tvbutton';
import RgAutocomplete from './RgAutocomplete.vue';
import RgLoginModal from './RgLoginModal.vue';

const router = useRouter();
const menuStore = useMenuStore();
const authStore = useAuthStore();
const searchQuery = ref('');
const suggestions = ref<ProductsRedGlobal[]>([]);
const showLoginModal = ref(false);

// Observar cambios en la autenticación
watch(() => authStore.user, (newUser: any) => {
  console.log('[Navbar] Usuario cambiado:', newUser?.email);
});

const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.error('[Navbar] Error en logout:', error);
  }
};

const toggleLoginModal = () => {
  showLoginModal.value = !showLoginModal.value;
};

const userButtonText = computed(() => {
  const text = authStore.loading ? 'Cargando...' : 
               authStore.isAuthenticated() ? 'Cerrar Sesión' : 'Iniciar Sesión';
  return text;
});

const userIcon = computed(() => {
  return authStore.isAuthenticated() ? 'logout' : 'person';
});

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;

  // Si hay sugerencias y solo hay una, ir directamente al producto
  if (suggestions.value.length === 1) {
    router.push({
      name: 'product',
      params: { id: suggestions.value[0].id },
    });
    searchQuery.value = '';
    return;
  }

  // Si no hay sugerencia única, buscar normalmente
  router.push({
    name: 'search',
    query: { search: searchQuery.value },
  });
  searchQuery.value = '';
};

const handleSelect = (product: ProductsRedGlobal) => {
  router.push({
    name: 'product',
    params: { id: product.id },
  });
  searchQuery.value = '';
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-menu">
        <template v-if="!menuStore.isLoading">
          <router-link :to="path" v-for="({id, title, path}) in menuStore.getMenuItems" :key="id">
            <button class="menu-item">
              {{ title }}
            </button>
          </router-link>
        </template>
        <template v-else>
          <div v-for="i in 4" :key="i" class="skeleton-item">
            <div class="skeleton-button"></div>
          </div>
        </template>
      </div>
      <div class="navbar-actions">
        <p><span class="material-icons">phone</span> (+57) 312 345 6789</p>
      </div>
    </div>
  </nav>

  <div class="navbar-brand">
    <img src="../../assets/images/main-logo.png" alt="Logo" class="logo">
    <div class="search-container">
      <RgAutocomplete
        v-model="searchQuery"
        placeholder="Buscar productos...."
        :min-chars="3"
        @select="handleSelect"
        @keyup.enter="handleKeydown"
        @suggestions-update="suggestions = $event"
        @searchAll="handleSearch"
      />
      <TvButton
        @click="handleSearch"
        type="icon"
        icon="search"
      />
    </div>
    <div class="auth-buttons">
      <router-link
        v-if="authStore.isAuthenticated()"
        to="/admin"
        class="admin-link"
      >
        <span class="material-icons">admin_panel_settings</span>
        Admin
      </router-link>

      <p @click="authStore.isAuthenticated() ? handleLogout() : toggleLoginModal()" style="cursor: pointer;">
        <span class="material-icons">{{ userIcon }}</span>
        {{ userButtonText }}
      </p>
    </div>
    <RgLoginModal v-if="showLoginModal" :is-open="showLoginModal" @close="toggleLoginModal" />
  </div>
</template>

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
  height: 50px;
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

.skeleton-item {
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
}

.skeleton-button {
  width: 100%;
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
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
    height: 50px;
    width: auto;
  }

  .auth-buttons {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .admin-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #666;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    font-size: 14px;

    .material-icons {
      font-size: 18px;
      color: #ff4444;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: #ff4444;
    }
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
