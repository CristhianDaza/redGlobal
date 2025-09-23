<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useAuthStore, useUserStore } from '@/store'

defineProps({
  activeTab: String,
  isAdmin: Boolean,
  pendingQuotes: Number
})

const authStore = useAuthStore()
const userStore = useUserStore()

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'))

const currentUserName = computed(() => {
  const user = userStore.users.find(u => u.email === authStore.user?.email?.toLowerCase())
  return user?.name || 'Usuario'
})
</script>

<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <div class="header-content">
        <span class="material-icons">admin_panel_settings</span>
        <h2>Administración</h2>
      </div>
      <p class="user-email">{{ currentUserName }}</p>
    </div>
    <nav class="sidebar-nav">
      <button
        v-if="isAdmin"
        :class="['nav-item', { active: activeTab === 'menu' }]"
        @click="$emit('tab-change', 'menu')"
      >
        <span class="material-icons">menu</span>
        <span>Menú</span>
      </button>
      <button
        v-if="isAdmin"
        :class="['nav-item', { active: activeTab === 'users' }]"
        @click="$emit('tab-change', 'users')"
      >
        <span class="material-icons">group</span>
        <span>Usuarios</span>
      </button>
      <button
        v-if="isAdmin"
        :class="['nav-item', { active: activeTab === 'cards' }]"
        @click="$emit('tab-change', 'cards')"
      >
        <span class="material-icons">category</span>
        <span>Categorías</span>
      </button>
      <button
        v-if="isAdmin"
        :class="['nav-item', { active: activeTab === 'catalogs' }]"
        @click="$emit('tab-change', 'catalogs')"
      >
        <span class="material-icons">menu_book</span>
        <span>Catálogos</span>
      </button>
      <button
        v-if="isAdmin"
        :class="['nav-item', { active: activeTab === 'carousel' }]"
        @click="$emit('tab-change', 'carousel')"
      >
        <span class="material-icons">add_photo_alternate</span>
        <span>Imagen del Carrusel</span>
      </button>
      <button
        v-if="isAdmin"
        :class="['nav-item', { active: activeTab === 'our-clients' }]"
        @click="$emit('tab-change', 'our-clients')"
      >
        <span class="material-icons">groups</span>
        <span>Nuestros Clientes</span>
      </button>
      <button
        v-if="isAdmin"
        :class="['nav-item', { active: activeTab === 'color' }]"
        @click="$emit('tab-change', 'color')"
      >
        <span class="material-icons">color_lens</span>
        <span>Color Principal</span>
      </button>
      <button
        v-if="isAdmin"
        :class="['nav-item', { active: activeTab === 'advisors' }]"
        @click="$emit('tab-change', 'advisors')"
      >
        <span class="material-icons">support_agent</span>
        <span>Asesores</span>
      </button>
      <button
        :class="['nav-item', { active: activeTab === 'advanced-quotes' }]"
        @click="$emit('tab-change', 'advanced-quotes')"
      >
        <span class="material-icons">request_quote</span>
        <span>Cotizaciones</span>
        <span
          v-if="isAdmin && (pendingQuotes || 0) > 0"
          class="quote-badge"
        >
          {{ pendingQuotes }}
        </span>
      </button>
      <div class="divider" v-if="isAdmin"></div>
      <RgButton
        v-if="isAdmin"
        @click="$emit('update-products')"
        full
        class="button-update-products"
      >
        Actualizar Productos
      </RgButton>
    </nav>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.sidebar-header .user-email {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.5rem 0 0;
  padding-left: 2rem;
}

.sidebar-header .material-icons {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.button-update-products {
  margin-top: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  text-align: left;
  position: relative;
  outline: none;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  min-height: 40px;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.nav-item:hover {
  background: linear-gradient(145deg, var(--primary-color), var(--primary-color));
  color: white;
  border: 2px solid var(--primary-color);
  box-shadow: 
    0 6px 20px rgba(var(--primary-color-rgb, 0, 123, 255), 0.25),
    0 2px 8px rgba(var(--primary-color-rgb, 0, 123, 255), 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover .material-icons {
  color: white;
  transform: scale(1.1);
}

.nav-item:active {
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(var(--primary-color-rgb, 0, 123, 255), 0.2),
    0 1px 4px rgba(var(--primary-color-rgb, 0, 123, 255), 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.nav-item.active {
  background: linear-gradient(145deg, var(--primary-color), var(--primary-color));
  color: white;
  border: 2px solid var(--primary-color);
  box-shadow: 
    0 6px 20px rgba(var(--primary-color-rgb, 0, 123, 255), 0.25),
    0 2px 8px rgba(var(--primary-color-rgb, 0, 123, 255), 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.nav-item.active .material-icons {
  color: white;
}

.nav-item.active:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(var(--primary-color-rgb, 0, 123, 255), 0.3),
    0 3px 10px rgba(var(--primary-color-rgb, 0, 123, 255), 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.nav-item .material-icons {
  font-size: 1.25rem;
}

.nav-icon {
  font-size: 1.25rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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
}

.divider {
  height: 2px;
  background-color: #e2e8f0;
  margin-top: 2rem;
}
</style>
