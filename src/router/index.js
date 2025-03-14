import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
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
