<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { defineAsyncComponent, onMounted } from 'vue'
import { useCatalogAdmin } from '@/composable'

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'))
const RgLoader = defineAsyncComponent(/* webpackChunkName: "rgLoader" */() => import('@/components/UI/RgLoader.vue'))

const { catalogs, loadCatalogs, isLoadingCatalog } = useCatalogAdmin()

const openCatalog = (url: string) => {
  window.open(url, '_blank')
}

const downloadCatalog = (url: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = ''
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

useHead({
  title: 'Catálogos – Red Global Promocional',
  meta: [
    { name: 'description', content: 'Descarga nuestros catálogos de regalos corporativos y productos promocionales. Gran variedad para tu empresa.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Catálogos – Red Global Promocional' },
    { property: 'og:description', content: 'Descarga nuestros catálogos de regalos corporativos y productos promocionales. Gran variedad para tu empresa.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:url', content: 'https://redglobalpromocionales.com/catalogos' }
  ],
  link: [
    { rel: 'canonical', href: 'https://redglobalpromocionales.com/catalogos' }
  ]
})

onMounted(() => {
  if (!catalogs.value || catalogs.value.length === 0) {
    loadCatalogs()
  }
})
</script>

<template>
  <div class="catalogs-view">

    <!-- Loading State -->
    <div v-if="isLoadingCatalog" class="loading-section">
      <div class="loading-container">
        <RgLoader>Cargando catálogos...</RgLoader>
        <p class="loading-text">Preparando nuestros catálogos para ti...</p>
      </div>
    </div>

    <!-- Catalogs Section -->
    <div v-else class="catalogs-section">
      <div class="section-header">
        <h2>
          <span class="material-icons">folder_open</span>
          Catálogos Disponibles
        </h2>
        <p class="section-description">
          Descarga nuestros catálogos especializados y descubre la amplia gama de productos que tenemos para tu empresa.
        </p>
      </div>

      <div v-if="catalogs && catalogs.length > 0" class="catalogs-grid">
        <div
          v-for="catalog in catalogs"
          :key="catalog.id"
          class="catalog-card"
          @click="openCatalog(catalog.toRoute)"
        >
          <div class="catalog-image-container">
            <img
              :src="catalog.imageUrl"
              :alt="catalog.title"
              class="catalog-image"
            />
            <div class="catalog-overlay">
              <div class="catalog-type">
                <span class="material-icons">picture_as_pdf</span>
                <span>PDF</span>
              </div>
              <div class="catalog-action">
                <span class="material-icons">download</span>
                <span>Descargar</span>
              </div>
            </div>
          </div>
          
          <div class="catalog-content">
            <div class="catalog-header">
              <h3 class="catalog-title">{{ catalog.title }}</h3>
              <div class="catalog-status">
                <span class="status-badge available">
                  <span class="material-icons">check_circle</span>
                  Disponible
                </span>
              </div>
            </div>
            
            <div class="catalog-info">
              <div class="info-item">
                <span class="material-icons">description</span>
                <span>Catálogo digital completo</span>
              </div>
              <div class="info-item">
                <span class="material-icons">file_download</span>
                <span>Descarga gratuita</span>
              </div>
            </div>
            
            <div class="catalog-actions">
              <RgButton
                icon="view"
                @click.stop="openCatalog(catalog.toRoute)"
                :customStyle="{
                  backgroundColor: 'var(--primary-color)',
                  color: '#ffffff',
                }"
              >
                Ver Catálogo
              </RgButton>
              <RgButton
                icon="download"
                outlined
                @click.stop="downloadCatalog(catalog.toRoute)"
                :customStyle="{
                  borderColor: 'var(--primary-color)',
                  color: 'var(--primary-color)',
                }"
              >
                Descargar
              </RgButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <span class="material-icons">folder_open</span>
        </div>
        <h3>No hay catálogos disponibles</h3>
        <p>Actualmente no tenemos catálogos publicados. Vuelve pronto para ver nuestras novedades.</p>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <div class="section-header">
        <h2>
          <span class="material-icons">star</span>
          ¿Por qué elegir nuestros catálogos?
        </h2>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <span class="material-icons">high_quality</span>
          </div>
          <div class="feature-content">
            <h3>Alta Calidad</h3>
            <p>Productos seleccionados con los más altos estándares de calidad para tu empresa.</p>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon variety">
            <span class="material-icons">inventory</span>
          </div>
          <div class="feature-content">
            <h3>Gran Variedad</h3>
            <p>Amplio catálogo con cientos de productos para todas las necesidades corporativas.</p>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon support">
            <span class="material-icons">support_agent</span>
          </div>
          <div class="feature-content">
            <h3>Asesoría Personalizada</h3>
            <p>Nuestro equipo te ayuda a encontrar el producto perfecto para tu marca.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalogs-view {
  background: #f8fafc;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, #4299e1 100%);
  color: white;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.hero-icon {
  font-size: 3.5rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  opacity: 0.95;
  margin: 0;
}

.hero-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Loading Section */
.loading-section {
  padding: 4rem 2rem;
  text-align: center;
}

.loading-container {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading-text {
  margin-top: 1rem;
  color: #718096;
  font-size: 1rem;
}

/* Catalogs Section */
.catalogs-section {
  padding: 0 2rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
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

.catalogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.catalog-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.catalog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.catalog-image-container {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.catalog-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.catalog-card:hover .catalog-image {
  transform: scale(1.05);
}

.catalog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.catalog-card:hover .catalog-overlay {
  opacity: 1;
}

.catalog-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  background: rgba(220, 38, 38, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  align-self: flex-start;
  font-size: 0.875rem;
}

.catalog-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  align-self: flex-end;
}

.catalog-action:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.catalog-content {
  padding: 2rem;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.catalog-title {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.catalog-status {
  margin-left: 1rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.available {
  background: #d1fae5;
  color: #065f46;
}

.status-badge .material-icons {
  font-size: 14px;
}

.catalog-info {
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.info-item .material-icons {
  color: var(--primary-color);
  font-size: 18px;
}

.catalog-actions {
  display: flex;
  gap: 1rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  margin-bottom: 3rem;
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

/* Features Section */
.features-section {
  padding: 4rem 2rem;
  background: white;
  margin-top: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 2rem;
  background: #f7fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feature-icon.variety {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.feature-icon.support {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.feature-content h3 {
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.feature-content p {
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .hero-icon {
    font-size: 3rem;
  }
  
  .catalogs-section {
    padding: 0 1rem 2rem;
  }
  
  .catalogs-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .features-section {
    padding: 3rem 1rem;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .hero-stats {
    grid-template-columns: 1fr;
  }
  
  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .catalog-status {
    margin-left: 0;
  }
  
  .catalog-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.75rem;
  }
  
  .catalog-content {
    padding: 1.5rem;
  }
}
</style>
