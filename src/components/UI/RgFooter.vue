<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMenuStore, useAuthStore, useUserStore } from '@/store';
import { useWhatsApp } from '@/composable';
import { CONSTANTS, transformColPhone } from '@/utils';
import mainLogo from '@/assets/images/main-logo.png'
import PrivacyPolicyModal from '@/components/UI/PrivacyPolicyModal.vue';

const menuStore = useMenuStore();
const { menu } = storeToRefs(menuStore);
const { whatsAppLink } = useWhatsApp();

const authStore = useAuthStore();
const userStore = useUserStore();

const versionApp = import.meta.env.VITE_VERSION_APP;

const isLoadingLogo = computed(() => {
  return authStore.isAuthenticated() && userStore.isLoadingUsers;
});

const currentUserLogo = computed((): string | undefined => {
  if (!authStore.isAuthenticated()) {
    return mainLogo;
  }

  if (isLoadingLogo.value) {
    return undefined;
  }

  const currentUser = userStore.users.find(user => user.email === authStore.user?.email?.toLowerCase());
  if (currentUser?.logo) {
    return currentUser.logo;
  }

  return mainLogo;
});

const contactInfo = {
  address: `En <b>RED GLOBAL PROMOCIONAL S.A.S.</b> llevamos 7 años transformando ideas en productos que conectan con las personas. Desde nuestro inicio, nos hemos especializado en ofrecer material promocional de alta calidad, diseñado para fortalecer la presencia de marca de nuestros clientes y generar un impacto memorable. Nuestro compromiso es brindar soluciones creativas, funcionales y personalizadas, adaptadas a las necesidades de cada empresa. Gracias a nuestro equipo apasionado y a una red confiable de aliados, hemos logrado posicionarnos como una opción sólida en el mundo de los promocionales. Más que productos, entregamos experiencias que comunican, fidelizan y dejan huella.`,
  email: 'servicioalcliente@redglobalpromo.com.co',
  phone1: transformColPhone(CONSTANTS.NUMBER_WHATSAPP),
  phone2: '601 703 72 50'
};

const services = [
  'Desarrollo de productos',
  'Venta de material',
  'Impresión litográfica',
  'Decoración institucional'
];

const isPrivacyModalOpen = ref(false);

const openPrivacyModal = () => {
  isPrivacyModalOpen.value = true;
};

const closePrivacyModal = () => {
  isPrivacyModalOpen.value = false;
};
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="company-info">
          <h3>Red Global Promocional</h3>
          <div class="description" v-html="contactInfo.address"></div>
          <div class="contact-details">
            <p><span class="material-icons">email</span>{{ contactInfo.email }}</p>
            <a :href="whatsAppLink" target="_blank">
              <p><span class="material-icons">phone</span>{{ contactInfo.phone1 }}</p>
            </a>
            <p><span class="material-icons">phone</span>{{ contactInfo.phone2 }}</p>
          </div>
        </div>

        <div class="services">
          <h4>¿Qué hacemos?</h4>
          <ul>
            <li v-for="service in services" :key="service">
              {{ service }}
            </li>
          </ul>
        </div>

        <nav class="category">
          <h4>Menú</h4>
          <ul>
            <li v-for="menuItem in menu" :key="menuItem.id">
              <router-link :to="menuItem.path">{{ menuItem.title }}</router-link>
            </li>
            <li>
              <button
                class="privacy-link"
                @click="openPrivacyModal"
                type="button"
              >
                Políticas de Tratamiento de Datos Personales
              </button>
            </li>
          </ul>
        </nav>
        <div class="logo">
          <template v-if="isLoadingLogo">
            <div class="logo-skeleton"></div>
          </template>
          <img v-else :src="currentUserLogo" alt="Logo" />
          <span class="version-app">v{{ versionApp }}</span>
        </div>
      </div>
    </div>
  </footer>
  <div class="footer">
    <p>
      Design by
      <a
        href="https://cris-dev.com/"
        target="_blank"
        rel="noopener noreferrer"
        class="footer__link"
      >
        Cristhian Daza
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="footer__icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5H19.5V10.5M10.5 13.5L19.5 4.5M19.5 4.5L4.5 19.5" />
        </svg>
      </a>
      <span class="footer__heart">💙</span>
    </p>
  </div>
  <PrivacyPolicyModal
    :is-open="isPrivacyModalOpen"
    @close="closePrivacyModal"
  />
</template>

<style scoped>
.version-app {
  font-size: 11px;
  position: absolute;
  bottom: 0;
  color: gray;
  cursor: default;
  user-select: none;
}

.footer {
  background-color: #f8f8f8;
  padding: 4rem 0 1rem;
}

.container {
  width: 90%;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.company-info {
  h3 {
    color: #333;
    font-size: 1.5rem;
    margin: 0 0 1rem;
  }

  p, .description {
    color: #666;
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }

  .contact-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    p, .description {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 0.9rem;

      .material-icons {
        color: var(--primary-color);
        font-size: 1.2rem;
      }
    }
  }
}

.services, .category {
  h4 {
    color: #333;
    font-size: 1.2rem;
    margin: 0 0 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.5rem;
      color: #666;
      font-size: 0.9rem;

      a, .privacy-link {
        color: #666;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: var(--primary-color);
        }
      }

      .privacy-link {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        text-align: left;
        font-size: 0.9rem;
      }
    }
  }
}

.logo {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;

  img {
    height: 60px;
    width: auto;
  }

  .logo-skeleton {
    height: 40px;
    width: 100px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }
}

.footer {
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  padding: 1rem 0;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.footer__link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  color: #374151;
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: #9ca3af;
  transition: color 0.3s ease, text-decoration-color 0.3s ease;
}

.footer__link:hover {
  color: #4f46e5;
  text-decoration-color: #4f46e5;
}

.footer__icon {
  width: 1rem;
  height: 1rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.footer__link:hover .footer__icon {
  opacity: 1;
}

.footer__heart {
  margin-left: 0.25rem;
  color: #3b82f6;
}


@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 0;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .logo {
    order: -1;
    margin-bottom: 1rem;
    img {
      height: 70px;
    }
  }

  .company-info, .services, .category {
    text-align: center;

    .contact-details {
      align-items: center;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;

      li {
        margin: 0;
      }
    }
  }

  .version-app {
    bottom: -590px;
  }
}

@media (max-width: 320px) {
  .version-app {
    bottom: -880px;
  }
}

@media (max-width: 376px) {
  .version-app {
    bottom: -100px;
  }
}

@media (max-width: 426px) {
  .version-app {
    bottom: -780px;
  }
}
</style>
