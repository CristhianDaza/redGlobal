import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
import { useAuthStore, useUserStore } from '@/store';

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
    component: () => import('../views/NotFoundView.vue'),
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
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated()) {
      next({ name: 'login' })
      return
    }
    const userStore = useUserStore()
    await userStore.getUsers()
    const currentUser = userStore.users.find(u => u.email === authStore.user?.email)

    if (!currentUser?.active) {
      await authStore.logout()
      next({ name: 'login' })
      return
    }
    next()
  } else {
    next()
  }
})

export default router;
