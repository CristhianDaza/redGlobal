<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore, useProductsStore, useUserStore } from '@/store';
import { useCatalogAdmin, useCategoryAdmin, useMenuAdmin, useQuoteAdmin, useUserAdmin, useHeroAdmin, useOurClientAdmin } from '@/composable';
import { tabs, UserFormData, User } from "@/types/common";
import { useHead } from '@vueuse/head';

const MenuItemForm = defineAsyncComponent(/* webpackChunkName: "menuItemForm" */() => import('@/components/Admin/MenuItemForm.vue'));
const UserForm = defineAsyncComponent(/* webpackChunkName: "userForm" */() => import('@/components/Admin/UserForm.vue'));
const RgConfirmModal = defineAsyncComponent(/* webpackChunkName: "rgConfirmModal" */() => import('@/components/UI/RgConfirmModal.vue'));
const CategoryCardForm = defineAsyncComponent(/* webpackChunkName: "categoryCardForm" */() => import('@/components/Admin/CategoryCardForm.vue'));
const CatalogForm = defineAsyncComponent(/* webpackChunkName: "catalogForm" */() => import('@/components/Admin/CatalogForm.vue'));
const HeroForm = defineAsyncComponent(/* webpackChunkName: "heroForm" */() => import('@/components/Admin/HeroForm.vue'));
const OurClientForm = defineAsyncComponent(/* webpackChunkName: "ourClientForm" */() => import('@/components/Admin/OurClientForm.vue'));

const AdminSidebar = defineAsyncComponent(/* webpackChunkName: "adminSidebar" */() => import('@/components/Admin/AdminSidebar.vue'));
const MenuSection = defineAsyncComponent(/* webpackChunkName: "menuSection" */() => import('@/components/Admin/sections/MenuSection.vue'));
const AdminHeader = defineAsyncComponent(/* webpackChunkName: "adminHeader" */() => import('@/components/Admin/AdminHeader.vue'));
const UsersSection = defineAsyncComponent(/* webpackChunkName: "usersSection" */() => import('@/components/Admin/sections/UsersSection.vue'));
const QuotesSection = defineAsyncComponent(/* webpackChunkName: "quotesSection" */() => import('@/components/Admin/sections/QuotesSection.vue'));
const CategoriesSection = defineAsyncComponent(/* webpackChunkName: "categoriesSection" */() => import('@/components/Admin/sections/CategoriesSection.vue'));
const QuoteDetailsModal = defineAsyncComponent(/* webpackChunkName: "quoteDetailsModal" */() => import('@/components/Admin/QuoteDetailsModal.vue'));
const CatalogsSection = defineAsyncComponent(/* webpackChunkName: "catalogsSection" */() => import('@/components/Admin/sections/CatalogsSection.vue'));
const HeroSection = defineAsyncComponent(/* webpackChunkName: "heroSection" */() => import('@/components/Admin/HeroSection.vue'));
const OurClientsSection = defineAsyncComponent(/* webpackChunkName: "ourClientsSection" */() => import('@/components/Admin/sections/OurClientsSection.vue'));

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const storeProducts = useProductsStore();
const userStore = useUserStore();
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
  handleOpenQuoteDetails,
  handleCompleteQuote,
  downloadQuoteSummary,
  deleteQuote,
  deleteAllCompletedQuotes,
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

const {
  isLoadingHero,
  showHeroModal,
  editingHero,
  hero,
  loadHero,
  handleAddHero,
  handleEditHero,
  handleSaveHero,
  deleteHero
} = useHeroAdmin();

const {
  isLoadingOurClients,
  showOurClientsModal,
  editingOurClient,
  ourClients,
  loadOurClients,
  handleAddOurClient,
  handleEditOurClient,
  handleSaveOurClient,
  deleteOurClient
} = useOurClientAdmin();

const showConfirmModal = ref(false);
const itemToConfirmModal = ref<{ id: string; type: string } | undefined>(undefined);

const handleDeleteClick = (id: string, type: tabs) => {
  itemToConfirmModal.value = { id, type };
  showConfirmModal.value = true;
};

const confirmDeleteQuotes = async () => {
  itemToConfirmModal.value = { id: '', type: 'deleteAllQuotes' };
  showConfirmModal.value = true;
};

const handleConfirmModal = async () => {
  if (!itemToConfirmModal.value) return;
  try {
    switch (itemToConfirmModal.value.type) {
      case 'menu':
        await deleteMenuItem(itemToConfirmModal.value.id);
        break;
      case 'users':
        await deleteUser(itemToConfirmModal.value.id);
        break;
      case 'cards':
        await deleteCategoryCard(itemToConfirmModal.value.id);
        break;
      case 'catalogs':
        await deleteCatalog(itemToConfirmModal.value.id);
        break;
      case 'update':
        showConfirmModal.value = false;
        itemToConfirmModal.value = undefined;
        await storeProducts.callServices(true);
        break;
      case 'deleteAllQuotes':
        await deleteAllCompletedQuotes();
        break;
      case 'hero':
        await deleteHero(itemToConfirmModal.value.id);
        break;
      case 'our-clients':
        await deleteOurClient(itemToConfirmModal.value.id);
        break;
      default:
        await deleteQuote(itemToConfirmModal.value.id);
        break;
    }
  } catch (error) {
    console.error('Error deleting item:', error);
  } finally {
    showConfirmModal.value = false;
    itemToConfirmModal.value = undefined;
  }
};

const handleCancelModal = () => {
  showConfirmModal.value = false;
  itemToConfirmModal.value = undefined;
};

const handleToggleUserStatus = async (user: User) => {
  try {
    const newStatus = !user.active;
    await userStore.updateUser(user.idDoc, { active: newStatus });
    await loadUsers();
  } catch (error) {
    console.error('Error al cambiar el estado del usuario:', error);
  }
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
    case 'hero': return isLoadingHero.value;
    case 'our-clients': return isLoadingOurClients.value;
    default: return false;
  }
});

onMounted(async () => {
  try {
    if (isAdmin.value) {
      await Promise.all([
        loadMenu(),
        loadUsers(),
        loadQuotes(),
        loadCategoryCards(),
        loadCatalogs(),
        loadHero(),
        loadOurClients(),
      ]);

      if (route.query.quoteId) {
        const quoteId = route.query.quoteId as string;
        await handleOpenQuoteDetails(quoteId);
      }
      return;
    }
    await loadQuotes();
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
});

watch(activeTab, (newTab) => {
  const validTabs = ['menu', 'users', 'quotes', 'cards', 'catalogs', 'hero', 'our-clients'];
  const tab = validTabs.includes(newTab as tabs) ? newTab : undefined;
  if (tab) {
    router.replace({ query: { tab } });
  } else {
    router.replace({ name: 'admin' });
  }
});

const messageConfirmsMap: Record<string, string> = {
  menu: '¿Estás segur@ de que deseas eliminar este menú?',
  users: '¿Estás segur@ de que deseas eliminar este usuario?',
  quotes: '¿Estás segur@ de que deseas eliminar esta cotización?',
  cards: '¿Estás segur@ de que deseas eliminar esta categoría?',
  products: '¿Estás segur@ de que deseas eliminar este producto?',
  catalogs: '¿Estás segur@ de que deseas eliminar este catálogo?',
  hero: '¿Estás segur@ de que deseas eliminar esta imagen principal?',
  default: '¿Estás segur@ de que deseas eliminar este elemento?',
  update: '¿Estás segur@ de que deseas actualizar los productos?',
  deleteAllQuotes: '¿Estás segur@ de que deseas eliminar todas las cotizaciones completadas?',
  'our-clients': '¿Estás segur@ de que deseas eliminar esta imagen de cliente?'
}

const titleConfirmsMap: Record<string, string> = {
  menu: 'Eliminar Menú',
  users: 'Eliminar Usuario',
  quotes: 'Eliminar Cotización',
  cards: 'Eliminar Categoría',
  products: 'Eliminar Producto',
  catalogs: 'Eliminar Catálogo',
  default: 'Eliminar Elemento',
  update: 'Actualizar Productos',
  deleteAllQuotes: 'Eliminar Cotizaciones Completadas',
  hero: 'Eliminar Imagen principal',
  'our-clients': 'Eliminar Imagen de Cliente'
}

const messageConfirm = computed(() => {
  const type = itemToConfirmModal?.value?.type || 'default'
  return messageConfirmsMap[type] || messageConfirmsMap.default
})

const titleConfirm = computed(() => {
  const type = itemToConfirmModal?.value?.type || 'default'
  return titleConfirmsMap[type] || titleConfirmsMap.default
})

const activeTabTitle = {
  menu: 'Menú',
  users: 'Usuarios',
  quotes: 'Cotizaciones',
  cards: 'Categorías',
  catalogs: 'Catálogos',
  hero: 'Hero',
  'our-clients': 'Nuestros Clientes'
}

const handleUpdateProducts = () => {
  itemToConfirmModal.value = { id: '', type: 'update' };
  showConfirmModal.value = true;
};

useHead({
  title: computed(() => `${activeTabTitle[route.query.tab as tabs]} Admin – Red Global Promocional` || 'Admin – Red Global Promocional'),
  meta: [
    { name: 'description', content: 'Panel de administración para gestionar menú, usuarios, cotizaciones, categorías y catálogos.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Admin – Red Global Promocional' },
    { property: 'og:description', content: 'Panel de administración para gestionar menú, usuarios, cotizaciones, categorías y catálogos.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:url', content: 'https://redglobalpromocionales.com/admin' }
  ],
  link: [
    { rel: 'canonical', href: 'https://redglobalpromocionales.com/admin' }
  ]
});

watch(() => route.query.tab, (newTab) => {
  if (newTab && ['menu', 'users', 'quotes', 'cards', 'catalogs', 'our-clients'].includes(newTab as tabs)) {
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
      @update-products="handleUpdateProducts"
      @tab-change="handleTabChange"
    />

    <main class="admin-main">
      <AdminHeader
        :active-tab="activeTab"
        :is-admin="isAdmin"
        :disabled="false"
        :hero-count="hero?.length || 0"
        @add-menu="handleAddMenuItem"
        @add-user="handleAddUser"
        @add-card="handleAddCard"
        @add-catalog="handleAddCatalog"
        @delete-all-quote="confirmDeleteQuotes"
        @add-hero="handleAddHero"
        @add-our-clients="handleAddOurClient"
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
            @toggle-status="handleToggleUserStatus"
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
            @download="downloadQuoteSummary"
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

          <HeroSection
            v-if="activeTab === 'hero'"
            :items="hero"
            @edit="handleEditHero"
            @delete="id => handleDeleteClick(id, 'hero')"
          />

          <OurClientsSection
            v-if="activeTab === 'our-clients'"
            :items="ourClients"
            @edit="handleEditOurClient"
            @delete="id => handleDeleteClick(id, 'our-clients')"
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
          :isOpen="showConfirmModal"
          :title="titleConfirm"
          :message="messageConfirm"
          :isLoading="loadingData"
          @confirm="handleConfirmModal"
          @close="handleCancelModal"
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

        <HeroForm
          :isOpen="showHeroModal"
          :hero="editingHero"
          :loading="isLoadingHero"
          @save="handleSaveHero"
          @close="showHeroModal = false"
        />

        <OurClientForm
          :isOpen="showOurClientsModal"
          :ourClient="editingOurClient"
          :loading="isLoadingOurClients"
          @save="handleSaveOurClient"
          @close="showOurClientsModal = false"
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
