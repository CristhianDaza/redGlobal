<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMenuStore, useAuthStore, useUserStore } from '@/store';
import mainLogo from '@/assets/images/main-logo.png'

const menuStore = useMenuStore();
const { menu } = storeToRefs(menuStore);

const authStore = useAuthStore();
const userStore = useUserStore();

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

  const currentUser = userStore.users.find(user => user.email === authStore.user?.email);
  if (currentUser?.logo) {
    return currentUser.logo;
  }

  return mainLogo;
});

const contactInfo = {
  address: 'Somos una compañía que cuenta con más de 25 años de experiencia en el mercado Publicitario; impulsamos y proyectamos las marcas de nuestros clientes para que tengan un gran impacto; contamos con un equipo de trabajo competitivo, humano e innovador. Poseemos red de distribución a nivel nacional e internacional, manejamos costos competitivos y nos caracterizamos siempre por la calidad, cumplimiento y confiabilidad.',
  email: 'servicioalcliente@redglobalpromo.com.co',
  phone1: '(+57) 320 835 4041',
  phone2: '601 236 0535'
};

const services = [
  'Desarrollo de productos',
  'Venta de material',
  'Impresión litográfica',
  'Decoración institucional'
];
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="company-info">
          <h3>Red Global Promocional</h3>
          <p>{{ contactInfo.address }}</p>
          <div class="contact-details">
            <p><span class="material-icons">email</span>{{ contactInfo.email }}</p>
            <a
                href="https://api.whatsapp.com/send?phone=573208354041&text=Hola,%20vengo%20de%20la%20p%C3%A1gina%20web%20y%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20sus%20productos"
                target="_blank"
            >
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
          </ul>
        </nav>

        <div class="logo">
          <template v-if="isLoadingLogo">
            <div class="logo-skeleton"></div>
          </template>
          <img v-else :src="currentUserLogo" alt="Logo" />
        </div>
      </div>
    </div>
  </footer>
  <div class="footer-bottom">
    <p>Design by <a href="https://co.linkedin.com/in/cristhiandaza" target="_blank" rel="noopener noreferrer">Cristhian Daza</a> With <span class="heart">💙</span></p>
  </div>
</template>

<style scoped>
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

  p {
    color: #666;
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }

  .contact-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    p {
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

      a {
        color: #666;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
}

.logo {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  img {
    height: 40px;
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

.footer-bottom {
  border-top: 1px solid #eee;
  padding: 1rem 0;
  text-align: center;
  color: #999;
  font-size: 0.9rem;

  a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #ff4444;
    }
  }

  .heart {
    display: inline-block;
    margin: 0 2px;
    animation: heartBeat 1s infinite;
  }
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .logo {
    order: -1;
    margin-bottom: 1rem;
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
}
</style>
