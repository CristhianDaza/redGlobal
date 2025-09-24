import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
import { useAuthStore, useUserStore } from '@/store';
import { waitUntil } from '@/utils/waitUntil'
import { usersFirebase } from '@/services/firebase/usersFirebase'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "homeView" */ '../views/HomeView.vue'),
    name: 'home'
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "searchView" */ '../views/SearchView.vue'),
    name: 'search'
  },
  {
    path: '/products',
    component: () => import(/* webpackChunkName: "productsView" */ '../views/ProductsView.vue'),
    name: 'products'
  },
  {
    path: '/products/:id',
    component: () => import(/* webpackChunkName: "productView" */ '../views/ProductView.vue'),
    name: 'product'
  },
  {
    path: '/catalogs',
    component: () => import(/* webpackChunkName: "catalogsView" */ '../views/CatalogsView.vue'),
    name: 'catalogs'
  },
  {
    path: '/about-us',
    component: () => import(/* webpackChunkName: "missionVisionView" */ '../views/MissionVisionView.vue'),
    name: 'about-us'
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "adminView" */ '../views/AdminView.vue'),
    name: 'admin',
    meta: { requiresAuth: true, allowedRoles: ['admin', 'advisor'] }
  },
  {
    path: '/admin/privacy-policy',
    component: () => import(/* webpackChunkName: "adminView" */ '../views/AdminView.vue'),
    name: 'admin-privacy-policy',
    meta: { requiresAuth: true, allowedRoles: ['admin'] }
  },
  {
    path: '/admin/mission-vision',
    component: () => import(/* webpackChunkName: "adminView" */ '../views/AdminView.vue'),
    name: 'admin-mission-vision',
    meta: { requiresAuth: true, allowedRoles: ['admin'] }
  },
  {
    path: '/admin/quotes/:id',
    component: () => import(/* webpackChunkName: "quoteDetailView" */ '../views/QuoteDetailView.vue'),
    name: 'quote-detail',
    meta: { requiresAuth: true, allowedRoles: ['admin', 'advisor'] }
  },
  {
    path: '/contact',
    component: () => import(/* webpackChunkName: "contactView" */ '../views/ContactView.vue'),
    name: 'contact'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import(/* webpackChunkName: "NotFoundView" */ '../views/NotFoundView.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  }
});

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  await waitUntil(() => authStore.loading === false)

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated()) {
      return next({ name: 'home' })
    }

    if (userStore.users.length === 0) {
      await userStore.getUsers()
    }

    let currentUser = userStore.users.find(u => u.email === authStore.user?.email?.toLowerCase())

    // Intentar con tempHiddenUser si no se encontró en la lista visible
    if (!currentUser && authStore.tempHiddenUser) {
      currentUser = authStore.tempHiddenUser
    }

    // Búsqueda adicional en Firestore incluyendo ocultos si aún no se encontró
    if (!currentUser && authStore.user?.email) {
      try {
        const allUsers = await usersFirebase.getUsers(true)
        currentUser = allUsers.find(u => u.email === authStore.user!.email!.toLowerCase())
      } catch (e) {
        // si falla, continuar y permitir flujo (no forzar logout inmediato)
      }
    }

    // Solo forzar logout si se encontró usuario y está explícitamente inactivo
    if (currentUser && currentUser.active === false) {
      await authStore.logout()
      return next({ name: 'home' })
    }

    // Si no se encontró usuario pero el auth ya pasó, permitir navegación (usuario oculto recién creado)

    if (to.meta.allowedRoles && Array.isArray(to.meta.allowedRoles)) {
      const roleToCheck = currentUser?.role || authStore.userRole // fallback
      if (!roleToCheck || !to.meta.allowedRoles.includes(roleToCheck)) {
        return next({ name: 'home' })
      }
    }
  }

  next()
})

export default router;
