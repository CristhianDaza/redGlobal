<script setup lang="ts">
import { ref, computed } from 'vue';
import type { MenuItem } from '../types/common';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../store/useMenuStore';
import RgButton from '../components/UI/RgButton.vue';
import MenuItemForm from '../components/Admin/MenuItemForm.vue';
import RgConfirmModal from '../components/UI/RgConfirmModal.vue';

const authStore = useAuthStore();
const menuStore = useMenuStore();
const router = useRouter();
const activeTab = ref('items'); // 'items' | 'users'
const showMenuItemModal = ref(false);
const editingMenuItem = ref<MenuItem | undefined>(undefined);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<MenuItem | undefined>(undefined);

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

const handleAddMenuItem = () => {
  editingMenuItem.value = undefined;
  showMenuItemModal.value = true;
};

const handleEditMenuItem = (item: MenuItem) => {
  editingMenuItem.value = item;
  showMenuItemModal.value = true;
};

const handleSaveMenuItem = async (menuItem: MenuItem) => {
  try {
    if (menuItem.id) {
      await menuStore.updateMenuItem(menuItem);
    } else {
      await menuStore.createMenuItem(menuItem);
    }
    showMenuItemModal.value = false;
    editingMenuItem.value = undefined;
    await menuStore.getMenu();
  } catch (error) {
    console.error('Error saving menu item:', error);
  }
};

const handleCloseModal = () => {
  showMenuItemModal.value = false;
  editingMenuItem.value = undefined;
};

const handleDeleteClick = (item: MenuItem) => {
  itemToDelete.value = item;
  showDeleteConfirm.value = true;
};

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    await menuStore.deleteMenuItem(itemToDelete.value.id);
    showDeleteConfirm.value = false;
    itemToDelete.value = undefined;
  }
};

const handleCancelDelete = () => {
  showDeleteConfirm.value = false;
  itemToDelete.value = undefined;
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
          <span class="material-icons">menu</span>
          <span>Gestión de Menú</span>
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
          :text="activeTab === 'items' ? 'Agregar Item al Menú' : 'Crear Usuario'"
          class="add-button"
          @click="activeTab === 'items' ? handleAddMenuItem() : handleAddUser()"
          type="default"
        />
      </header>

      <div class="main-content">
        <div v-if="activeTab === 'items'" class="items-section">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="material-icons">menu</span>
              <div class="stat-info">
                <h3>Items en Menú</h3>
                <p>{{ menuStore.getMenuItems.length }}</p>
              </div>
            </div>
          </div>

          <!-- Tabla de menú -->
          <div class="menu-table">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Ruta</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in menuStore.getMenuItems" :key="item.id">
                  <td>{{ item.title }}</td>
                  <td>{{ item.path }}</td>
                  <td class="actions">
                    <button class="action-btn edit" @click="handleEditMenuItem(item)">
                      <span class="material-icons">edit</span>
                    </button>
                    <button class="action-btn delete" @click="handleDeleteClick(item)">
                      <span class="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
  <!-- Modal para agregar/editar items del menú -->
  <MenuItemForm
    :is-open="showMenuItemModal"
    :menu-item="editingMenuItem"
    @close="handleCloseModal"
    @save="handleSaveMenuItem"
  />

  <!-- Modal de confirmación para eliminar -->
  <RgConfirmModal
    :is-open="showDeleteConfirm"
    title="Eliminar Item"
    message="¿Estás seguro de que deseas eliminar este item del menú?"
    @close="handleCancelDelete"
    @confirm="handleConfirmDelete"
  />
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

/* Estilos de la tabla */
.menu-table {
  margin-top: 2rem;
  overflow-x: auto;
}

.menu-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.menu-table th,
.menu-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.menu-table th {
  font-weight: 600;
  color: #4a5568;
  background: #f8fafc;
}

.menu-table td {
  color: #2d3748;
}

.menu-table .actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.action-btn.edit {
  color: #4299e1;
}

.action-btn.edit:hover {
  background: #ebf8ff;
}

.action-btn.delete {
  color: #f56565;
}

.action-btn.delete:hover {
  background: #fff5f5;
}

.action-btn .material-icons {
  font-size: 1.25rem;
}
</style>
