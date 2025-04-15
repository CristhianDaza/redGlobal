<script setup lang="ts">
import { onMounted, defineAsyncComponent, watch } from 'vue';
import { useMenuStore, useProductsStore, useAuthStore, useUserStore } from '@/store';

const RgNavbar = defineAsyncComponent(/* webpackChunkName: "rgNavbar" */() => import('./components/UI/RgNavbar.vue'));
const RgFooter = defineAsyncComponent(/* webpackChunkName: "rgFooter" */() => import('./components/UI/RgFooter.vue'));
const RgScrollToTop = defineAsyncComponent(/* webpackChunkName: "rgScrollToTop" */() => import('./components/UI/RgScrollToTop.vue'));
const NotificationContainer = defineAsyncComponent(/* webpackChunkName: "notificationContainer" */() => import('./components/Notification/NotificationContainer.vue'));
const RgModalApi = defineAsyncComponent(/* webpackChunkName: "rgModalApi" */() => import('./components/UI/RgModalApi.vue'));

const storeProducts = useProductsStore();
const menuStore = useMenuStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const updateCustomColors = () => {
  if (authStore.isAuthenticated()) {
    const currentUser = userStore.users.find(user => user.email === authStore.user?.email);
    if (currentUser) {
      document.documentElement.style.setProperty('--primary-color', currentUser.primaryColor || '#ff4444');
      document.documentElement.style.setProperty('--secondary-color', currentUser.secondaryColor || '#666');
    }
  } else {
    document.documentElement.style.setProperty('--primary-color', '#ff4444');
    document.documentElement.style.setProperty('--secondary-color', '#666');
  }
};

onMounted(() => {
  let executed = false;
  const stopWatch = watch(
  () => authStore.currenLoggingUser,
  async (currentUser) => {
    if (currentUser && !executed) {
      executed = true;
      const isRoleAdmin = currentUser.role === 'admin';

      await Promise.all([
        storeProducts.getAllProducts(isRoleAdmin),
        menuStore.getMenu()
      ]);
      if (authStore.isAuthenticated()) {
        await userStore.getUsers();
        updateCustomColors();
      }
      stopWatch();
    } else if (!currentUser) {
      updateCustomColors();
    }
  },
    { immediate: true }
  );

  authStore.$subscribe(async (_, state) => {
    if (state.user) {
      await userStore.getUsers();
      updateCustomColors();
    } else {
      updateCustomColors();
    }
  });

  userStore.$subscribe(() => {
    updateCustomColors();
  });
});
</script>

<template>
  <div class="app">
    <RgNavbar />
    <RouterView />
    <RgFooter />
    <RgScrollToTop />
    <NotificationContainer />
    <RgModalApi />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Icons');

:root {
  --primary-color: #ff4444;
  --secondary-color: #666;
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

a {
  text-decoration: none;
  color: var(--text-color);
}
</style>
