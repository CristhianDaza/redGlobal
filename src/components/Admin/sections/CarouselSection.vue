<script setup lang="ts">
import type { CarouselItem } from '@/types/common.d'
import { defineAsyncComponent } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{ items: CarouselItem[] }>()

defineEmits<{
  (e: 'edit', item: CarouselItem): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="carousel-section">
    <div class="section-header">
      <h2>
        <span class="material-icons">view_carousel</span>
        Gestión del Carrusel Principal
      </h2>
      <p class="section-description">
        Administra las imágenes del carrusel que se muestran en la página principal del sitio web.
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">view_carousel</span>
        </div>
        <div class="stat-info">
          <h3>{{ items.length }}</h3>
          <p>Imágenes del Carrusel</p>
          <span class="stat-description">Slides configurados en el carrusel</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active">
          <span class="material-icons">visibility</span>
        </div>
        <div class="stat-info">
          <h3>{{ items.filter(i => i.toRoute).length }}</h3>
          <p>Con Enlaces</p>
          <span class="stat-description">Imágenes con enlaces configurados</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon performance">
          <span class="material-icons">speed</span>
        </div>
        <div class="stat-info">
          <h3>Auto</h3>
          <p>Reproducción</p>
          <span class="stat-description">Carrusel con reproducción automática</span>
        </div>
      </div>
    </div>

    <div class="carousel-grid">
      <div v-for="(item, index) in items" :key="item.id" class="carousel-card">
        <div class="carousel-image">
          <img :src="item.imageUrl" :alt="item.title" class="carousel-thumbnail">
          <div class="carousel-overlay">
            <div class="slide-number">
              <span class="material-icons">filter_{{ index + 1 }}</span>
              Slide {{ index + 1 }}
            </div>
            <a v-if="item.toRoute" :href="item.toRoute" target="_blank" class="view-link">
              <span class="material-icons">open_in_new</span>
              Ver Enlace
            </a>
          </div>
        </div>
        
        <div class="carousel-content">
          <div class="carousel-header">
            <h3 class="carousel-title">{{ item.title }}</h3>
            <div class="carousel-position">
              <span class="position-badge">
                <span class="material-icons">sort</span>
                {{ index + 1 }}
              </span>
            </div>
          </div>
          
          <div class="carousel-info">
            <div class="info-item" v-if="item.toRoute">
              <span class="info-label">Enlace:</span>
              <span class="info-value route-value">{{ item.toRoute }}</span>
            </div>
            <div class="info-item" v-else>
              <span class="info-label">Enlace:</span>
              <span class="info-value no-link">Sin enlace configurado</span>
            </div>
          </div>
          
          <div class="carousel-actions">
            <RgButton
              icon="edit"
              size="small"
              @click="$emit('edit', item)"
              title="Editar Imagen"
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
              title="Eliminar Imagen"
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
        <span class="material-icons">view_carousel</span>
      </div>
      <h3>No hay imágenes en el carrusel</h3>
      <p>Agrega imágenes para mostrar en el carrusel principal de la página de inicio.</p>
    </div>
  </div>
</template>

<style scoped>
.carousel-section {
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

.carousel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.carousel-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.carousel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.carousel-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.carousel-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-card:hover .carousel-thumbnail {
  transform: scale(1.05);
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel-card:hover .carousel-overlay {
  opacity: 1;
}

.slide-number {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  align-self: flex-start;
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
  align-self: flex-end;
}

.view-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.carousel-content {
  padding: 1.5rem;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.carousel-title {
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.carousel-position {
  margin-left: 1rem;
}

.position-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1rem;
}

.position-badge .material-icons {
  font-size: 16px;
}

.carousel-info {
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

.no-link {
  color: #a0aec0;
  font-style: italic;
}

.carousel-actions {
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
  .carousel-section {
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
  
  .carousel-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .carousel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .carousel-position {
    margin-left: 0;
  }
  
  .carousel-actions {
    flex-direction: column;
  }
}
</style>
