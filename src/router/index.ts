import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../store/useAuthStore';

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
    beforeEnter: (_to, _from, next) => {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated()) {
        next('/');
      } else {
        next();
      }
    }
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

export default router;
