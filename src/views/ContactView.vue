<script setup lang="ts">
import { ref } from 'vue';
import RgButton from '../components/UI/RgButton.vue';
import RgFormField from '../components/UI/RgFormField.vue';
import InfoCard from '../components/Contact/InfoCard.vue';
import { emailService } from '../services/emailService';
import type { EmailData } from '../services/emailService';
import { contactCards } from '../config/contact';
import { useForm, rules } from '../composable/useForm';
import { NotificationService } from '../components/Notification/NotificationService';

const { 
  form,
  errors,
  touched,
  isValid,
  validateForm,
  touchField,
  resetForm
} = useForm({
  initialValues: {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  },
  rules: {
    name: [rules.required('El nombre es requerido')],
    email: [
      rules.required('El email es requerido'),
      rules.email('El email no es válido')
    ],
    phone: [
      rules.required('El teléfono es requerido'),
      rules.phone('El teléfono no es válido')
    ],
    message: [
      rules.required('El mensaje es requerido'),
      rules.minLength(10, 'El mensaje debe tener al menos 10 caracteres'),
      rules.maxLength(500, 'El mensaje no puede exceder los 500 caracteres')
    ]
  }
});

const isSubmitting = ref(false);
const showSuccessMessage = ref(false);

const handleSubmit = async () => {
  if (isSubmitting.value || !validateForm()) return;
  
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
    NotificationService.push({
      title: 'Mensaje enviado',
      description: 'Tu mensaje ha sido enviado con éxito',
      type: 'success'
    });
    
    resetForm();

    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    NotificationService.push({
      title: 'Error al enviar el mensaje',
      description: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.',
      type: 'error'
    });
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
        <InfoCard
          v-for="card in contactCards"
          :key="card.title"
          :icon="card.icon"
          :title="card.title"
          :lines="card.lines"
        />
      </div>

      <div class="contact-form-container">
        <form @submit.prevent="handleSubmit" class="contact-form">
          <h2>Envíanos un mensaje</h2>
          
          <div class="form-grid">
            <RgFormField
              v-model="form.name"
              name="name"
              label="Nombre completo"
              placeholder="Tu nombre"
              :errors="errors.name"
              :touched="touched.has('name')"
              required
              @blur="touchField('name')"
            />

            <RgFormField
              v-model="form.email"
              name="email"
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              :errors="errors.email"
              :touched="touched.has('email')"
              required
              @blur="touchField('email')"
            />

            <RgFormField
              v-model="form.phone"
              name="phone"
              type="tel"
              label="Teléfono"
              placeholder="Tu número de contacto"
              :errors="errors.phone"
              :touched="touched.has('phone')"
              required
              @blur="touchField('phone')"
            />

            <RgFormField
              v-model="form.company"
              name="company"
              label="Empresa"
              placeholder="Nombre de tu empresa (opcional)"
              :errors="errors.company"
              :touched="touched.has('company')"
              @blur="touchField('company')"
            />
          </div>

          <div class="form-field full-width">
            <label for="message" class="form-label">
              Mensaje
              <span class="required">*</span>
            </label>
            <textarea
              id="message"
              v-model="form.message"
              rows="4"
              class="form-input"
              placeholder="¿Cómo podemos ayudarte?"
              :class="{ 'has-error': touched.has('message') && errors.message?.length }"
              @blur="touchField('message')"
            ></textarea>
            <span v-if="touched.has('message') && errors.message?.length" class="error-message">
              {{ errors.message[0] }}
            </span>
          </div>

          <div class="form-footer">
            <RgButton
              :text="isSubmitting ? 'Enviando...' : 'Enviar mensaje'"
              :loading="isSubmitting"
              :disabled="isSubmitting || !isValid"
            />
          </div>
        </form>
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

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #dc2626;
  margin-left: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
}

.form-input.has-error {
  border-color: #dc2626;
}

.error-message {
  font-size: 0.75rem;
  color: #dc2626;
}

.form-footer {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
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
