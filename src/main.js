import { createApp } from 'vue'
import router from './router'
import './style.css'
import { createPinia } from 'pinia'
import RedGlobal from './App.vue'

const pinia = createPinia()
const RedGlobalApp = createApp(RedGlobal)
RedGlobalApp.use(pinia)
RedGlobalApp.use(router)
RedGlobalApp.mount('#redGlobal')
