<script setup lang="ts">
import type { Advisor } from '@/types/common.d'
import { defineAsyncComponent } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{ items: Advisor[] }>()

defineEmits<{
  (e: 'edit', item: Advisor): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="advisors-section">
    <div class="section-header">
      <h2>
        <span class="material-icons">support_agent</span>
        Gestión de Asesores
      </h2>
      <p class="section-description">
        Administra los asesores comerciales disponibles para atención al cliente vía WhatsApp.
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">support_agent</span>
        </div>
        <div class="stat-info">
          <h3>{{ items.length }}</h3>
          <p>Asesores Registrados</p>
          <span class="stat-description">Asesores disponibles para atención</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon whatsapp">
          <span class="material-icons">chat</span>
        </div>
        <div class="stat-info">
          <h3>100%</h3>
          <p>WhatsApp Activo</p>
          <span class="stat-description">Todos los asesores con WhatsApp</span>
        </div>
      </div>
    </div>

    <div class="advisors-grid">
      <div v-for="item in items" :key="item.id" class="advisor-card">
        <div class="advisor-header">
          <div class="advisor-avatar">
            <span class="material-icons">person</span>
          </div>
          <div class="advisor-info">
            <h3 class="advisor-name">{{ item.nombre }}</h3>
            <span class="advisor-role">Asesor Comercial</span>
          </div>
          <div class="advisor-status">
            <span class="status-badge active">
              <span class="material-icons">check_circle</span>
              Activo
            </span>
          </div>
        </div>
        
        <div class="advisor-contact">
          <div class="contact-item">
            <span class="material-icons">phone</span>
            <span class="contact-info">{{ item.telefono }}</span>
          </div>
          <div class="contact-item whatsapp-item">
            <span class="material-icons">chat</span>
            <span class="contact-info">WhatsApp disponible</span>
            <a :href="`https://api.whatsapp.com/send?phone=${item.telefono}`" target="_blank" class="whatsapp-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width="16px" height="16px">
                <g fill="currentColor">
                  <g transform="scale(10.66667,10.66667)">
                    <path d="M19.077,4.928c-1.886,-1.887 -4.394,-2.927 -7.066,-2.928c-5.506,0 -9.987,4.479 -9.989,9.985c-0.001,1.76 0.459,3.478 1.333,4.992l-1.355,5.023l5.233,-1.237c1.459,0.796 3.101,1.215 4.773,1.216h0.004c5.505,0 9.986,-4.48 9.989,-9.985c0.002,-2.669 -1.036,-5.178 -2.922,-7.066zM16.898,15.554c-0.208,0.583 -1.227,1.145 -1.685,1.186c-0.458,0.042 -0.887,0.207 -2.995,-0.624c-2.537,-1 -4.139,-3.601 -4.263,-3.767c-0.125,-0.167 -1.019,-1.353 -1.019,-2.581c0,-1.228 0.645,-1.832 0.874,-2.081c0.229,-0.25 0.499,-0.312 0.666,-0.312c0.166,0 0.333,0 0.478,0.006c0.178,0.007 0.375,0.016 0.562,0.431c0.222,0.494 0.707,1.728 0.769,1.853c0.062,0.125 0.104,0.271 0.021,0.437c-0.083,0.166 -0.125,0.27 -0.249,0.416c-0.125,0.146 -0.262,0.325 -0.374,0.437c-0.125,0.124 -0.255,0.26 -0.11,0.509c0.146,0.25 0.646,1.067 1.388,1.728c0.954,0.85 1.757,1.113 2.007,1.239c0.25,0.125 0.395,0.104 0.541,-0.063c0.146,-0.166 0.624,-0.728 0.79,-0.978c0.166,-0.25 0.333,-0.208 0.562,-0.125c0.229,0.083 1.456,0.687 1.705,0.812c0.25,0.125 0.416,0.187 0.478,0.291c0.062,0.103 0.062,0.603 -0.146,1.186z"></path>
                  </g>
                </g>
              </svg>
              Contactar
            </a>
          </div>
        </div>
        
        <div class="advisor-actions">
          <RgButton
            icon="edit"
            size="small"
            @click="$emit('edit', item)"
            title="Editar Asesor"
            :customStyle="{
              backgroundColor: '#4299e1',
              color: '#ffffff',
            }"
          >
            Editar
          </RgButton>
          <RgButton
            icon="remove"
            size="small"
            outlined
            @click="$emit('delete', item.id)"
            title="Eliminar Asesor"
            :customStyle="{
              borderColor: '#e53e3e',
              color: '#e53e3e',
            }"
          >
            Eliminar
          </RgButton>
        </div>
      </div>
    </div>
    
    <div v-if="items.length === 0" class="empty-state">
      <div class="empty-icon">
        <span class="material-icons">support_agent</span>
      </div>
      <h3>No hay asesores configurados</h3>
      <p>Agrega asesores comerciales para brindar atención personalizada a los clientes.</p>
    </div>
  </div>
</template>

<style scoped>
.advisors-section {
  background: #f8fafc;
  min-height: 100vh;
}

.section-header {
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
}

.section-header h2 .material-icons {
  color: var(--primary-color);
  font-size: 2rem;
}

.section-description {
  color: #718096;
  margin: 0;
  line-height: 1.6;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-info p {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.stat-description {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.advisors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.advisor-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 2rem;
  transition: all 0.3s ease;
}

.advisor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.advisor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.advisor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.advisor-info {
  flex: 1;
}

.advisor-name {
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.advisor-role {
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
}

.advisor-status {
  margin-left: auto;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge .material-icons {
  font-size: 14px;
}

.advisor-contact {
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.contact-item .material-icons {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.contact-info {
  flex: 1;
  color: #2d3748;
  font-weight: 500;
}

.whatsapp-item {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.whatsapp-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #25D366;
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.whatsapp-btn:hover {
  background: #128C7E;
  transform: scale(1.05);
}

.advisor-actions {
  display: flex;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.empty-icon .material-icons {
  font-size: 2.5rem;
}

.empty-state h3 {
  color: #2d3748;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.empty-state p {
  color: #718096;
  margin: 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .advisors-section {
    padding: 1rem;
  }
  
  .section-header {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .advisors-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .advisor-card {
    padding: 1.5rem;
  }
  
  .advisor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .advisor-status {
    margin-left: 0;
    align-self: flex-end;
  }
  
  .advisor-actions {
    flex-direction: column;
  }
}
</style>
