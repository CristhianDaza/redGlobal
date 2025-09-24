<script setup lang="ts">
import { onMounted, defineAsyncComponent, watch } from 'vue';
import { useAuthStore, useColorStore, useLoaderStore, useMaintenanceStore, useMenuStore, useProductsStore, useUserStore } from '@/store';
import { logger, preloadService } from '@/services';

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
    const currentUser = userStore.users.find(user => user.email === authStore.user?.email?.toLowerCase());

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

  try {
    await maintenanceStore.getMaintenanceMode();
    if (maintenanceStore.isMaintenanceMode) {
      loaderStore.hideLoader();
      return;
    }

    const [colorResult, authResult] = await Promise.allSettled([
      colorStore.getColor(),
      new Promise<void>((resolve) => {
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
      })
    ]);

    if (colorResult.status === 'rejected') {
      logger.error('Color store initialization failed', 'App.vue', colorResult.reason);
    }
    if (authResult.status === 'rejected') {
      logger.error('Auth initialization failed', 'App.vue', authResult.reason);
    }

    const loadPromises: Promise<any>[] = [];
    
    if (!menuStore.menu || menuStore.menu.length === 0) {
      loadPromises.push(menuStore.getMenu());
    }

    if (authStore.isAuthenticated()) {
      loadPromises.push(userStore.getUsers());
    }
    await Promise.allSettled(loadPromises);

    updateCustomColors();

    const currentUser = authStore.currenLoggingUser;
    const isAdmin = currentUser?.role === 'admin';
    const productsEmpty = !storeProducts.products?.length;

    if (productsEmpty) {
      await storeProducts.getAllProducts(isAdmin);
    } else if (isAdmin) {
      const shouldUpdate = await storeProducts.checkShouldUpdate();
      if (shouldUpdate) {
        await storeProducts.callServices();
      }
    }

    if (storeProducts.products?.length) {
      const productImages = storeProducts.products
        .slice(0, 12)
        .map(p => p.mainImage)
        .filter(Boolean);
      
      const categoryImages: string[] = [];
      
      preloadService.preloadCriticalImages([], categoryImages)
        .then(() => preloadService.preloadProductImages(productImages))
        .catch(error => logger.warn('Image preload failed', 'App.vue', error));
    }

  } catch (error) {
    logger.fatal('Critical error during app initialization', 'App.vue', error);
  } finally {
    loaderStore.hideLoader();
  }
});

watch(
  () => authStore.user,
  () => {
    updateCustomColors();
  }
);

watch(
  () => userStore.users,
  () => {
    updateCustomColors();
  },
  { deep: true }
);

watch(
  () => colorStore.color,
  () => {
    updateCustomColors();
  },
  { deep: true }
);
</script>

<template>
  <RgModalApi />
  <RgLoaderGlobal v-if="loaderStore.isLoading || authStore.loading || maintenanceStore.isLoading" />
  <RgMaintenance v-else-if="maintenanceStore.isMaintenanceMode" />
  <div v-else>
    <div class="app">
      <RgNavbar />
      <RouterView />
      <RgFooter />
      <RgScrollToTop />
      <NotificationContainer />
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
