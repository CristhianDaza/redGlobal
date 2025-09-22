import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
import { useAuthStore, useUserStore } from '@/store';
import { waitUntil } from '@/utils/waitUntil'

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
    meta: { requiresAuth: true }
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

    const currentUser = userStore.users.find(u => u.email === authStore.user?.email?.toLowerCase())
    if (!currentUser?.active) {
      await authStore.logout()
      return next({ name: 'home' })
    }
  }

  next()
})

export default router;
