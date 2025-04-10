<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { MenuItem, User, UserFormData } from '../types/common';
import { useAuthStore } from '../store/useAuthStore'; 
import { useMenuStore } from '../store/useMenuStore';
import { useUserStore } from '../store/useUserStore';
import { useQuoteStore } from '../store/useQuoteStore';
import RgButton from '../components/UI/RgButton.vue';
import MenuItemForm from '../components/Admin/MenuItemForm.vue';
import UserForm from '../components/Admin/UserForm.vue';
import RgConfirmModal from '../components/UI/RgConfirmModal.vue';
import { uploadImage } from '../config/cloudinary';
import { getRelativeTime } from '../utils/helpers';

const authStore = useAuthStore();
const menuStore = useMenuStore();
const userStore = useUserStore();
const quoteStore = useQuoteStore();

const isLoadingData = ref(false);

const activeTab = ref('quotes'); // 'items' | 'users' | 'quotes'
const showMenuItemModal = ref(false);
const showUserModal = ref(false);
const editingMenuItem = ref<MenuItem | undefined>(undefined);
const editingUser = ref<User | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<{ id: string; type: 'menu' | 'user' } | undefined>(undefined);

const isAuthenticated = computed(() => authStore.isAuthenticated())
const isAdmin = computed(() => {
  const currentUser = userStore.users.find(user => user.email === authStore.user?.email)
  return currentUser?.role === 'admin' && authStore.isAdmin
})

// Establecer la pestaña inicial según el rol
watch(isAdmin, (newIsAdmin) => {
  if (!newIsAdmin) {
    activeTab.value = 'quotes';
  } else if (activeTab.value === 'quotes') {
    activeTab.value = 'items';
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

interface Quote {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    color: string;
    colorName: string;
    quantity: number;
    maxQuantity: number;
    includeMarking: boolean;
    inkColors?: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const handleViewQuote = (quote: Quote) => {
  selectedQuote.value = quote;
  showQuoteDetailsModal.value = true;
};

const handleCloseQuoteDetails = () => {
  showQuoteDetailsModal.value = false;
  selectedQuote.value = null;
};

const quoteStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const showQuoteDetailsModal = ref(false);
const selectedQuote = ref<Quote | null>(null);

// Cargar datos iniciales
onMounted(async () => {
  isLoadingData.value = true;
  try {
    await Promise.all([
      menuStore.getMenu(),
      quoteStore.getQuotes(),
      userStore.getUsers()
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    isLoadingData.value = false;
  }
});

const handleCompleteQuote = async (quoteId: string) => {
  try {
    await quoteStore.updateQuoteStatus(quoteId, quoteStatus.COMPLETED);
    if (selectedQuote.value) {
      selectedQuote.value = {
        ...selectedQuote.value,
        status: quoteStatus.COMPLETED
      };
    }
    await quoteStore.getQuotes();
  } catch (error) {
    console.error('Error al completar la cotización:', error);
  }
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
const activeUsers = computed(() => users.value.filter(u => u.active).length);
const inactiveUsers = computed(() => users.value.filter(u => !u.active).length);

// Stats de cotizaciones
const filteredQuotes = computed(() => {
  if (isAdmin.value) {
    return quoteStore.quotes;
  }
  return quoteStore.quotes.filter(quote => quote.userEmail === userEmail.value);
});

const totalQuotes = computed(() => filteredQuotes.value.length);
const pendingQuotes = computed(() => filteredQuotes.value.filter(q => q.status === quoteStatus.PENDING).length);
const completedQuotes = computed(() => filteredQuotes.value.filter(q => q.status === quoteStatus.COMPLETED).length);

// Estado de carga
const loadingData = computed(() => {
  if (activeTab.value === 'items') {
    return menuStore.isLoadingMenu;
  } else if (activeTab.value === 'users') {
    return userStore.isLoadingUsers;
  } else if (activeTab.value === 'quotes') {
    return quoteStore.isLoadingQuotes;
  }
  return false;
});

// Inicializar datos
onMounted(async () => {
  try {
    isLoadingData.value = true;
    await Promise.all([
      menuStore.getMenu(),
      userStore.getUsers(),
      quoteStore.getQuotes()
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    isLoadingData.value = false;
  }
});

// Observar cambios en la pestaña activa
watch(activeTab, async (newTab: string) => {
  try {
    isLoadingData.value = true;
    if (newTab === 'items') {
      await menuStore.getMenu();
    } else if (newTab === 'users') {
      await userStore.getUsers();
    } else if (newTab === 'quotes') {
      await quoteStore.getQuotes();
    }
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    isLoadingData.value = false;
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
          v-if="activeTab !== 'quotes' && isAdmin"
          :text="activeTab === 'items' ? 'Agregar Item al Menú' : 'Crear Usuario'"
          class="add-button"
          @click="activeTab === 'items' ? handleAddMenuItem() : handleAddUser()"
          type="default"
        />
      </header>

      <div class="main-content">
        <div v-if="loadingData" class="loading-section">
          <div class="loader"></div>
          <p>Cargando datos...</p>
        </div>

        <template v-else>
          <!-- Sección de Items -->
          <div v-if="activeTab === 'items'" class="items-section">
            <div class="stats-grid">
              <div class="stat-card">
                <span class="material-icons">menu</span>
                <div class="stat-info">
                  <h3>Items en Menú</h3>
                  <p>{{ totalMenuItems }}</p>
                </div>
              </div>
            </div>

            <!-- Tabla de items -->
            <div class="menu-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Ruta</th>
                    <th>Orden</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in menuItems" :key="item.id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.path }}</td>
                    <td>{{ item.order }}</td>
                    <td class="actions">
                      <button 
                        class="action-btn edit"
                        @click="handleEditMenuItem(item)"
                        title="Editar item"
                      >
                        <span class="material-icons">edit</span>
                      </button>
                      <button 
                        class="action-btn delete"
                        @click="handleDeleteClick(item.id, 'menu')"
                        title="Eliminar item"
                      >
                        <span class="material-icons">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sección de Usuarios -->
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
                <span class="material-icons">check_circle</span>
                <div class="stat-info">
                  <h3>Activos</h3>
                  <p>{{ activeUsers }}</p>
                </div>
              </div>
              <div class="stat-card">
                <span class="material-icons">block</span>
                <div class="stat-info">
                  <h3>Inactivos</h3>
                  <p>{{ inactiveUsers }}</p>
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
                    <th>Estado</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span :class="['status-badge', user.active ? 'completed' : 'pending']">
                        {{ user.active ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>{{ user.role === 'admin' ? 'Administrador' : 'Cliente' }}</td>
                    <td class="actions">
                      <button 
                        class="action-btn edit"
                        @click="handleEditUser(user)"
                        title="Editar usuario"
                      >
                        <span class="material-icons">edit</span>
                      </button>
                      <button 
                        class="action-btn delete"
                        @click="handleDeleteClick(user.id, 'user')"
                        title="Eliminar usuario"
                      >
                        <span class="material-icons">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sección de Cotizaciones -->
          <div v-else class="quotes-section">
            <div class="stats-grid">
              <div class="stat-card">
                <span class="material-icons">request_quote</span>
                <div class="stat-info">
                  <h3>Total Cotizaciones</h3>
                  <p>{{ totalQuotes }}</p>
                </div>
              </div>
              <div class="stat-card">
                <span class="material-icons">pending</span>
                <div class="stat-info">
                  <h3>Pendientes</h3>
                  <p>{{ pendingQuotes }}</p>
                </div>
              </div>
              <div class="stat-card">
                <span class="material-icons">done</span>
                <div class="stat-info">
                  <h3>Completadas</h3>
                  <p>{{ completedQuotes }}</p>
                </div>
              </div>
            </div>

            <!-- Tabla de cotizaciones -->
            <div class="menu-table">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>Items</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredQuotes.length === 0">
                    <td colspan="5" class="text-center">
                      <p>No hay cotizaciones disponibles</p>
                    </td>
                  </tr>
                  <tr v-else v-for="quote in filteredQuotes" :key="quote.id">
                    <td>{{ getRelativeTime(quote.createdAt) }}</td>
                    <td>
                      <div class="user-info">
                        <span>{{ quote.userName }}</span>
                        <small>{{ quote.userEmail }}</small>
                      </div>
                    </td>
                    <td>
                      <span :class="['status-badge', quote.status]">
                        {{ quote.status === quoteStatus.PENDING ? 'Pendiente' : 'Completada' }}
                      </span>
                    </td>
                    <td>{{ quote.items.length }} items</td>
                    <td class="actions">
                      <button 
                        class="action-btn view" 
                        title="Ver detalles"
                        @click="handleViewQuote(quote)"
                      >
                        <span class="material-icons">visibility</span>
                      </button>
                      <button 
                        v-if="quote.status === quoteStatus.PENDING && isAdmin"
                        class="action-btn edit" 
                        title="Marcar como completada"
                        @click="handleCompleteQuote(quote.id)"
                      >
                        <span class="material-icons">done</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- Modales -->
        <MenuItemForm
          :isOpen="showMenuItemModal"
          :menuItem="editingMenuItem"
          @save="handleSaveMenuItem"
          @close="handleCloseModal"
        />

        <UserForm
          :isOpen="showUserModal"
          :user="editingUser"
          @save="handleSaveUser"
          @close="handleCloseModal"
        />

        <RgConfirmModal
          :isOpen="showDeleteConfirm"
          title="Confirmar eliminación"
          :message="`¿Estás seguro de que deseas eliminar este ${itemToDelete?.type === 'menu' ? 'item del menú' : 'usuario'}?`"
          @confirm="handleConfirmDelete"
          @close="handleCancelDelete"
        />
      </div>
    </main>
    <!-- Modal de detalles de cotización -->
    <div v-if="showQuoteDetailsModal" class="modal-overlay">
      <div class="modal-content quote-details-modal">
        <header class="modal-header">
          <h2>Detalles de la Cotización</h2>
          <button class="close-button" @click="handleCloseQuoteDetails">
            <span class="material-icons">close</span>
          </button>
        </header>
        <div class="modal-body" v-if="selectedQuote">
          <div class="quote-info">
            <p><strong>Fecha:</strong> {{ getRelativeTime(selectedQuote.createdAt) }}</p>
            <p><strong>Cliente:</strong> {{ selectedQuote.userName }}</p>
            <p><strong>Email:</strong> {{ selectedQuote.userEmail }}</p>
            <p><strong>Estado:</strong> 
              <span :class="['status-badge', selectedQuote.status]">
                {{ selectedQuote.status === quoteStatus.PENDING ? 'Pendiente' : 'Completada' }}
              </span>
            </p>
            <p v-if="isAdmin"><strong>Nota:</strong> El precio es + IVA</p>
          </div>
          <div class="quote-items">
            <h3>Items Solicitados</h3>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Color</th>
                  <th>Cantidad</th>
                  <th>Marcado</th>
                  <th v-if="isAdmin">Precio Unit.</th>
                  <th v-if="isAdmin">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedQuote.items" :key="item.productId">
                  <td>
                    <div class="product-info">
                      <img :src="item.productImage" :alt="item.productName" class="product-thumbnail">
                      <span>{{ item.productName }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="color-info">
                      <span class="color-circle" :style="{ backgroundColor: item.color }"></span>
                      <span>{{ item.colorName }}</span>
                    </div>
                  </td>
                  <td>{{ item.quantity }}</td>
                  <td>
                    <div v-if="item.includeMarking" class="marking-info">
                      <span class="material-icons text-success">check_circle</span>
                      <span>{{ item.inkColors }} colores</span>
                    </div>
                    <span v-else>No</span>
                  </td>
                  <td v-if="isAdmin">${{ (item.unitPrice || 0).toLocaleString('es-CO') }}</td>
                  <td v-if="isAdmin">${{ (item.totalPrice || 0).toLocaleString('es-CO') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="quote-notes" v-if="selectedQuote.notes">
            <h3>Notas Adicionales</h3>
            <p>{{ selectedQuote.notes }}</p>
          </div>
        </div>
        <footer class="modal-footer" v-if="isAdmin && selectedQuote && selectedQuote.status === quoteStatus.PENDING">
          <RgButton
            text="Marcar como Completada"
            @click="handleCompleteQuote(selectedQuote.id)"
            type="default"
          />
        </footer>
      </div>
    </div>
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

/* Modal de detalles de cotización */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.close-button {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f7fafc;
  color: #4a5568;
}

.modal-body {
  padding: 1.5rem;
}

.quote-info {
  margin-bottom: 2rem;
}

.quote-info p {
  margin: 0.5rem 0;
}

.quote-items {
  margin-bottom: 2rem;
}

.quote-items h3,
.quote-notes h3 {
  font-size: 1.125rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.quote-items table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.quote-items th,
.quote-items td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.quote-items th {
  background: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}

.quote-notes {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 0.375rem;
}

.quote-notes p {
  margin: 0;
  color: #4a5568;
  line-height: 1.5;
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

/* Estilos del modal de detalles */
.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 0.25rem;
}

.color-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
}

.marking-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.text-success {
  color: #10b981;
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

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge.completed {
  background-color: #d1fae5;
  color: #059669;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-info small {
  color: #64748b;
  font-size: 0.75rem;
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
