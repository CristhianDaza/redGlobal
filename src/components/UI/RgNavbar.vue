<script setup lang="ts">
import type { ProductsRedGlobal } from '@/types/common.d';
import { computed, defineAsyncComponent, ref } from 'vue';
import TvButton from '@todovue/tv-button';
import { useRouter } from 'vue-router';
import { useAuthStore, useMenuStore, useQuoteStore, useUserStore } from '@/store';
import { useIsMobile } from '@/composable';
import { NotificationService } from '../Notification/NotificationService';
import mainLogo from '@/assets/images/main-logo.png'

const RgAutocomplete = defineAsyncComponent(/* webpackChunkName: "rgAutocomplete" */ () => import('@/components/UI/RgAutocomplete.vue'));
const RgLoginModal = defineAsyncComponent(/* webpackChunkName: "rgLoginModal" */ () => import('@/components/UI/RgLoginModal.vue'));
const QuoteCart = defineAsyncComponent(/* webpackChunkName: "quoteCart" */ () => import('@/components/Quote/QuoteCart.vue'));

const router = useRouter();
const menuStore = useMenuStore();
const authStore = useAuthStore()
const userStore = useUserStore();
const quoteStore = useQuoteStore();
const { isSize878, isSize320 } = useIsMobile();

const sidebarOpen = ref(false);
const windowWidth = ref(window.innerWidth);
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
    return mainLogo;
  }

  if (isLoadingLogo.value) {
    return undefined;
  }

  const currentUser = userStore.users.find(user => user.email === authStore.user?.email);

  if (currentUser?.logo) {
    return currentUser.logo;
  }

  return mainLogo;
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
      params: { id: suggestions?.value?.[0]?.id },
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
    params: { id: product?.id },
  });
  searchQuery.value = '';
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};

const isActiveRoute = (path: string) => {
  const currentPath = router.currentRoute.value.path;
  
  if (path === '/products') {
    return currentPath === '/products' || currentPath.startsWith('/products/');
  }
  if (path === '/search') {
    return currentPath === '/search';
  }
  return currentPath === path;
};

window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth;
});
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <button v-if="isSize878" class="menu-toggle" @click="sidebarOpen = true">
        <span class="material-icons">menu</span>
      </button>

      <div class="navbar-menu">
        <template v-if="!menuStore.isLoading">
          <router-link
            :to="path"
            class="menu-item"
            v-for="({id, title, path}) in menuStore.getMenuItems"
            :key="id"
            active-class="router-link-exact-active"
            :class="{ 'router-link-exact-active': isActiveRoute(path) }"
          >
            {{ title }}
          </router-link>
        </template>
        <template v-else>
          <div v-for="i in 4" :key="i" class="skeleton-item">
            <div class="skeleton-button"></div>
          </div>
        </template>
      </div>
      <div class="navbar-actions">
        <!-- Phone number removed, only WhatsApp floating button remains -->
      </div>
    </div>
  </nav>
  <div v-if="sidebarOpen" class="sidebar-overlay" @click.self="sidebarOpen = false">
    <div class="sidebar">
      <button class="close-btn" @click="sidebarOpen = false">
        <span class="material-icons">close</span>
      </button>
      <nav class="sidebar-menu">
        <router-link
          v-for="({id, title, path}) in menuStore.getMenuItems"
          :key="id"
          :to="path"
          class="menu-item"
          @click="sidebarOpen = false"
        >
          {{ title }}
        </router-link>
      </nav>
    </div>
  </div>
  <div class="navbar-brand">
    <div>
      <template v-if="isLoadingLogo">
        <div class="logo-skeleton"></div>
      </template>
      <router-link to="/">
        <img v-if="currentUserLogo" :src="currentUserLogo" alt="Logo" class="logo">
      </router-link>
    </div>
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
        <span class="auth-button" v-if="!isSize320">Cotizaciones</span>
        <span v-if="quoteStore.totalItems > 0" class="quote-badge">{{ quoteStore.totalItems }}</span>
      </button>

      <router-link
        v-if="authStore.isAuthenticated()"
        :to="{ name: 'admin', query: { tab: 'quotes' } }"
        class="admin-link"
      >
        <span class="material-icons">admin_panel_settings</span>
        <span class="auth-button" v-if="!isSize320">Admin</span>
      </router-link>

      <p @click="authStore.isAuthenticated() ? handleLogout() : toggleLoginModal()" style="cursor: pointer;">
        <span class="material-icons">{{ userIcon }}</span>
        <span v-if="!isSize320">{{ userButtonText }}</span>
      </p>
    </div>
  </div>
  <RgLoginModal v-if="showLoginModal" :is-open="showLoginModal" @close="toggleLoginModal" />
  <QuoteCart :is-open="showQuoteCart" @close="showQuoteCart = false" />
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
  padding: 1rem 0;
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
  padding: 0.75rem 1rem;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  text-decoration: none;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background: var(--primary-color);
    transition: width 0.3s ease;
  }
}

.menu-item:hover {
  color: var(--primary-color);
  transform: none;

  &::after {
    width: 100%;
  }
}

.menu-item.router-link-exact-active {
  color: var(--primary-color);
  font-weight: 700;

  &::after {
    width: 100%;
  }
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
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    .material-icons {
      font-size: 18px;
      color: var(--primary-color);
      transition: all 0.3s ease;
    }

    &:hover {
      background: linear-gradient(145deg, var(--primary-color), var(--primary-color));
      color: white;
      box-shadow: 
        0 4px 12px rgba(var(--primary-color-rgb, 0, 123, 255), 0.2),
        0 2px 6px rgba(var(--primary-color-rgb, 0, 123, 255), 0.1);
      transform: translateY(-1px);

      &::before {
        left: 100%;
      }

      .material-icons {
        color: white;
        transform: scale(1.05);
      }
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
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.08);
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    min-height: 40px;
    margin: 0;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: left 0.5s ease;
      pointer-events: none;
    }

    .material-icons {
      font-size: 18px;
      color: var(--primary-color);
      transition: all 0.3s ease;
    }

    &:hover {
      background: linear-gradient(145deg, var(--primary-color), var(--primary-color));
      color: white;
      border: 2px solid var(--primary-color);
      box-shadow: 
        0 6px 20px rgba(var(--primary-color-rgb, 0, 123, 255), 0.25),
        0 2px 8px rgba(var(--primary-color-rgb, 0, 123, 255), 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);

      &::before {
        left: 100%;
      }

      .material-icons {
        color: white;
        transform: scale(1.1);
      }
    }

    &:active {
      transform: translateY(-1px);
      box-shadow: 
        0 3px 12px rgba(var(--primary-color-rgb, 0, 123, 255), 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  }

  .logo {
    height: 70px;
    width: auto;
  }

  .auth-buttons {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .admin-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #666;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 14px;
    font-weight: 500;
    border: 2px solid rgba(0, 0, 0, 0.08);
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    min-height: 40px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: left 0.5s ease;
      pointer-events: none;
    }

    .material-icons {
      font-size: 18px;
      color: var(--primary-color);
      transition: all 0.3s ease;
    }

    &:hover {
      background: linear-gradient(145deg, var(--primary-color), var(--primary-color));
      color: white;
      border: 2px solid var(--primary-color);
      box-shadow: 
        0 6px 20px rgba(var(--primary-color-rgb, 0, 123, 255), 0.25),
        0 2px 8px rgba(var(--primary-color-rgb, 0, 123, 255), 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);

      &::before {
        left: 100%;
      }

      .material-icons {
        color: white;
        transform: scale(1.1);
      }
    }

    &:active {
      transform: translateY(-1px);
      box-shadow: 
        0 3px 12px rgba(var(--primary-color-rgb, 0, 123, 255), 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    border: 2px solid rgba(0, 0, 0, 0.08);
    color: #666;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    min-height: 40px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: left 0.5s ease;
      pointer-events: none;
    }

    .material-icons {
      font-size: 18px;
      color: var(--primary-color);
      transition: all 0.3s ease;
    }

    &:hover {
      background: linear-gradient(145deg, var(--primary-color), var(--primary-color));
      color: white;
      border: 2px solid var(--primary-color);
      box-shadow: 
        0 6px 20px rgba(var(--primary-color-rgb, 0, 123, 255), 0.25),
        0 2px 8px rgba(var(--primary-color-rgb, 0, 123, 255), 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);

      &::before {
        left: 100%;
      }

      .material-icons {
        color: white;
        transform: scale(1.1);
      }
    }

    &:active {
      transform: translateY(-1px);
      box-shadow: 
        0 3px 12px rgba(var(--primary-color-rgb, 0, 123, 255), 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
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
    font-weight: 600;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: 2px solid white;
    z-index: 10;
    pointer-events: none;
  }

}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  height: 24px;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
}

.sidebar {
  width: 260px;
  max-width: 80%;
  background: #fff;
  height: 100%;
  padding: 1.5rem 1rem;
  box-shadow: 2px 0 12px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  transform: translateX(-100%);
  animation: slideIn 0.3s ease-out forwards;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to   { transform: translateX(0);       }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0,0,0,0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.close-btn:hover {
  background: rgba(0,0,0,0.15);
}
.close-btn .material-icons {
  font-size: 20px;
  color: #333;
}

.sidebar-menu {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-menu .menu-item {
  display: block;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  border-radius: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background: var(--primary-color);
    transition: width 0.3s ease;
  }
}

.sidebar-menu .menu-item:hover {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb, 0, 123, 255), 0.05);

  &::after {
    width: 100%;
  }
}


@media (max-width: 768px) {
  .navbar-brand {
    gap: 0.5rem;
    padding: 2rem 0;
    justify-content: center;
    flex-direction: column;

    .search-container {
      order: 3;
      min-width: 100%;
      margin-top: 1rem;
      padding: 0;
    }
    .auth-buttons {
      margin-top: .5rem;
      display: flex;
    }
  }
}

@media (max-width: 878px) {
  .navbar-menu {
    display: none;
  }
}
</style>
