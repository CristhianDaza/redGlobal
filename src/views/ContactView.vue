<script setup lang="ts">
import { useHead } from '@vueuse/head';
import type { EmailData } from '@/types/config.d';
import { ref, defineAsyncComponent } from 'vue';
import { emailService } from '@/services';
import { contactCards } from '@/config';
import { useForm, rules } from '@/composable/useForm.ts';

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));
const RgFormField = defineAsyncComponent(/* webpackChunkName: "rgFormField" */() => import('@/components/UI/RgFormField.vue'));

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
    resetForm();

    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  } finally {
    setTimeout(() => {
      isSubmitting.value = false;
    }, 500);
  }
};

useHead({
  title: 'Contacto – Red Global Promocional',
  meta: [
    { name: 'description', content: 'Contáctanos para cotizaciones y consultas sobre regalos corporativos y productos promocionales.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Contacto – Red Global Promocional' },
    { property: 'og:description', content: 'Contáctanos para cotizaciones y consultas sobre regalos corporativos y productos promocionales.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:url', content: 'https://redglobalpromocionales.com/contacto' }
  ],
  link: [
    { rel: 'canonical', href: 'https://redglobalpromocionales.com/contacto' }
  ]
});
</script>

<template>
  <div class="contact-view">
    <div class="contact-section">
      <div class="section-header">
        <h2>
          <span class="material-icons">contact_support</span>
          Contáctanos
        </h2>
        <p class="section-description">
          Estamos aquí para ayudarte con tus necesidades promocionales. Contáctanos y recibe atención personalizada.
        </p>
      </div>

      <div class="contact-content">
        <div class="contact-info">
          <div class="info-header">
            <h3>
              <span class="material-icons">info</span>
              Información de Contacto
            </h3>
            <p>Múltiples canales para comunicarte con nosotros</p>
          </div>
          
          <div class="info-cards">
            <div v-for="card in contactCards" :key="card.title" class="info-card">
              <div class="card-icon">
                <span class="material-icons">{{ card.icon }}</span>
              </div>
              <div class="card-content">
                <h4>{{ card.title }}</h4>
                <div class="card-lines">
                  <p v-for="line in card.lines" :key="line" class="card-line">{{ line }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form-section">
          <div class="form-header">
            <h3>
              <span class="material-icons">send</span>
              Envíanos un Mensaje
            </h3>
            <p>Completa el formulario y te responderemos pronto</p>
          </div>

          <div class="form-container">
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div v-if="showSuccessMessage" class="success-message">
                <span class="material-icons">check_circle</span>
                <span>Mensaje enviado exitosamente. Te contactaremos pronto.</span>
              </div>

              <div class="form-grid">
                <div class="form-group">
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
                </div>

                <div class="form-group">
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
                </div>

                <div class="form-group">
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
                </div>

                <div class="form-group">
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
              </div>

              <div class="form-group full-width">
                <label for="message" class="form-label">
                  <span class="material-icons">message</span>
                  Mensaje
                  <span class="required">*</span>
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="5"
                  class="form-textarea"
                  placeholder="¿Cómo podemos ayudarte? Describe tu proyecto o necesidad..."
                  :class="{ 'has-error': touched.has('message') && errors.message?.length }"
                  @blur="touchField('message')"
                ></textarea>
                <span v-if="touched.has('message') && errors.message?.length" class="error-message">
                  <span class="material-icons">error</span>
                  {{ errors.message[0] }}
                </span>
              </div>

              <div class="form-actions">
                <RgButton
                  icon="calendar"
                  :loading="isSubmitting"
                  :disabled="isSubmitting || !isValid"
                  :customStyle="{
                    backgroundColor: 'var(--primary-color)',
                    color: '#ffffff',
                  }"
                >
                  {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
                </RgButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-view {
  background: #f8fafc;
  min-height: 100vh;
}

.contact-section {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.section-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.section-header .material-icons {
  color: var(--primary-color);
  font-size: 2.5rem;
}

.section-description {
  color: #718096;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  align-items: start;
}

.contact-info {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.info-header {
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-bottom: 1px solid #e2e8f0;
}

.info-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.info-header .material-icons {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.info-header p {
  color: #718096;
  margin: 0;
  font-size: 0.9rem;
}

.info-cards {
  padding: 2rem;
  display: grid;
  gap: 1.5rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background: white;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.card-content h4 {
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.card-lines {
  display: grid;
  gap: 0.25rem;
}

.card-line {
  color: #4a5568;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.contact-form-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.form-header {
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-bottom: 1px solid #e2e8f0;
}

.form-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.form-header .material-icons {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.form-header p {
  color: #718096;
  margin: 0;
  font-size: 0.9rem;
}

.form-container {
  padding: 2rem;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 12px;
  margin-bottom: 2rem;
  font-weight: 500;
}

.success-message .material-icons {
  color: #10b981;
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
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-label .material-icons {
  font-size: 16px;
  color: var(--primary-color);
}

.required {
  color: #dc2626;
  margin-left: 0.25rem;
}

.form-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
}

.form-textarea.has-error {
  border-color: #dc2626;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #dc2626;
  margin-top: 0.5rem;
  font-weight: 500;
}

.error-message .material-icons {
  font-size: 14px;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1024px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 1rem;
  }
  
  .section-header {
    padding: 1.5rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .info-cards {
    padding: 1.5rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .info-header,
  .form-header {
    padding: 1.5rem 1.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .section-header h2 {
    font-size: 1.75rem;
  }
  
  .info-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .card-icon {
    align-self: center;
  }
}
</style>
