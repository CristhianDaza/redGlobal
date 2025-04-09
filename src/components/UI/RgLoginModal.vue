<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '../../store/useAuthStore';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits(['close']);
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

// Limpiar el formulario cuando se cierra el modal
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    email.value = '';
    password.value = '';
    errorMessage.value = '';
  }
});

// Observar cambios en la autenticación
watch(() => authStore.isAuthenticated(), (isAuthenticated) => {
  if (isAuthenticated) {
    emit('close');
  }
});

const closeModal = () => {
  emit('close');
};

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, completa todos los campos';
    return;
  }

  try {
    const success = await authStore.login(email.value, password.value);
    
    if (!success) {
      errorMessage.value = authStore.error || 'Error al iniciar sesión';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al iniciar sesión';
  }
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content" :class="{ 'modal-open': isOpen }">

      <div class="modal-header">
        <h2>Iniciar Sesión</h2>
        <button class="close-button" @click="closeModal">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email"
              placeholder="Ingresa tu email"
              :disabled="authStore.loading"
            />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              v-model="password"
              placeholder="Ingresa tu contraseña"
              :disabled="authStore.loading"
            />
          </div>
          <button 
            type="submit" 
            class="login-button"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? 'Iniciando sesión...' : 'Ingresar' }}
          </button>
        </form>
      </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
  opacity: 0;
  transition: all 0.3s ease-out;
}

.modal-content.modal-open {
  transform: scale(1);
  opacity: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s ease;
}

.close-button:hover {
  transform: rotate(90deg);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.login-button {
  width: 100%;
  padding: 0.85rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.login-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease-out, height 0.3s ease-out;
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 86, 179, 0.2);
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  border: 1px solid #fed7d7;
}

.login-button:active {
  transform: translateY(0);
}

.login-button:hover::after {
  width: 300px;
  height: 300px;
}

/* Animaciones de transición */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
