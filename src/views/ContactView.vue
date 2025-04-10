<script setup lang="ts">
import { ref } from 'vue';
import RgButton from '../components/UI/RgButton.vue';
import { emailService } from '../services/emailService';
import type { EmailData } from '../services/emailService';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const form = ref<ContactForm>({
  name: '',
  email: '',
  phone: '',
  company: '',
  message: ''
});

const isSubmitting = ref(false);
const showSuccessMessage = ref(false);

const handleSubmit = async () => {
  if (isSubmitting.value) return; // Prevenir múltiples envíos
  
  isSubmitting.value = true;
  try {
    const emailData: EmailData = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      company: form.value.company || undefined,
      message: form.value.message
    };

    await emailService.sendContactEmail(emailData);
    showSuccessMessage.value = true;
    
    // Limpiar formulario
    form.value = {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    };

    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
  } finally {
    // Pequeño delay para mejor UX
    setTimeout(() => {
      isSubmitting.value = false;
    }, 500);
  }
};
</script>

<template>
  <div class="contact-page">
    <div class="contact-header">
      <h1>Contáctanos</h1>
      <p class="subtitle">Estamos aquí para ayudarte con tus necesidades promocionales</p>
    </div>

    <div class="contact-content">
      <div class="contact-info">
        <div class="info-card">
          <span class="material-icons">location_on</span>
          <h3>Ubicación</h3>
          <p>Calle 123 #45-67<br>Bogotá, Colombia</p>
        </div>

        <div class="info-card">
          <span class="material-icons">phone</span>
          <h3>Teléfono</h3>
          <p>+57 (1) 123 4567<br>+57 300 123 4567</p>
        </div>

        <div class="info-card">
          <span class="material-icons">email</span>
          <h3>Email</h3>
          <p>info@redglobal.com<br>ventas@redglobal.com</p>
        </div>

        <div class="info-card">
          <span class="material-icons">schedule</span>
          <h3>Horario</h3>
          <p>Lunes a Viernes<br>8:00 AM - 6:00 PM</p>
        </div>
      </div>

      <div class="contact-form-container">
        <form @submit.prevent="handleSubmit" class="contact-form">
          <h2>Envíanos un mensaje</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Nombre completo</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Tu nombre"
              >
            </div>

            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="tu@email.com"
              >
            </div>

            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                placeholder="Tu número de contacto"
              >
            </div>

            <div class="form-group">
              <label for="company">Empresa</label>
              <input
                id="company"
                v-model="form.company"
                type="text"
                placeholder="Nombre de tu empresa (opcional)"
              >
            </div>
          </div>

          <div class="form-group full-width">
            <label for="message">Mensaje</label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="4"
              placeholder="¿Cómo podemos ayudarte?"
            ></textarea>
          </div>

          <div class="form-footer">
            <RgButton
              :text="isSubmitting ? 'Enviando...' : 'Enviar mensaje'"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            />
          </div>
        </form>

        <div v-if="showSuccessMessage" class="success-message">
          <span class="material-icons">check_circle</span>
          <p>¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.contact-header {
  text-align: center;
  margin-bottom: 3rem;
}

.contact-header h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #64748b;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: start;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.info-card:hover {
  transform: translateY(-2px);
}

.info-card .material-icons {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.info-card h3 {
  font-size: 1.1rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.info-card p {
  color: #64748b;
  line-height: 1.5;
}

.contact-form-container {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.contact-form h2 {
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-footer {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.success-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #48bb78;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.success-message .material-icons {
  font-size: 1.5rem;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }

  .contact-info {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .contact-info {
    grid-template-columns: 1fr;
  }
}
</style>
