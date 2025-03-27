<script setup lang="ts">
import { onMounted } from 'vue';
import { useMenuStore } from './store';
import { useProductsStore } from './store';
import RgNavbar from './components/UI/RgNavbar.vue';

const storeProducts = useProductsStore();
const menuStore = useMenuStore();

const callAdmin = async (): Promise<void> => {
  await storeProducts.getAllProducts(true);
};

const callMenu = async (): Promise<void> => {
  await menuStore.getMenu();
};

onMounted(() => {
  callAdmin();
  callMenu();
});
</script>

<template>
  <div class="app">
    <RgNavbar />
    <RouterView />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Icons');

:root {
  --primary-color: #333;
  --text-color: #333;
  --background-color: #fff;
  --border-color: #eee;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  background: var(--background-color);
  line-height: 1.5;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

button {
  font-family: inherit;
}

img {
  max-width: 100%;
  height: auto;
}
</style>
