<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store';
import { useMenuAdmin, useUserAdmin, useQuoteAdmin, useCategoryAdmin } from '@/composable';
import { UserFormData } from "@/types/common";

const MenuItemForm = defineAsyncComponent(/* webpackChunkName: "menuItemForm" */() => import('../components/Admin/MenuItemForm.vue'));
const UserForm = defineAsyncComponent(/* webpackChunkName: "userForm" */() => import('../components/Admin/UserForm.vue'));
const RgConfirmModal = defineAsyncComponent(/* webpackChunkName: "rgConfirmModal" */() => import('../components/UI/RgConfirmModal.vue'));
const CategoryCardForm = defineAsyncComponent(/* webpackChunkName: "categoryCardForm" */() => import('../components/Admin/CategoryCardForm.vue'));

const AdminSidebar = defineAsyncComponent(/* webpackChunkName: "adminSidebar" */() => import('@/components/Admin/AdminSidebar.vue'));
const MenuSection = defineAsyncComponent(/* webpackChunkName: "menuSection" */() => import('@/components/Admin/sections/MenuSection.vue'));
const AdminHeader = defineAsyncComponent(/* webpackChunkName: "adminHeader" */() => import('@/components/Admin/AdminHeader.vue'));
const UsersSection = defineAsyncComponent(/* webpackChunkName: "usersSection" */() => import('@/components/Admin/sections/UsersSection.vue'));
const QuotesSection = defineAsyncComponent(/* webpackChunkName: "quotesSection" */() => import('@/components/Admin/sections/QuotesSection.vue'));
const CategoriesSection = defineAsyncComponent(/* webpackChunkName: "categoriesSection" */() => import('@/components/Admin/sections/CategoriesSection.vue'));
const QuoteDetailsModal = defineAsyncComponent(/* webpackChunkName: "quoteDetailsModal" */() => import('@/components/Admin/QuoteDetailsModal.vue'));

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isAuthenticated = computed(() => authStore.isAuthenticated());

const activeTab = ref<'menu' | 'users' | 'quotes' | 'cards'>('quotes');

const handleTabChange = (tab: string) => {
  router.push({ query: { tab } });
  activeTab.value = tab as 'menu' | 'users' | 'quotes' | 'cards';
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

const showDeleteConfirm = ref(false);
const itemToDelete = ref<{ id: string; type: 'menu' | 'user' | 'quote' | 'card' } | undefined>(undefined);

const handleDeleteClick = (id: string, type: 'menu' | 'user' | 'quote' | 'card') => {
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
      case 'user':
        await deleteUser(itemToDelete.value.id);
        break;
      case 'quote':
        await deleteQuote(itemToDelete.value.id);
        break;
      case 'card':
        await deleteCategoryCard(itemToDelete.value.id);
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
    default: return false;
  }
});

onMounted(async () => {
  try {
    await Promise.all([
      loadMenu(),
      loadUsers(),
      loadQuotes(),
      loadCategoryCards()
    ]);
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
});

watch(activeTab, async (newTab) => {
  try {
    if (newTab === 'menu') {
      await loadMenu();
      await router.push({ query: { tab: 'menu' } });
    } else if (newTab === 'users') {
      await loadUsers();
      await router.push({ query: { tab: 'users' } });
    } else if (newTab === 'quotes') {
      await loadQuotes();
      await router.push({ query: { tab: 'quotes' } });
    } else if (newTab === 'cards') {
      await loadCategoryCards();
      await router.push({ query: { tab: 'cards' } });
    }
  } catch (error) {
    console.error('Error loading data for tab:', newTab, error);
  }
});

watch(() => route.query.tab, (newTab) => {
  if (newTab && ['menu', 'users', 'quotes', 'cards'].includes(newTab as string)) {
    activeTab.value = newTab as 'menu' | 'users' | 'quotes' | 'cards';
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
            @delete="id => handleDeleteClick(id, 'user')"
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
            @delete="id => handleDeleteClick(id, 'quote')"
          />

          <CategoriesSection
            v-else-if="activeTab === 'cards'"
            :cards="categoryCards"
            @edit="handleEditCard"
            @delete="id => handleDeleteClick(id, 'card')"
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
          :message="`¿Estás seguro de que deseas eliminar ${itemToDelete?.type === 'menu' ? 'este item del menú' : itemToDelete?.type === 'user' ? 'este usuario' : 'esta cotización'}?`"
          :isLoading="loadingData"
          @confirm="handleConfirmDelete"
          @close="handleCancelDelete"
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
