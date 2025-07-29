<template>
  <div class="maintenance-container">
    <div class="maintenance-box">
      <span class="maintenance-icon">🛠️</span>
      <h1>¡Volveremos pronto!</h1>
      <p>
        Estamos realizando tareas de mantenimiento para brindarte una mejor experiencia.<br />
        Gracias por tu paciencia.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.maintenance-container {
  min-height: 100vh;
  background: linear-gradient(145deg, #edf2f7, #e2e8f0);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.maintenance-box {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 1px solid #cbd5e0;
}

.maintenance-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

p {
  font-size: 1.125rem;
  color: #4a5568;
  line-height: 1.6;
}
</style>
