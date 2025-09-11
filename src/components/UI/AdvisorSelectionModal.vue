<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue'
import { useAdvisorsStore } from '@/store/useAdvisorsStore'
import type { Advisor } from '@/types/common.d'

const RgModal = defineAsyncComponent(/* webpackChunkName: "rgModal" */() => import('@/components/UI/RgModal.vue'))

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', advisor: Advisor): void
}>()

const advisorsStore = useAdvisorsStore()

onMounted(async () => {
  if (advisorsStore.advisors.length === 0) {
    await advisorsStore.getAdvisors()
  }
})

const handleAdvisorSelect = (advisor: Advisor) => {
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${advisor.telefono}&text=${encodeURIComponent('Hola, vengo de la página web y me gustaría saber más sobre sus productos.')}`
  window.open(whatsappUrl, '_blank')
  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <RgModal
    :is-open="isOpen"
    title="Selecciona un Asesor"
    @close="handleClose"
    :show-confirm="false"
  >
    <div class="advisor-selection">
      <p class="selection-description">
        Elige un asesor para iniciar una conversación por WhatsApp:
      </p>
      
      <div v-if="advisorsStore.isLoadingAdvisors" class="loading-state">
        <div class="loader"></div>
        <p>Cargando asesores...</p>
      </div>
      
      <div v-else-if="advisorsStore.advisors.length === 0" class="empty-state">
        <span class="material-icons">support_agent</span>
        <p>No hay asesores disponibles en este momento.</p>
        <p class="contact-fallback">
          Puedes contactarnos directamente al teléfono principal.
        </p>
      </div>
      
      <div v-else class="advisors-grid">
        <button
          v-for="advisor in advisorsStore.advisors"
          :key="advisor.id"
          class="advisor-card"
          @click="handleAdvisorSelect(advisor)"
        >
          <div class="advisor-avatar">
            <span class="material-icons">person</span>
          </div>
          <div class="advisor-info">
            <h3>{{ advisor.nombre }}</h3>
            <p>{{ advisor.telefono }}</p>
          </div>
          <div class="whatsapp-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width="24px" height="24px" fill-rule="nonzero">
              <g fill="#25D366" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                <g transform="scale(10.66667,10.66667)">
                  <path d="M19.077,4.928c-1.886,-1.887 -4.394,-2.927 -7.066,-2.928c-5.506,0 -9.987,4.479 -9.989,9.985c-0.001,1.76 0.459,3.478 1.333,4.992l-1.355,5.023l5.233,-1.237c1.459,0.796 3.101,1.215 4.773,1.216h0.004c5.505,0 9.986,-4.48 9.989,-9.985c0.002,-2.669 -1.036,-5.178 -2.922,-7.066zM16.898,15.554c-0.208,0.583 -1.227,1.145 -1.685,1.186c-0.458,0.042 -0.887,0.207 -2.995,-0.624c-2.537,-1 -4.139,-3.601 -4.263,-3.767c-0.125,-0.167 -1.019,-1.353 -1.019,-2.581c0,-1.228 0.645,-1.832 0.874,-2.081c0.229,-0.25 0.499,-0.312 0.666,-0.312c0.166,0 0.333,0 0.478,0.006c0.178,0.007 0.375,0.016 0.562,0.431c0.222,0.494 0.707,1.728 0.769,1.853c0.062,0.125 0.104,0.271 0.021,0.437c-0.083,0.166 -0.125,0.27 -0.249,0.416c-0.125,0.146 -0.262,0.325 -0.374,0.437c-0.125,0.124 -0.255,0.26 -0.11,0.509c0.146,0.25 0.646,1.067 1.388,1.728c0.954,0.85 1.757,1.113 2.007,1.239c0.25,0.125 0.395,0.104 0.541,-0.063c0.146,-0.166 0.624,-0.728 0.79,-0.978c0.166,-0.25 0.333,-0.208 0.562,-0.125c0.229,0.083 1.456,0.687 1.705,0.812c0.25,0.125 0.416,0.187 0.478,0.291c0.062,0.103 0.062,0.603 -0.146,1.186z"></path>
                </g>
              </g>
            </svg>
          </div>
        </button>
      </div>
    </div>
  </RgModal>
</template>

<style scoped>
.advisor-selection {
  padding: 1rem 0;
}

.selection-description {
  text-align: center;
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #718096;
}

.loading-state .loader {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.empty-state .material-icons {
  font-size: 3rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.contact-fallback {
  font-size: 0.875rem;
  color: #a0aec0;
  margin-top: 0.5rem;
}

.advisors-grid {
  display: grid;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.advisor-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.advisor-card:hover {
  border-color: #25D366;
  background: #f0fff4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.15);
}

.advisor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.advisor-avatar .material-icons {
  color: white;
  font-size: 1.5rem;
}

.advisor-info {
  flex: 1;
}

.advisor-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.advisor-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
}

.whatsapp-icon {
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.advisor-card:hover .whatsapp-icon {
  opacity: 1;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Scrollbar styling */
.advisors-grid::-webkit-scrollbar {
  width: 6px;
}

.advisors-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.advisors-grid::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.advisors-grid::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
