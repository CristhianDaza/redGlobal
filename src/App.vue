<script setup lang="ts">
import { onMounted, defineAsyncComponent, watch } from 'vue';
import { useMenuStore, useProductsStore, useAuthStore, useUserStore, useLoaderStore, useMaintenanceStore, useColorStore } from '@/store';

const RgNavbar = defineAsyncComponent(/* webpackChunkName: "rgNavbar" */() => import('./components/UI/RgNavbar.vue'));
const RgFooter = defineAsyncComponent(/* webpackChunkName: "rgFooter" */() => import('./components/UI/RgFooter.vue'));
const RgScrollToTop = defineAsyncComponent(/* webpackChunkName: "rgScrollToTop" */() => import('./components/UI/RgScrollToTop.vue'));
const NotificationContainer = defineAsyncComponent(/* webpackChunkName: "notificationContainer" */() => import('./components/Notification/NotificationContainer.vue'));
const RgModalApi = defineAsyncComponent(/* webpackChunkName: "rgModalApi" */() => import('./components/UI/RgModalApi.vue'));
const RgWhatsApp = defineAsyncComponent(/* webpackChunkName: "rgWhatsApp" */() => import('./components/UI/RgWhatsApp.vue'));
const RgLoaderGlobal = defineAsyncComponent(/* webpackChunkName: "rgLoaderGlobal" */() => import('./components/UI/RgLoaderGlobal.vue'));
const RgMaintenance = defineAsyncComponent(/* webpackChunkName: "RgMaintenance" */() => import('./components/UI/RgMaintenance.vue'));

const storeProducts = useProductsStore();
const menuStore = useMenuStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const loaderStore = useLoaderStore();
const maintenanceStore = useMaintenanceStore();
const colorStore = useColorStore();

const updateCustomColors = () => {
  const fallbackColor = '#ff4444';
  const storeColor = colorStore.color?.[0]?.hex || fallbackColor;

  if (authStore.isAuthenticated()) {
    const currentUser = userStore.users.find(user => user.email === authStore.user?.email);

    const userColor = currentUser?.primaryColor || storeColor;

    document.documentElement.style.setProperty('--primary-color', userColor);
    document.documentElement.style.setProperty('--secondary-color', currentUser?.secondaryColor || '#666');
  } else {
    document.documentElement.style.setProperty('--primary-color', storeColor);
    document.documentElement.style.setProperty('--secondary-color', '#666');
  }
};


onMounted(async () => {
  loaderStore.showLoader();

  await maintenanceStore.getMaintenanceMode();
  if (maintenanceStore.isMaintenanceMode) {
    loaderStore.hideLoader();
    return;
  }
  await colorStore.getColor();

  await new Promise<void>((resolve) => {
    if (!authStore.loading) {
      resolve();
      return;
    }

    const stop = watch(
      () => authStore.loading,
      (loading) => {
        if (loading === false) {
          stop();
          resolve();
        }
      },
      { immediate: true }
    );
  });

  if (authStore.isAuthenticated()) {
    await userStore.getUsers();
  }

  updateCustomColors();

  if (!menuStore.menu || menuStore.menu.length === 0) {
    await menuStore.getMenu();
  }

  const currentUser = authStore.currenLoggingUser;
  const isAdmin = currentUser?.role === 'admin';
  const productsEmpty = !storeProducts.products?.length;

  if (isAdmin || productsEmpty) {
    await storeProducts.getAllProducts(isAdmin);
  }

  loaderStore.hideLoader();
});
</script>

<template>
  <RgLoaderGlobal v-if="loaderStore.isLoading || authStore.loading || maintenanceStore.isLoading" />
  <RgMaintenance v-else-if="maintenanceStore.isMaintenanceMode" />
  <div v-else>
    <div class="app">
      <RgNavbar />
      <RouterView />
      <RgFooter />
      <RgScrollToTop />
      <NotificationContainer />
      <RgModalApi />
      <RgWhatsApp />
    </div>
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
