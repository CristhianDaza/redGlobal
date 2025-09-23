<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore, useProductsStore, useUserStore } from '@/store';
import { useCatalogAdmin, useCategoryAdmin, useMenuAdmin, useQuoteAdmin, useUserAdmin, useCarouselAdmin, useOurClientAdmin, useColorAdmin, useAdvisorsAdmin } from '@/composable';
import { tabs, UserFormData, User } from "@/types/common";
import { useHead } from '@vueuse/head';

const MenuItemForm = defineAsyncComponent(/* webpackChunkName: "menuItemForm" */() => import('@/components/Admin/MenuItemForm.vue'));
const UserForm = defineAsyncComponent(/* webpackChunkName: "userForm" */() => import('@/components/Admin/UserForm.vue'));
const RgConfirmModal = defineAsyncComponent(/* webpackChunkName: "rgConfirmModal" */() => import('@/components/UI/RgConfirmModal.vue'));
const CategoryCardForm = defineAsyncComponent(/* webpackChunkName: "categoryCardForm" */() => import('@/components/Admin/CategoryCardForm.vue'));
const CatalogForm = defineAsyncComponent(/* webpackChunkName: "catalogForm" */() => import('@/components/Admin/CatalogForm.vue'));
const CarouselForm = defineAsyncComponent(/* webpackChunkName: "carouselForm" */() => import('@/components/Admin/CarouselForm.vue'));
const OurClientForm = defineAsyncComponent(/* webpackChunkName: "ourClientForm" */() => import('@/components/Admin/OurClientForm.vue'));
const ColorForm = defineAsyncComponent(/* webpackChunkName: "colorForm" */() => import('@/components/Admin/ColorForm.vue'));
const AdvisorForm = defineAsyncComponent(/* webpackChunkName: "advisorForm" */() => import('@/components/Admin/AdvisorForm.vue'));

const AdminSidebar = defineAsyncComponent(/* webpackChunkName: "adminSidebar" */() => import('@/components/Admin/AdminSidebar.vue'));
const MenuSection = defineAsyncComponent(/* webpackChunkName: "menuSection" */() => import('@/components/Admin/sections/MenuSection.vue'));
const AdminHeader = defineAsyncComponent(/* webpackChunkName: "adminHeader" */() => import('@/components/Admin/AdminHeader.vue'));
const UsersSection = defineAsyncComponent(/* webpackChunkName: "usersSection" */() => import('@/components/Admin/sections/UsersSection.vue'));
const QuotesSection = defineAsyncComponent(/* webpackChunkName: "quotesSection" */() => import('@/components/Admin/sections/QuotesSection.vue'));
const AdvancedQuotesSection = defineAsyncComponent(/* webpackChunkName: "advancedQuotesSection" */() => import('@/components/Admin/sections/AdvancedQuotesSection.vue'));
const CategoriesSection = defineAsyncComponent(/* webpackChunkName: "categoriesSection" */() => import('@/components/Admin/sections/CategoriesSection.vue'));
const QuoteDetailsModal = defineAsyncComponent(/* webpackChunkName: "quoteDetailsModal" */() => import('@/components/Admin/QuoteDetailsModal.vue'));
const AdvancedQuoteDetailsModal = defineAsyncComponent(/* webpackChunkName: "advancedQuoteDetailsModal" */() => import('@/components/Admin/AdvancedQuoteDetailsModal.vue'));
const CatalogsSection = defineAsyncComponent(/* webpackChunkName: "catalogsSection" */() => import('@/components/Admin/sections/CatalogsSection.vue'));
const CarouselSection = defineAsyncComponent(/* webpackChunkName: "carouselSection" */() => import('@/components/Admin/sections/CarouselSection.vue'));
const OurClientsSection = defineAsyncComponent(/* webpackChunkName: "ourClientsSection" */() => import('@/components/Admin/sections/OurClientsSection.vue'));
const ColorSection = defineAsyncComponent(/* webpackChunkName: "colorSection" */() => import('@/components/Admin/sections/ColorSection.vue'));
const AdvisorsSection = defineAsyncComponent(/* webpackChunkName: "advisorsSection" */() => import('@/components/Admin/sections/AdvisorsSection.vue'));

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const storeProducts = useProductsStore();
const userStore = useUserStore();
const isAuthenticated = computed(() => authStore.isAuthenticated());

const activeTab = ref<tabs>('advanced-quotes');

const handleTabChange = (tab: tabs) => {
  router.push({ query: { tab } });
  activeTab.value = tab;
};

const currentUser = computed(():UserFormData | undefined => {
  return users.value.find(u => u.email === authStore.user?.email?.toLowerCase());
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
  deleteUser,
  sendPasswordReset
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

// Estados para el sistema avanzado de cotizaciones
const showAdvancedQuoteModal = ref(false);
const selectedAdvancedQuote = ref<any>(null);

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
  isLoadingCarousel,
  showCarouselModal,
  editingCarousel,
  carousel,
  loadCarousel,
  handleAddCarousel,
  handleEditCarousel,
  handleSaveCarousel,
  deleteCarousel,
} = useCarouselAdmin();

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

const {
  isLoadingColor,
  showColorModal,
  editingColor,
  color,
  loadColor,
  handleAddColor,
  handleEditColor,
  handleSaveColor,
  deleteColor
} = useColorAdmin();

const {
  isLoadingAdvisor,
  showAdvisorModal,
  editingAdvisor,
  advisors,
  loadAdvisors,
  handleAddAdvisor,
  handleEditAdvisor,
  handleSaveAdvisor,
  deleteAdvisor
} = useAdvisorsAdmin();

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
      case 'carousel':
        await deleteCarousel(itemToConfirmModal.value.id);
        break;
      case 'our-clients':
        await deleteOurClient(itemToConfirmModal.value.id);
        break;
      case 'color':
        await deleteColor(itemToConfirmModal.value.id);
        break;
      case 'advisors':
        await deleteAdvisor(itemToConfirmModal.value.id);
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
    case 'advanced-quotes': return false; // El loading se maneja internamente en el composable
    case 'cards': return isLoadingCard.value;
    case 'catalogs': return isLoadingCatalog.value;
    case 'carousel': return isLoadingCarousel.value;
    case 'our-clients': return isLoadingOurClients.value;
    case 'color': return isLoadingColor.value;
    case 'advisors': return isLoadingAdvisor.value;
    default: return false;
  }
});

onMounted(async () => {
  try {
    const initializeCorrectTab = () => {
      const queryTab = route.query.tab as tabs;
      const validTabs = ['menu', 'users', 'quotes', 'advanced-quotes', 'cards', 'catalogs', 'carousel', 'our-clients', 'color', 'advisors'];
      
      if (queryTab && validTabs.includes(queryTab)) {
        if (isAdmin.value) {
          activeTab.value = queryTab;
          return;
        }
        activeTab.value = 'advanced-quotes';
        if (queryTab !== 'advanced-quotes') {
          router.replace({ query: { tab: 'advanced-quotes' } });
        }
        return;
      }
      
      activeTab.value = 'advanced-quotes';
      router.replace({ query: { tab: 'advanced-quotes' } });
    };

    if (isAdmin.value) {
      await Promise.all([
        loadMenu(),
        loadUsers(),
        loadQuotes(),
        loadCategoryCards(),
        loadCatalogs(),
        loadCarousel(),
        loadOurClients(),
        loadColor(),
        loadAdvisors(),
      ]);

      if (route.query.quoteId) {
        const quoteId = route.query.quoteId as string;
        // Verificar si estamos en la sección de cotizaciones avanzadas
        if (activeTab.value === 'advanced-quotes') {
          await handleOpenAdvancedQuoteFromUrl(quoteId);
        } else {
          // Fallback para cotizaciones normales (si aún existen)
          await handleOpenQuoteDetails(quoteId);
        }
      }
    } else {
      await loadQuotes();
    }

    initializeCorrectTab();
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
});

watch(activeTab, (newTab) => {
  const validTabs = ['menu', 'users', 'quotes', 'advanced-quotes', 'cards', 'catalogs', 'carousel', 'our-clients', 'color', 'advisors'];
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
  carousel: '¿Estás segur@ de que deseas eliminar este elemento del carrusel?',
  default: '¿Estás segur@ de que deseas eliminar este elemento?',
  update: '¿Estás segur@ de que deseas actualizar los productos?',
  deleteAllQuotes: '¿Estás segur@ de que deseas eliminar todas las cotizaciones completadas?',
  'our-clients': '¿Estás segur@ de que deseas eliminar esta imagen de cliente?',
  color: '¿Estás segur@ de que deseas eliminar este color principal?',
  advisors: '¿Estás segur@ de que deseas eliminar este asesor?',
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
  carousel: 'Eliminar Elemento del Carrusel',
  'our-clients': 'Eliminar Imagen de Cliente',
  color: 'Eliminar Color Principal',
  advisors: 'Eliminar Asesor',
}

const messageConfirm = computed(() => {
  const type = itemToConfirmModal?.value?.type || 'default'
  return messageConfirmsMap[type] || messageConfirmsMap.default
})

const titleConfirm = computed(() => {
  const type = itemToConfirmModal?.value?.type || 'default'
  return titleConfirmsMap[type] || titleConfirmsMap.default
})

const activeTabTitle: Record<tabs, string> = {
  menu: 'Menú',
  users: 'Usuarios',
  quotes: 'Cotizaciones',
  'advanced-quotes': 'Cotizaciones',
  cards: 'Categorías',
  catalogs: 'Catálogos',
  carousel: 'Carrusel',
  'our-clients': 'Nuestros Clientes',
  color: 'Color Principal',
  advisors: 'Asesores',
}

const handleUpdateProducts = () => {
  itemToConfirmModal.value = { id: '', type: 'update' };
  showConfirmModal.value = true;
};

// Funciones para el sistema avanzado de cotizaciones
const handleViewAdvancedQuote = (quote: any) => {
  selectedAdvancedQuote.value = quote;
  showAdvancedQuoteModal.value = true;
  // Actualizar URL con quoteId
  router.push({ 
    query: { 
      ...route.query, 
      quoteId: quote.id 
    } 
  });
};

const handleCloseAdvancedQuoteModal = () => {
  showAdvancedQuoteModal.value = false;
  selectedAdvancedQuote.value = null;
  // Limpiar quoteId de la URL
  const newQuery = { ...route.query };
  delete newQuery.quoteId;
  router.push({ query: newQuery });
};

const handleUpdateQuoteStatus = async (data: { quoteId: string, status: any, notes?: string }) => {
  // Esta función será manejada por el composable useAdvancedQuotes
  console.log('Update quote status:', data);
};

const handleAddQuoteComment = async (data: { quoteId: string, comment: string, isInternal: boolean }) => {
  try {
    // Importar el composable de cotizaciones avanzadas
    const { addQuoteComment } = await import('@/composable/admin/useAdvancedQuotes').then(m => m.useAdvancedQuotes());
    
    await addQuoteComment(data.quoteId, data.comment, data.isInternal);
    
    // Actualizar la cotización seleccionada si es la misma
    if (selectedAdvancedQuote.value && selectedAdvancedQuote.value.id === data.quoteId) {
      const { quotes } = await import('@/composable/admin/useAdvancedQuotes').then(m => m.useAdvancedQuotes());
      const updatedQuote = quotes.value.find(q => q.id === data.quoteId);
      if (updatedQuote) {
        selectedAdvancedQuote.value = { ...updatedQuote }; // Crear nueva referencia para forzar reactividad
      }
    }
  } catch (error) {
    console.error('Error adding quote comment:', error);
  }
};

const handleDeleteQuoteComment = async (data: { quoteId: string, commentIndex: number }) => {
  try {
    // Importar el composable de cotizaciones avanzadas
    const { deleteQuoteComment } = await import('@/composable/admin/useAdvancedQuotes').then(m => m.useAdvancedQuotes());
    
    await deleteQuoteComment(data.quoteId, data.commentIndex);
    
    // Actualizar la cotización seleccionada si es la misma
    if (selectedAdvancedQuote.value && selectedAdvancedQuote.value.id === data.quoteId) {
      const { quotes } = await import('@/composable/admin/useAdvancedQuotes').then(m => m.useAdvancedQuotes());
      const updatedQuote = quotes.value.find(q => q.id === data.quoteId);
      if (updatedQuote) {
        selectedAdvancedQuote.value = { ...updatedQuote }; // Crear nueva referencia para forzar reactividad
      }
    }
  } catch (error) {
    console.error('Error deleting quote comment:', error);
  }
};

const handleUpdateQuoteField = async (data: { quoteId: string, field: string, value: any }) => {
  // Esta función será manejada por el composable useAdvancedQuotes
  console.log('Update quote field:', data);
};

// Función para abrir cotización desde URL
const handleOpenAdvancedQuoteFromUrl = async (quoteId: string) => {
  try {
    // Importar el composable de cotizaciones avanzadas
    const { quotes, loadQuotes } = await import('@/composable/admin/useAdvancedQuotes').then(m => m.useAdvancedQuotes());
    
    // Asegurar que las cotizaciones estén cargadas
    if (quotes.value.length === 0) {
      await loadQuotes();
    }
    
    // Buscar la cotización por ID
    const quote = quotes.value.find(q => q.id === quoteId);
    
    if (quote) {
      selectedAdvancedQuote.value = quote;
      showAdvancedQuoteModal.value = true;
    } else {
      console.warn(`No se encontró la cotización con ID: ${quoteId}`);
      // Limpiar el quoteId de la URL si no se encuentra
      const newQuery = { ...route.query };
      delete newQuery.quoteId;
      router.replace({ query: newQuery });
    }
  } catch (error) {
    console.error('Error al abrir cotización desde URL:', error);
  }
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
  if (newTab && ['menu', 'users', 'quotes', 'advanced-quotes', 'cards', 'catalogs', 'carousel','our-clients', 'color', 'advisors'].includes(newTab as tabs)) {
    activeTab.value = newTab as tabs;
  }
});

// Watcher para detectar cambios en quoteId en la URL
watch(() => route.query.quoteId, async (newQuoteId, oldQuoteId) => {
  if (newQuoteId && newQuoteId !== oldQuoteId && activeTab.value === 'advanced-quotes') {
    await handleOpenAdvancedQuoteFromUrl(newQuoteId as string);
  } else if (!newQuoteId && showAdvancedQuoteModal.value) {
    // Si se quita el quoteId de la URL, cerrar el modal
    showAdvancedQuoteModal.value = false;
    selectedAdvancedQuote.value = null;
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
        :colorCount="color.length"
        :active-tab="activeTab"
        :is-admin="isAdmin"
        @add-menu="handleAddMenuItem"
        @add-user="handleAddUser"
        @add-card="handleAddCard"
        @add-catalog="handleAddCatalog"
        @delete-all-quote="confirmDeleteQuotes"
        @add-carousel="handleAddCarousel"
        @add-our-clients="handleAddOurClient"
        @add-color="handleAddColor"
        @add-advisor="handleAddAdvisor"
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
            @reset-password="sendPasswordReset"
          />

          <AdvancedQuotesSection
            v-else-if="activeTab === 'advanced-quotes'"
            @view="handleViewAdvancedQuote"
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

          <CarouselSection
            v-if="activeTab === 'carousel'"
            :items="carousel"
            @edit="handleEditCarousel"
            @delete="id => handleDeleteClick(id, 'carousel')"
          />

          <OurClientsSection
            v-if="activeTab === 'our-clients'"
            :items="ourClients"
            @edit="handleEditOurClient"
            @delete="id => handleDeleteClick(id, 'our-clients')"
          />

          <ColorSection
            v-if="activeTab === 'color'"
            :items="color"
            @edit="handleEditColor"
            @delete="id => handleDeleteClick(id, 'color')"
          />

          <AdvisorsSection
            v-if="activeTab === 'advisors'"
            :items="advisors"
            @edit="handleEditAdvisor"
            @delete="id => handleDeleteClick(id, 'advisors')"
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

        <AdvancedQuoteDetailsModal
          :quote="selectedAdvancedQuote"
          :is-visible="showAdvancedQuoteModal"
          @close="handleCloseAdvancedQuoteModal"
          @updateStatus="handleUpdateQuoteStatus"
          @addComment="handleAddQuoteComment"
          @deleteComment="handleDeleteQuoteComment"
          @updateField="handleUpdateQuoteField"
        />

        <CarouselForm
          :isOpen="showCarouselModal"
          :carousel="editingCarousel"
          :loading="isLoadingCarousel"
          @save="handleSaveCarousel"
          @close="showCarouselModal = false"
        />

        <OurClientForm
          :isOpen="showOurClientsModal"
          :ourClient="editingOurClient"
          :loading="isLoadingOurClients"
          @save="handleSaveOurClient"
          @close="showOurClientsModal = false"
        />

        <ColorForm
          :isOpen="showColorModal"
          :color="editingColor"
          :loading="isLoadingColor"
          @save="handleSaveColor"
          @close="showColorModal = false"
        />

        <AdvisorForm
          :isOpen="showAdvisorModal"
          :advisor="editingAdvisor"
          :loading="isLoadingAdvisor"
          @save="handleSaveAdvisor"
          @close="showAdvisorModal = false"
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
