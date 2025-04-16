import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store';

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
    path: '/admin',
    component: () => import(/* webpackChunkName: "adminView" */ '../views/AdminView.vue'),
    name: 'admin',
    meta: { requiresAuth: true }
  },
  {
    path: '/contact',
    component: () => import(/* webpackChunkName: "contactView" */ '../views/ContactView.vue'),
    name: 'contact'
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

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = authStore.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    return next('/')
  }

  if (to.name === 'admin') {
    const tab = to.query.tab
    const allowedTabsForClient = ['quotes']
    const allTabs = ['menu', 'users', 'cards', 'quotes', 'catalogs']

    if (tab && !allTabs.includes(tab as string)) {
      return next({ name: 'admin', query: { tab: 'quotes' } })
    }

    if (!authStore.isAdmin && tab && !allowedTabsForClient.includes(tab as string)) {
      return next({ name: 'admin', query: { tab: 'quotes' } })
    }
  }
  next()
})


export default router;
