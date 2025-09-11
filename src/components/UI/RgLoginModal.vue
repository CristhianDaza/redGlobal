<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useAuthStore } from '@/store';
import RgButton from '@/components/UI/RgButton.vue';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits(['close']);
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    email.value = '';
    password.value = '';
    errorMessage.value = '';
  }
});

watch(() => authStore.isAuthenticated(), (isAuthenticated) => {
  if (isAuthenticated) {
    emit('close');
  }
});

const closeModal = () => {
  emit('close');
};

const modalRef = ref<HTMLDivElement>();

watch(() => props.isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden';
    // Focus the modal for keyboard events
    setTimeout(() => {
      modalRef.value?.focus();
    }, 100);
  } else {
    document.body.style.overflow = '';
  }
})

onUnmounted(() => {
  document.body.style.overflow = '';
})

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
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div 
        ref="modalRef"
        class="modal-content" 
        :class="{ 'modal-open': isOpen }"
        tabindex="-1"
        @keydown.esc="closeModal"
      >

      <div class="modal-header">
        <div class="logo-section">
          <img src="@/assets/images/main-logo.png" alt="Red Global Promocional" class="company-logo" />
          <h2>Iniciar Sesión</h2>
        </div>
        <button class="close-button" @click="closeModal">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent>
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
          <RgButton
            type="default"
            :text="authStore.loading ? 'Iniciando sesión...' : 'Ingresar'"
            :disabled="authStore.loading"
            :custom-style="{
              backgroundColor: 'var(--primary-color, #ff4444)',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '500'
            }"
            full
            @click="handleSubmit"
          />
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
  background: color-mix(in srgb, var(--primary-color) 15%, transparent);
  backdrop-filter: blur(12px) saturate(1.3) brightness(0.9);
  -webkit-backdrop-filter: blur(12px) saturate(1.3) brightness(0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 2.5rem;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: scale(0.95);
  opacity: 0;
  transition: all 0.3s ease-out;
  animation: slideIn 0.3s ease-out;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  outline: none;
}

.modal-content.modal-open {
  transform: scale(1);
  opacity: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.company-logo {
  width: 120px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.modal-header h2 {
  margin: 0;
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-color, #ff4444) 0%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  position: absolute;
  top: 0;
  right: 0;
}

.close-button:hover {
  background: rgba(255, 68, 68, 0.1);
  border-color: var(--primary-color, #ff4444);
  transform: rotate(90deg) scale(1.1);
}

.close-button .material-icons {
  color: #64748b;
  font-size: 20px;
}

.close-button:hover .material-icons {
  color: var(--primary-color, #ff4444);
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
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color, #ff4444);
  box-shadow: 
    0 0 0 3px rgba(255, 68, 68, 0.1),
    0 4px 12px rgba(255, 68, 68, 0.15);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
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

/* Button container spacing and styling */
.modal-body :deep(.button-container) {
  margin-top: 0.5rem;
  width: 100%;
}

.modal-body :deep(.modern-button) {
  width: 100% !important;
  font-size: 0.95rem !important;
  padding: 0.85rem 1rem !important;
}

.modal-body :deep(.tv-btn-text) {
  font-size: 0.95rem !important;
  font-weight: 500 !important;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
