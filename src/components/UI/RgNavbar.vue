<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-menu">
        <button 
          class="menu-item"
          v-for="({id, title, name}) in menuStore.getMenuItems" 
          :key="id"
          @click="handleMenuClick(name)"
        >
          {{ title }}
        </button>
      </div>
      <div class="navbar-actions">
        <p><span class="material-icons">phone</span> (+57) 312 345 6789</p>
      </div>
    </div>
  </nav>

  <div class="navbar-brand">
    <img src="https://www.redglobalpromo.com.co/wp-content/uploads/2019/07/Logoheader-1.png" alt="Logo" class="logo">
    <div class="search-container">
      <input type="text" placeholder="Buscar productos...." class="login-input" v-model="searchQuery" @keyup.enter="handleSearch">
      <TvButton
        @click="handleSearch"
        type="icon"
        icon="search"
      />
    </div>
    <p><span class="material-icons">person</span> Iniciar Sesion</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMenuStore } from '../../store/useMenuStore';
import { useRouter } from 'vue-router';
import TvButton from '@todovue/tvbutton';

const router = useRouter();
const menuStore = useMenuStore();
const searchQuery = ref('');

const handleMenuClick = async (menuName: string) => {
  router.push({ name: menuName });
};

const handleSearch = () => {
  console.log('Buscando:', searchQuery.value);
  router.push({ name: 'search', query: { search: searchQuery.value } });
};
</script>

<style scoped>
.navbar {
  /* position: sticky; */
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  margin: 0 2rem;
  padding: .5rem;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  height: 40px;
  width: auto;
}

.navbar-menu {
  flex: 1;
  display: flex;
  gap: 2rem;
  font-weight: 800;
}

.menu-item {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s ease;
  position: relative;
}

.menu-item:hover {
  color: #000;
}

.menu-item:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1rem;
  right: 1rem;
  height: 2px;
  background: currentColor;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;

  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    color: #666;

    .material-icons {
      font-size: 18px;
      color: #ff4444;
    }
  }
}

.search-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: color 0.2s ease;
}

.search-button:hover {
  color: #000;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
  z-index: 1001;
}

.search-container {
  width: 100%;
  max-width: 600px;
  position: relative;
  padding: 0 2rem;
}

.search-container input {
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  border: none;
  border-bottom: 2px solid #333;
  background: transparent;
  outline: none;
}

.close-search {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #333;
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }

  .navbar-container {
    padding: 0.5rem 1rem;
  }

  .logo {
    height: 32px;
  }
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  margin: 0.5rem 1rem;
  padding: 1rem 2rem 0;
  flex-wrap: wrap;

  .search-container {
    display: flex;
    align-items: stretch;
    flex: 1;
    min-width: 280px;
    max-width: 500px;
  }

  .login-input {
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-right: none;
    border-radius: 4px 0 0 4px;
    width: 100%;
    font-size: 14px;
    color: #666;
    background-color: #f8f8f8;
    outline: none;
    transition: border-color 0.2s ease;
    margin-right: -30px;
    border-radius: 50px;

    &:focus {
      border-color: #ff4444;
    }

    &::placeholder {
      color: #999;
    }
  }

  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s ease;
    white-space: nowrap;

    .material-icons {
      font-size: 18px;
      color: #ff4444;
    }

    &:hover {
      color: #ff4444;
    }
  }

  .logo {
    height: 40px;
    width: auto;
  }
}

@media (max-width: 768px) {
  .navbar-brand {
    gap: 0.5rem;
    padding: 1rem;
    justify-content: center;

    .search-container {
      order: 3;
      min-width: 100%;
      margin-top: 1rem;
    }

    .logo {
      height: 32px;
    }

    p {
      font-size: 12px;
    }
  }
}
</style>
