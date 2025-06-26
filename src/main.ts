import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import router from './router';
import './style.css';
import { createPinia } from 'pinia';
import RedGlobal from './App.vue';

const pinia = createPinia();
const RedGlobalApp = createApp(RedGlobal);
const head = createHead();

RedGlobalApp.use(pinia);
RedGlobalApp.use(router);
RedGlobalApp.use(head);

RedGlobalApp.mount('#redGlobal');
