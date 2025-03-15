import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "homeView" */ '../views/HomeView.vue'),
    name: 'home'
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "searchView" */ '../views/SearchView.vue'),
    name: 'search'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  }
})

export default router
