<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'vue-router';
import RgLoader from '../components/UI/RgLoader.vue';
import RgButton from '../components/UI/RgButton.vue';

const authStore = useAuthStore();
const router = useRouter();
const activeTab = ref('items'); // 'items' | 'users'

// Redirigir si no está autenticado
if (!authStore.isAuthenticated()) {
  router.push('/');
}

const userEmail = computed(() => {
  return authStore.user?.email || 'No disponible';
});

const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

const handleAddItem = () => {
  // TODO: Implementar lógica para agregar item
  console.log('Agregar nuevo item');
};

const handleAddUser = () => {
  // TODO: Implementar lógica para crear usuario
  console.log('Crear nuevo usuario');
};
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar de navegación -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="header-content">
          <span class="material-icons">admin_panel_settings</span>
          <h2>Administración</h2>
        </div>
        <p class="user-email">{{ userEmail }}</p>
      </div>
      <nav class="sidebar-nav">
        <button 
          :class="['nav-item', { active: activeTab === 'items' }]"
          @click="handleTabChange('items')"
        >
          <span class="material-icons">inventory_2</span>
          <span>Gestión de Items</span>
        </button>
        <button 
          :class="['nav-item', { active: activeTab === 'users' }]"
          @click="handleTabChange('users')"
        >
          <span class="material-icons">group</span>
          <span>Gestión de Usuarios</span>
        </button>
      </nav>
    </aside>

    <!-- Contenido principal -->
    <main class="admin-main">
      <header class="main-header">
        <h1>{{ activeTab === 'items' ? 'Gestión de Items' : 'Gestión de Usuarios' }}</h1>
        <RgButton
          :label="activeTab === 'items' ? 'Agregar Nuevo Item' : 'Crear Usuario'"
          class="add-button"
          @click="activeTab === 'items' ? handleAddItem() : handleAddUser()"
          type="default"
        />
      </header>

      <div class="main-content">
        <div v-if="activeTab === 'items'" class="items-section">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="material-icons">inventory_2</span>
              <div class="stat-info">
                <h3>Total Items</h3>
                <p>0</p>
              </div>
            </div>
            <div class="stat-card">
              <span class="material-icons">low_priority</span>
              <div class="stat-info">
                <h3>Bajo Stock</h3>
                <p>0</p>
              </div>
            </div>
            <div class="stat-card">
              <span class="material-icons">trending_up</span>
              <div class="stat-info">
                <h3>Más Vendidos</h3>
                <p>0</p>
              </div>
            </div>
          </div>
          <!-- Aquí irá la tabla de items -->
        </div>

        <div v-if="activeTab === 'users'" class="users-section">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="material-icons">group</span>
              <div class="stat-info">
                <h3>Total Usuarios</h3>
                <p>0</p>
              </div>
            </div>
            <div class="stat-card">
              <span class="material-icons">verified_user</span>
              <div class="stat-info">
                <h3>Activos</h3>
                <p>0</p>
              </div>
            </div>
            <div class="stat-card">
              <span class="material-icons">schedule</span>
              <div class="stat-info">
                <h3>Pendientes</h3>
                <p>0</p>
              </div>
            </div>
          </div>
          <!-- Aquí irá la tabla de usuarios -->
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: calc(100vh - 120px);
  background: #f7fafc;
}

/* Sidebar Styles */
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
  color: #ff4444;
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

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #4a5568;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: #f7fafc;
  color: #2d3748;
}

.nav-item.active {
  background: #ff4444;
  color: white;
}

.nav-item .material-icons {
  font-size: 1.25rem;
}

/* Main Content Styles */
.admin-main {
  padding: 2rem;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.main-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.add-button {
  background: #ff4444;
  color: white;
}

.main-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card .material-icons {
  font-size: 2rem;
  color: #ff4444;
}

.stat-info h3 {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.25rem;
}

.stat-info p {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

@media (max-width: 1024px) {
  .admin-layout {
    grid-template-columns: 200px 1fr;
  }
}

@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    display: none;
  }

  .admin-main {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
