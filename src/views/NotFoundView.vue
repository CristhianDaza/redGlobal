<template>
  <div class="notfound-container">
    <div class="notfound-content">
      <div class="notfound-emoji">🚫</div>
      <h1 class="notfound-title">404</h1>
      <h2 class="notfound-subtitle">Página no encontrada</h2>
      <p class="notfound-message">
        Ups, la página que buscas no existe o fue movida.<br>
        Puedes volver al <router-link class="notfound-link" to="/">inicio</router-link> o explorar el catálogo.
      </p>
      <router-link :to="{name: 'catalogs'}" class="notfound-btn">Ver catálogos</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.notfound-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f7fafc 0%, #e3eafc 100%);
}
.notfound-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.07);
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  text-align: center;
  max-width: 400px;
}
.notfound-emoji {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}
.notfound-title {
  font-size: 4rem;
  font-weight: 800;
  margin: 0;
  color: var(--primary-color, #388e3c);
}
.notfound-subtitle {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #444;
}
.notfound-message {
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}
.notfound-link {
  color: var(--primary-color, #388e3c);
  text-decoration: underline;
  font-weight: 500;
}
.notfound-btn {
  display: inline-block;
  background: var(--primary-color, #388e3c);
  color: #fff;
  border-radius: 8px;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(44,62,80,0.06);
  transition: background 0.2s;
}
.notfound-btn:hover {
  background: var(--primary-color, #388e3c);
}
</style>
