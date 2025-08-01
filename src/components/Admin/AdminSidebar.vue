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
  const user = userStore.users.find(u => u.email === authStore.user?.email)
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
        :class="['nav-item', { active: activeTab === 'hero' }]"
        @click="$emit('tab-change', 'hero')"
      >
        <span class="material-icons">add_photo_alternate</span>
        <span>Imagen Inicio</span>
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
        :class="['nav-item', { active: activeTab === 'quotes' }]"
        @click="$emit('tab-change', 'quotes')"
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
      <div class="divider"></div>
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

.divider {
  height: 2px;
  background-color: #e2e8f0;
  margin-top: 2rem;
}
</style>
