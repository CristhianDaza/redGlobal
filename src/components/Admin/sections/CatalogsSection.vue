<script setup lang="ts">
import type { Catalog } from '@/types/common.d'
import { defineAsyncComponent } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{ items: Catalog[] }>()

defineEmits<{
  (e: 'edit', item: Catalog): void
  (e: 'delete', id: string): void
}>()

const getRouteType = (route: string): string => {
  return route.startsWith('http') ? 'external' : 'internal'
}

const getRouteIcon = (route: string): string => {
  return route.startsWith('http') ? 'open_in_new' : 'link'
}

const getRouteLabel = (route: string): string => {
  return route.startsWith('http') ? 'Externo' : 'Interno'
}
</script>

<template>
  <div class="catalogs-section">
    <div class="section-header">
      <h2>
        <span class="material-icons">library_books</span>
        Gestión de Catálogos
      </h2>
      <p class="section-description">
        Administra los catálogos de productos que se muestran en la sección de catálogos del sitio web.
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">library_books</span>
        </div>
        <div class="stat-info">
          <h3>{{ items.length }}</h3>
          <p>Total Catálogos</p>
          <span class="stat-description">Catálogos configurados en el sistema</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon external">
          <span class="material-icons">open_in_new</span>
        </div>
        <div class="stat-info">
          <h3>{{ items.filter(i => i.toRoute.startsWith('http')).length }}</h3>
          <p>Enlaces Externos</p>
          <span class="stat-description">Catálogos con enlaces externos</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon internal">
          <span class="material-icons">link</span>
        </div>
        <div class="stat-info">
          <h3>{{ items.filter(i => !i.toRoute.startsWith('http')).length }}</h3>
          <p>Enlaces Internos</p>
          <span class="stat-description">Catálogos con rutas internas</span>
        </div>
      </div>
    </div>

    <div class="catalogs-grid">
      <div v-for="item in items" :key="item.id" class="catalog-card">
        <div class="catalog-image">
          <img :src="item.imageUrl" :alt="item.title" class="catalog-thumbnail">
          <div class="catalog-overlay">
            <a :href="item.toRoute" target="_blank" class="view-link">
              <span class="material-icons">visibility</span>
              Ver Catálogo
            </a>
          </div>
        </div>
        
        <div class="catalog-content">
          <div class="catalog-header">
            <h3 class="catalog-title">{{ item.title }}</h3>
            <div class="catalog-type">
              <span class="type-badge" :class="getRouteType(item.toRoute)">
                <span class="material-icons">{{ getRouteIcon(item.toRoute) }}</span>
                {{ getRouteLabel(item.toRoute) }}
              </span>
            </div>
          </div>
          
          <div class="catalog-info">
            <div class="info-item">
              <span class="info-label">Enlace:</span>
              <span class="info-value route-value">{{ item.toRoute }}</span>
            </div>
          </div>
          
          <div class="catalog-actions">
            <RgButton
              icon="edit"
              size="small"
              @click="$emit('edit', item)"
              title="Editar Catálogo"
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
              title="Eliminar Catálogo"
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
        <span class="material-icons">library_books</span>
      </div>
      <h3>No hay catálogos configurados</h3>
      <p>Agrega catálogos para mostrar a los usuarios en la sección de catálogos.</p>
    </div>
  </div>
</template>

<style scoped>
.catalogs-section {
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

.stat-icon.external {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.stat-icon.internal {
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

.catalogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.catalog-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.catalog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.catalog-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.catalog-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.catalog-card:hover .catalog-thumbnail {
  transform: scale(1.05);
}

.catalog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.catalog-card:hover .catalog-overlay {
  opacity: 1;
}

.view-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.view-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.catalog-content {
  padding: 1.5rem;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.catalog-title {
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.catalog-type {
  margin-left: 1rem;
}

.type-badge {
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

.type-badge.external {
  background: #d1fae5;
  color: #065f46;
}

.type-badge.internal {
  background: #e0e7ff;
  color: #3730a3;
}

.type-badge .material-icons {
  font-size: 14px;
}

.catalog-info {
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
}

.route-value {
  font-family: monospace;
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  word-break: break-all;
  flex: 1;
}

.catalog-actions {
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
  .catalogs-section {
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
  
  .catalogs-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .catalog-type {
    margin-left: 0;
  }
  
  .catalog-actions {
    flex-direction: column;
  }
}
</style>
