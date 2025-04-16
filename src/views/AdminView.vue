<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store';
import { useMenuAdmin, useUserAdmin, useQuoteAdmin, useCategoryAdmin, useCatalogAdmin } from '@/composable';
import { UserFormData, tabs } from "@/types/common";

const MenuItemForm = defineAsyncComponent(/* webpackChunkName: "menuItemForm" */() => import('../components/Admin/MenuItemForm.vue'));
const UserForm = defineAsyncComponent(/* webpackChunkName: "userForm" */() => import('../components/Admin/UserForm.vue'));
const RgConfirmModal = defineAsyncComponent(/* webpackChunkName: "rgConfirmModal" */() => import('../components/UI/RgConfirmModal.vue'));
const CategoryCardForm = defineAsyncComponent(/* webpackChunkName: "categoryCardForm" */() => import('../components/Admin/CategoryCardForm.vue'));
const CatalogForm = defineAsyncComponent(/* webpackChunkName: "catalogForm" */() => import('../components/Admin/CatalogForm.vue'));

const AdminSidebar = defineAsyncComponent(/* webpackChunkName: "adminSidebar" */() => import('@/components/Admin/AdminSidebar.vue'));
const MenuSection = defineAsyncComponent(/* webpackChunkName: "menuSection" */() => import('@/components/Admin/sections/MenuSection.vue'));
const AdminHeader = defineAsyncComponent(/* webpackChunkName: "adminHeader" */() => import('@/components/Admin/AdminHeader.vue'));
const UsersSection = defineAsyncComponent(/* webpackChunkName: "usersSection" */() => import('@/components/Admin/sections/UsersSection.vue'));
const QuotesSection = defineAsyncComponent(/* webpackChunkName: "quotesSection" */() => import('@/components/Admin/sections/QuotesSection.vue'));
const CategoriesSection = defineAsyncComponent(/* webpackChunkName: "categoriesSection" */() => import('@/components/Admin/sections/CategoriesSection.vue'));
const QuoteDetailsModal = defineAsyncComponent(/* webpackChunkName: "quoteDetailsModal" */() => import('@/components/Admin/QuoteDetailsModal.vue'));
const CatalogsSection = defineAsyncComponent(/* webpackChunkName: "catalogsSection" */() => import('@/components/Admin/sections/CatalogsSection.vue'));

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isAuthenticated = computed(() => authStore.isAuthenticated());

const activeTab = ref<tabs>('quotes');

const handleTabChange = (tab: tabs) => {
  router.push({ query: { tab } });
  activeTab.value = tab;
};

const currentUser = computed(():UserFormData | undefined => {
  return users.value.find(u => u.email === authStore.user?.email);
})

const isAdmin = computed(() => {
  if (!isAuthenticated.value) return false;
  return currentUser.value?.role === 'admin';
})

const {
  isLoading: menuLoading,
  menuItems,
  showMenuItemModal,
  editingMenuItem,
  loadMenu,
  handleAddMenuItem,
  handleEditMenuItem,
  handleSaveMenuItem,
  deleteMenuItem
} = useMenuAdmin();

const {
  isLoading: userLoading,
  showUserModal,
  editingUser,
  users,
  activeUsers,
  inactiveUsers,
  totalUsers,
  loadUsers,
  handleSaveUser,
  handleEditUser,
  handleAddUser,
  deleteUser
} = useUserAdmin();

const {
  isLoading: quoteLoading,
  showQuoteDetailsModal,
  selectedQuote,
  loadQuotes,
  filteredQuotes,
  totalQuotes,
  pendingQuotes,
  completedQuotes,
  handleViewQuote,
  handleCloseQuoteDetails,
  handleCompleteQuote,
  deleteQuote,
  canDeleteQuote,
  quoteStatus
} = useQuoteAdmin(isAdmin.value);

const {
  categoryCards,
  isLoadingCard,
  showCardModal,
  editingCard,
  loadCategoryCards,
  handleAddCard,
  handleEditCard,
  handleSaveCard,
  deleteCategoryCard
} = useCategoryAdmin();

const {
  isLoadingCatalog,
  showCatalogModal,
  editingCatalog,
  catalogs,
  loadCatalogs,
  handleAddCatalog,
  handleEditCatalog,
  handleSaveCatalog,
  deleteCatalog
} = useCatalogAdmin();

const showDeleteConfirm = ref(false);
const itemToDelete = ref<{ id: string; type: tabs } | undefined>(undefined);

const handleDeleteClick = (id: string, type: tabs) => {
  itemToDelete.value = { id, type };
  showDeleteConfirm.value = true;
};

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) return;
  try {
    switch (itemToDelete.value.type) {
      case 'menu':
        await deleteMenuItem(itemToDelete.value.id);
        break;
      case 'users':
        await deleteUser(itemToDelete.value.id);
        break;
      case 'quotes':
        await deleteQuote(itemToDelete.value.id);
        break;
      case 'cards':
        await deleteCategoryCard(itemToDelete.value.id);
        break;
      case 'catalogs':
        await deleteCatalog(itemToDelete.value.id);
        break;
    }
  } catch (error) {
    console.error('Error deleting item:', error);
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = undefined;
  }
};

const handleCancelDelete = () => {
  showDeleteConfirm.value = false;
  itemToDelete.value = undefined;
};

const handleCloseModal = () => {
  showMenuItemModal.value = false;
  showUserModal.value = false;
  editingMenuItem.value = undefined;
  editingUser.value = null;
};

const pendingQuotesToAdmin = computed(() => pendingQuotes.value);

const loadingData = computed(() => {
  switch (activeTab.value) {
    case 'menu': return menuLoading.value;
    case 'users': return userLoading.value;
    case 'quotes': return quoteLoading.value;
    case 'cards': return isLoadingCard.value;
    case 'catalogs': return isLoadingCatalog.value;
    default: return false;
  }
});

onMounted(async () => {
  try {
    await Promise.all([
      loadMenu(),
      loadUsers(),
      loadQuotes(),
      loadCategoryCards(),
      loadCatalogs()
    ]);
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
});

watch(activeTab, async (newTab) => {
  try {
    switch (newTab) {
      case 'menu':
        await loadMenu();
        await router.push({ query: { tab: 'menu' } });
        break;
      case 'users':
        await loadUsers();
        await router.push({ query: { tab: 'users' } });
        break;
      case 'quotes':
        await loadQuotes();
        await router.push({ query: { tab: 'quotes' } });
        break;
      case 'cards':
        await loadCategoryCards();
        await router.push({ query: { tab: 'cards' } });
        break;
      case 'catalogs':
        await loadCatalogs();
        await router.push({ query: { tab: 'catalogs' } });
        break;
      default:
        await router.push({ name: 'admin' });
        break;
    }
  } catch (error) {
    console.error('Error loading data for tab:', newTab, error);
  }
});

const deleteMessagesMap: Record<string, string> = {
  menu: 'este item del menú',
  user: 'este usuario',
  quote: 'esta cotización',
  card: 'esta categoría',
  product: 'este producto',
  catalog: 'este catálogo',
  default: 'este elemento'
}

const deleteMessage = computed(() => {
  const type = itemToDelete?.value?.type || 'default'
  const label = deleteMessagesMap[type] || deleteMessagesMap.default
  return `¿Estás seguro de que deseas eliminar ${label}?`
})

watch(() => route.query.tab, (newTab) => {
  if (newTab && ['menu', 'users', 'quotes', 'cards', 'catalogs'].includes(newTab as tabs)) {
    activeTab.value = newTab as tabs;
  }
});
</script>

<template>
  <div v-if="!isAuthenticated" class="error-container">
    <p>Debes iniciar sesión para acceder a esta página</p>
  </div>
  <div v-else class="admin-layout">
    <AdminSidebar
      :active-tab="activeTab"
      :is-admin="isAdmin"
      :pending-quotes="pendingQuotesToAdmin"
      @tab-change="handleTabChange"
    />

    <main class="admin-main">
      <AdminHeader
        :active-tab="activeTab"
        :is-admin="isAdmin"
        @add-menu="handleAddMenuItem"
        @add-user="handleAddUser"
        @add-card="handleAddCard"
        @add-catalog="handleAddCatalog"
      />

      <div class="main-content">
        <div v-if="loadingData" class="loading-section">
          <div class="loader"></div>
          <p>Cargando datos...</p>
        </div>

        <div v-else>
          <MenuSection
            v-if="activeTab === 'menu'"
            :items="menuItems"
            @edit="handleEditMenuItem"
            @delete="id => handleDeleteClick(id, 'menu')"
          />

          <UsersSection
            v-else-if="activeTab === 'users'"
            :users="users"
            :total="totalUsers"
            :active="activeUsers"
            :inactive="inactiveUsers"
            @edit="handleEditUser"
            @delete="id => handleDeleteClick(id, 'users')"
          />

          <QuotesSection
            v-else-if="activeTab === 'quotes'"
            :quotes="filteredQuotes"
            :totals="{ total: totalQuotes, pending: pendingQuotes, completed: completedQuotes }"
            :quoteStatus="quoteStatus"
            :is-admin="isAdmin"
            :canDeleteQuote="canDeleteQuote"
            @view="handleViewQuote"
            @complete="handleCompleteQuote"
            @delete="id => handleDeleteClick(id, 'quotes')"
          />

          <CategoriesSection
            v-else-if="activeTab === 'cards'"
            :cards="categoryCards"
            @edit="handleEditCard"
            @delete="id => handleDeleteClick(id, 'cards')"
          />

          <CatalogsSection
            v-if="activeTab === 'catalogs'"
            :items="catalogs"
            @edit="handleEditCatalog"
            @delete="id => handleDeleteClick(id, 'catalogs')"
          />
        </div>

        <MenuItemForm
          :isOpen="showMenuItemModal"
          :menuItem="editingMenuItem"
          :loading="menuLoading"
          @save="handleSaveMenuItem"
          @close="handleCloseModal"
        />

        <UserForm
          :isOpen="showUserModal"
          :user="editingUser"
          :loading="userLoading"
          @save="handleSaveUser"
          @close="handleCloseModal"
        />

        <CategoryCardForm
          :is-open="showCardModal"
          :card="editingCard"
          :loading="isLoadingCard"
          @save="handleSaveCard"
          @close="showCardModal = false"
        />

        <RgConfirmModal
          :isOpen="showDeleteConfirm"
          title="Confirmar eliminación"
          :message="deleteMessage"
          :isLoading="loadingData"
          @confirm="handleConfirmDelete"
          @close="handleCancelDelete"
        />

        <CatalogForm
          :isOpen="showCatalogModal"
          :catalog="editingCatalog"
          :loading="isLoadingCatalog"
          @save="handleSaveCatalog"
          @close="showCatalogModal = false"
        />

        <QuoteDetailsModal
          :is-open="showQuoteDetailsModal"
          :quote="selectedQuote"
          :is-admin="isAdmin"
          :quote-status="quoteStatus"
          @complete="handleCompleteQuote"
          @close="handleCloseQuoteDetails"
        />
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

.admin-main {
  padding: 2rem;
}

.main-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-image img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.category-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
  .admin-main {
    padding: 1rem;
  }
}

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
