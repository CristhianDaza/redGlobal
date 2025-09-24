<script setup lang="ts">
import type { OurClients } from '@/types/common.d'
import { defineAsyncComponent } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{ items: OurClients[] }>()

defineEmits<{
  (e: 'edit', item: OurClients): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="clients-section">
    <div class="section-header">
      <h2>
        <span class="material-icons">business</span>
        Gestión de Nuestros Clientes
      </h2>
      <p class="section-description">
        Administra los logos de clientes que se muestran en la sección "Nuestros Clientes" del sitio web.
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">business</span>
        </div>
        <div class="stat-info">
          <h3>{{ items.length }}</h3>
          <p>Clientes Registrados</p>
          <span class="stat-description">Logos de clientes configurados</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon trust">
          <span class="material-icons">verified</span>
        </div>
        <div class="stat-info">
          <h3>100%</h3>
          <p>Confianza</p>
          <span class="stat-description">Clientes satisfechos con nuestro servicio</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon visibility">
          <span class="material-icons">visibility</span>
        </div>
        <div class="stat-info">
          <h3>Público</h3>
          <p>Visibilidad</p>
          <span class="stat-description">Logos mostrados en página principal</span>
        </div>
      </div>
    </div>

    <div class="clients-grid">
      <div v-for="item in items" :key="item.id" class="client-card">
        <div class="client-image">
          <img :src="item.imageUrl" :alt="item.title" class="client-logo">
          <div class="client-overlay">
            <div class="client-name">
              <span class="material-icons">business</span>
              {{ item.title }}
            </div>
          </div>
        </div>
        
        <div class="client-content">
          <div class="client-header">
            <h3 class="client-title">{{ item.title }}</h3>
            <div class="client-status">
              <span class="status-badge active">
                <span class="material-icons">check_circle</span>
                Activo
              </span>
            </div>
          </div>
          
          <div class="client-info">
            <div class="info-item">
              <span class="info-label">Tipo:</span>
              <span class="info-value">Logo de Cliente</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <span class="info-value">Visible en sitio web</span>
            </div>
          </div>
          
          <div class="client-actions">
            <RgButton
              icon="edit"
              size="small"
              @click="$emit('edit', item)"
              title="Editar Cliente"
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
              title="Eliminar Cliente"
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
    </div>
    
    <div v-if="items.length === 0" class="empty-state">
      <div class="empty-icon">
        <span class="material-icons">business</span>
      </div>
      <h3>No hay clientes configurados</h3>
      <p>Agrega logos de clientes para mostrar en la sección "Nuestros Clientes" del sitio web.</p>
    </div>
  </div>
</template>

<style scoped>
.clients-section {
  padding: 2rem;
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
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-icon.trust {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.stat-icon.visibility {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
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

.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.client-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.client-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.client-image {
  position: relative;
  height: 180px;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.client-logo {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  transition: transform 0.3s ease;
  filter: grayscale(20%);
}

.client-card:hover .client-logo {
  transform: scale(1.05);
  filter: grayscale(0%);
}

.client-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.client-card:hover .client-overlay {
  opacity: 1;
}

.client-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.client-content {
  padding: 1.5rem;
}

.client-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.client-title {
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.client-status {
  margin-left: 1rem;
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

.client-info {
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  min-width: 50px;
}

.info-value {
  font-size: 0.875rem;
  color: #2d3748;
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.client-actions {
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
  .clients-section {
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
  
  .clients-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .client-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .client-status {
    margin-left: 0;
  }
  
  .client-actions {
    flex-direction: column;
  }
}
</style>
