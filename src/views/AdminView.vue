<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { MenuItem, User, UserFormData } from '../types/common';
import { useAuthStore } from '../store/useAuthStore';
import { useMenuStore } from '../store/useMenuStore';
import { useUserStore } from '../store/useUserStore';
import RgButton from '../components/UI/RgButton.vue';
import MenuItemForm from '../components/Admin/MenuItemForm.vue';
import UserForm from '../components/Admin/UserForm.vue';
import RgConfirmModal from '../components/UI/RgConfirmModal.vue';
import { uploadImage } from '../config/cloudinary';

const authStore = useAuthStore();
const menuStore = useMenuStore();
const userStore = useUserStore();

const activeTab = ref('quotes'); // 'items' | 'users' | 'quotes'
const showMenuItemModal = ref(false);
const showUserModal = ref(false);
const editingMenuItem = ref<MenuItem | undefined>(undefined);
const editingUser = ref<User | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<{ id: string; type: 'menu' | 'user' } | undefined>(undefined);

const isAuthenticated = computed(() => authStore.isAuthenticated())
const isAdmin = computed(() => authStore.isAdmin)

// Establecer la pestaña inicial según el rol
watch(isAdmin, (newIsAdmin) => {
  if (newIsAdmin && activeTab.value === 'quotes') {
    activeTab.value = 'items'
  }
}, { immediate: true })

const userEmail = computed(() => {
  return authStore.user?.email || 'No disponible';
});

const handleTabChange = (tab: string, event: Event) => {
  event.preventDefault();
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

const handleSaveUser = async (formData: UserFormData) => {
  try {
    let logoUrl = '';

    // Si hay un logo nuevo como File, primero lo subimos a Cloudinary
    if (formData.logo instanceof File) {
      try {
        const uploadResult = await uploadImage(formData.logo);
        logoUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Error al subir logo a Cloudinary:', error);
        throw new Error('Error al subir el logo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    }

    if (editingUser.value) {
      const { password, logo, ...userData } = formData;
      try {
        await userStore.updateUser(editingUser.value.id, {
          ...userData,
          logo: logoUrl || (typeof logo === 'string' ? logo : undefined)
        });
      } catch (error) {
        throw new Error('Error al actualizar usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    } else {
      try {
        await userStore.createUser({
          ...formData,
          id: '',
          logo: logoUrl || undefined
        });
      } catch (error) {
        throw new Error('Error al crear usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    }

    showUserModal.value = false;
    editingUser.value = null;
    await userStore.getUsers();
  } catch (error) {
    console.error('Error al guardar usuario:', {
      error,
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    alert(error instanceof Error ? error.message : 'Error desconocido al guardar el usuario');
  }
};

const handleCloseModal = () => {
  showMenuItemModal.value = false;
  showUserModal.value = false;
  editingMenuItem.value = undefined;
  editingUser.value = null;
};

const handleDeleteClick = (id: string, type: 'menu' | 'user') => {
  itemToDelete.value = { id, type };
  showDeleteConfirm.value = true;
};

const handleConfirmDelete = async () => {
  if (itemToDelete.value) {
    if (itemToDelete.value.type === 'menu') {
      await menuStore.deleteMenuItem(itemToDelete.value.id);
    } else {
      await userStore.deleteUser(itemToDelete.value.id);
    }
    showDeleteConfirm.value = false;
    itemToDelete.value = undefined;
  }
};

const handleCancelDelete = () => {
  showDeleteConfirm.value = false;
  itemToDelete.value = undefined;
};

const handleEditUser = (user: User) => {
  editingUser.value = { ...user };
  showUserModal.value = true;
};

const handleAddUser = () => {
  editingUser.value = null;
  showUserModal.value = true;
};

// Computed properties para los datos
const menuItems = computed(() => menuStore.menu);
const users = computed(() => userStore.users);

// Stats computados
const totalMenuItems = computed(() => menuItems.value.length);
const totalUsers = computed(() => users.value.length);

// Estado de carga
const isLoadingData = computed(() => {
  if (activeTab.value === 'items') {
    return menuStore.isLoadingMenu;
  }
  return userStore.isLoadingUsers;
});

// Inicializar datos
onMounted(async () => {
  await Promise.all([
    menuStore.getMenu(),
    userStore.getUsers()
  ]);
});

// Observar cambios en la pestaña activa
watch(activeTab, async (newTab: string) => {
  if (newTab === 'items') {
    await menuStore.getMenu();
  } else {
    await userStore.getUsers();
  }
});
</script>

<template>
  <div v-if="!isAuthenticated" class="error-container">
    <p>Debes iniciar sesión para acceder a esta página</p>
  </div>
  <div v-else class="admin-layout">
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
          v-if="isAdmin"
          :class="['nav-item', { active: activeTab === 'items' }]"
          @click="(e) => handleTabChange('items', e)"
        >
          <span class="material-icons">menu</span>
          <span>Gestión de Menú</span>
        </button>
        <button 
          v-if="isAdmin"
          :class="['nav-item', { active: activeTab === 'users' }]"
          @click="(e) => handleTabChange('users', e)"
        >
          <span class="material-icons">group</span>
          <span>Gestión de Usuarios</span>
        </button>
        <button 
          :class="['nav-item', { active: activeTab === 'quotes' }]"
          @click="(e) => handleTabChange('quotes', e)"
        >
          <span class="material-icons">request_quote</span>
          <span>Cotizaciones</span>
        </button>
      </nav>
    </aside>

    <!-- Contenido principal -->
    <main class="admin-main">
      <header class="main-header">
        <h1>
          {{
            activeTab === 'items'
              ? 'Gestión de Items'
              : activeTab === 'users'
                ? 'Gestión de Usuarios'
                : 'Cotizaciones'
          }}
        </h1>
        <RgButton
          v-if="activeTab !== 'quotes'"
          :text="activeTab === 'items' ? 'Agregar Item al Menú' : 'Crear Usuario'"
          class="add-button"
          @click="activeTab === 'items' ? handleAddMenuItem() : handleAddUser()"
          type="default"
        />
      </header>

      <div class="main-content">
        <div v-if="isLoadingData" class="loading-section">
          <div class="loader"></div>
          <p>Cargando datos...</p>
        </div>
        <div v-else-if="activeTab === 'items'" class="items-section">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="material-icons">menu</span>
              <div class="stat-info">
                <h3>Items en Menú</h3>
                <p>{{ totalMenuItems }}</p>
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
                <tr v-for="item in menuItems" :key="item.id">
                  <td>{{ item.title }}</td>
                  <td>{{ item.path }}</td>
                  <td class="actions">
                    <button class="action-btn edit" @click="handleEditMenuItem(item)">
                      <span class="material-icons">edit</span>
                    </button>
                    <button class="action-btn delete" @click="handleDeleteClick(item.id, 'menu')">
                      <span class="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else-if="activeTab === 'users'" class="users-section">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="material-icons">group</span>
              <div class="stat-info">
                <h3>Total Usuarios</h3>
                <p>{{ totalUsers }}</p>
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
          <!-- Tabla de usuarios -->
            <div class="menu-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>% Incremento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.priceIncrease }}%</td>
                    <td class="actions">
                      <button 
                        class="action-btn edit" 
                        @click="() => handleEditUser(user)"
                      >
                        <span class="material-icons">edit</span>
                      </button>
                      <button class="action-btn delete" @click="handleDeleteClick(user.id, 'user')">
                        <span class="material-icons">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>

        <!-- Sección de Cotizaciones -->
        <div v-else-if="activeTab === 'quotes'" class="quotes-section">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="material-icons">request_quote</span>
              <div class="stat-info">
                <h3>Total Cotizaciones</h3>
                <p>0</p>
              </div>
            </div>
            <div class="stat-card">
              <span class="material-icons">pending</span>
              <div class="stat-info">
                <h3>Pendientes</h3>
                <p>0</p>
              </div>
            </div>
            <div class="stat-card">
              <span class="material-icons">done</span>
              <div class="stat-info">
                <h3>Completadas</h3>
                <p>0</p>
              </div>
            </div>
          </div>

          <!-- Tabla de cotizaciones -->
          <div class="menu-table">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="5" class="text-center">
                    <p>No hay cotizaciones disponibles</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

  <!-- Modal para agregar/editar usuarios -->
  <UserForm
    :is-open="showUserModal"
    :user="editingUser"
    @close="handleCloseModal"
    @save="handleSaveUser"
  />

  <!-- Modal de confirmación para eliminar -->
  <RgConfirmModal
    :is-open="showDeleteConfirm"
    :title="`Eliminar ${itemToDelete?.type === 'menu' ? 'Item' : 'Usuario'}`"
    :message="`¿Estás seguro de que deseas eliminar este ${itemToDelete?.type === 'menu' ? 'item del menú' : 'usuario'}?`"
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
  background: var(--primary-color);
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
  background: var(--primary-color);
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
  color: var(--primary-color);
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

/* Estilos para la sección de cotizaciones */
.quotes-section {
  margin-top: 1rem;
}

.text-center {
  text-align: center;
}

.quotes-section .stat-card .material-icons {
  font-size: 2rem;
}

.quotes-section .stat-card:nth-child(1) .material-icons {
  color: var(--primary-color);
}

.quotes-section .stat-card:nth-child(2) .material-icons {
  color: #f59e0b;
}

.quotes-section .stat-card:nth-child(3) .material-icons {
  color: #10b981;
}
.loading-container,
.error-container,
.loading-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  background: #f7fafc;
  font-size: 1.25rem;
  color: #4a5568;
  gap: 1rem;
}

.loading-section {
  min-height: 400px;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid var(--primary-color);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
