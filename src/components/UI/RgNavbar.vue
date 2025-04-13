<script setup lang="ts">
import type { ProductsRedGlobal } from '@/types/common.d';
import { computed, defineAsyncComponent, ref } from 'vue';
import TvButton from '@todovue/tvbutton';
import { useRouter } from 'vue-router';
import { useAuthStore, useMenuStore, useQuoteStore, useUserStore } from '@/store';
import { NotificationService } from '../Notification/NotificationService';

const RgAutocomplete = defineAsyncComponent(/* webpackChunkName: "rgAutocomplete" */ () => import('@/components/UI/RgAutocomplete.vue'));
const RgLoginModal = defineAsyncComponent(/* webpackChunkName: "rgLoginModal" */ () => import('@/components/UI/RgLoginModal.vue'));
const QuoteCart = defineAsyncComponent(/* webpackChunkName: "quoteCart" */ () => import('@/components/Quote/QuoteCart.vue'));

const router = useRouter();
const menuStore = useMenuStore();
const authStore = useAuthStore()
const userStore = useUserStore();
const quoteStore = useQuoteStore();
const searchQuery = ref('');
const suggestions = ref<ProductsRedGlobal[]>([]);
const showLoginModal = ref(false);
const showQuoteCart = ref(false);

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
  return authStore.loading ? 'Cargando...' :
      authStore.isAuthenticated() ? 'Cerrar Sesión' : 'Iniciar Sesión';
});

const userIcon = computed(() => {
  return authStore.isAuthenticated() ? 'logout' : 'person';
});

const isLoadingLogo = computed(() => {
  return authStore.isAuthenticated() && userStore.isLoadingUsers;
});

const currentUserLogo = computed((): string | undefined => {
  if (!authStore.isAuthenticated()) {
    return '/src/assets/images/main-logo.png';
  }

  if (isLoadingLogo.value) {
    return undefined;
  }

  const currentUser = userStore.users.find(user => user.email === authStore.user?.email);

  if (currentUser?.logo) {
    return currentUser.logo;
  }

  return '/src/assets/images/main-logo.png';
});

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    NotificationService.push({
      title: 'Búsqueda inválida',
      description: 'Por favor, ingresa un término de búsqueda válido.',
      type: 'error'
    })
    return;
  }

  if (searchQuery.value.trim().length < 3) {
    NotificationService.push({
      title: 'Búsqueda inválida',
      description: 'Por favor, ingresa al menos 3 caracteres de búsqueda.',
      type: 'error'
    })
    return;
  }

  if (suggestions.value.length === 1) {
    router.push({
      name: 'product',
      params: { id: suggestions.value[0].id },
    });
    searchQuery.value = '';
    return;
  }

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
    <template v-if="isLoadingLogo">
      <div class="logo-skeleton"></div>
    </template>
    <router-link to="/">
      <img v-if="currentUserLogo" :src="currentUserLogo" alt="Logo" class="logo">
    </router-link>
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
        :custom-style="{
          backgroundColor: 'var(--primary-color)',
          boxShadow: '0 2px 8px var(--primary-color)',
          color: '#fff'
        }"
      />
    </div>
    <div class="auth-buttons">
      <button
        v-if="authStore.isAuthenticated()"
        class="nav-link quote-cart-btn"
        @click="showQuoteCart = true"
      >
        <span class="material-icons">request_quote</span>
        <span>Cotizaciones</span>
        <span v-if="quoteStore.totalItems > 0" class="quote-badge">{{ quoteStore.totalItems }}</span>
      </button>

      <router-link
        v-if="authStore.isAuthenticated()"
        :to="{ name: 'admin', query: { tab: 'quotes' } }"
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
    <QuoteCart :is-open="showQuoteCart" @close="showQuoteCart = false" />
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

.logo-skeleton {
  height: 50px;
  width: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
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
      color: var(--primary-color);
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
      color: var(--primary-color);
    }

    &:hover {
      color: var(--primary-color);
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
      color: var(--primary-color);
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--primary-color);
    }
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #666;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    font-size: 14px;
    cursor: pointer;

    .material-icons {
      font-size: 18px;
      color: var(--primary-color);
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--primary-color);
    }
  }

  .quote-cart-btn {
    position: relative;
  }

  .quote-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: var(--primary-color);
    color: white;
    font-size: 0.75rem;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #666;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    font-size: 14px;
    cursor: pointer;

    .material-icons {
      font-size: 18px;
      color: var(--primary-color);
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--primary-color);
    }
  }

  .quote-cart-btn {
    position: relative;
  }

  .quote-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: var(--primary-color);
    color: white;
    font-size: 0.75rem;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
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
