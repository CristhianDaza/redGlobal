<script setup lang="ts">
import type { ColorItem } from '@/types/common.d'
import { defineAsyncComponent } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{ items: ColorItem[] }>()

defineEmits<{
  (e: 'edit', item: ColorItem): void
  (e: 'delete', id: string): void
}>()

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return 'rgb(0, 0, 0)';
}
</script>

<template>
  <div class="color-section">
    <div class="section-header">
      <h2>
        <span class="material-icons">palette</span>
        Configuración de Color Principal
      </h2>
      <p class="section-description">
        Administra el color principal de la aplicación que se aplica en toda la interfaz de usuario.
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">palette</span>
        </div>
        <div class="stat-info">
          <h3>{{ items.length }}</h3>
          <p>Color Configurado</p>
          <span class="stat-description">Color principal activo del sistema</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon theme">
          <span class="material-icons">brush</span>
        </div>
        <div class="stat-info">
          <h3>100%</h3>
          <p>Cobertura de Tema</p>
          <span class="stat-description">Aplicado en toda la interfaz</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon preview">
          <span class="material-icons">visibility</span>
        </div>
        <div class="stat-info">
          <h3>Vista Previa</h3>
          <p>Color Actual</p>
          <span class="stat-description">{{ items[0]?.hex || 'No configurado' }}</span>
        </div>
      </div>
    </div>

    <div class="color-container">
      <div v-if="items.length > 0" class="current-color-card">
        <div class="color-header">
          <h3>
            <span class="material-icons">color_lens</span>
            Color Principal Actual
          </h3>
        </div>
        
        <div class="color-display-section">
          <div class="color-preview-large" :style="{ backgroundColor: items[0].hex }">
            <div class="color-overlay">
              <span class="color-hex">{{ items[0].hex }}</span>
            </div>
          </div>
          
          <div class="color-info">
            <div class="color-details">
              <div class="detail-item">
                <span class="detail-label">Código Hex:</span>
                <span class="detail-value hex-code">{{ items[0].hex }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Formato RGB:</span>
                <span class="detail-value rgb-code">{{ hexToRgb(items[0].hex) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado:</span>
                <span class="detail-value status-active">
                  <span class="material-icons">check_circle</span>
                  Activo
                </span>
              </div>
            </div>
            
            <div class="color-actions">
              <RgButton
                icon="edit"
                @click="$emit('edit', items[0])"
                title="Editar Color Principal"
                :customStyle="{
                  backgroundColor: '#4299e1',
                  color: '#ffffff',
                }"
              >
                Editar Color
              </RgButton>
              <RgButton
                icon="remove"
                outlined
                @click="$emit('delete', items[0].id)"
                title="Eliminar Color"
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
        
        <div class="color-samples">
          <h4>Vista Previa en Componentes</h4>
          <div class="samples-grid">
            <div class="sample-item">
              <div class="sample-button" :style="{ backgroundColor: items[0].hex }">
                Botón Principal
              </div>
              <span class="sample-label">Botones</span>
            </div>
            <div class="sample-item">
              <div class="sample-link" :style="{ color: items[0].hex }">
                Enlace de ejemplo
              </div>
              <span class="sample-label">Enlaces</span>
            </div>
            <div class="sample-item">
              <div class="sample-badge" :style="{ backgroundColor: items[0].hex }">
                Badge
              </div>
              <span class="sample-label">Badges</span>
            </div>
            <div class="sample-item">
              <div class="sample-border" :style="{ borderColor: items[0].hex }">
                Borde
              </div>
              <span class="sample-label">Bordes</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-color-card">
        <div class="no-color-icon">
          <span class="material-icons">palette</span>
        </div>
        <h3>No hay color principal configurado</h3>
        <p>Configura un color principal para personalizar la apariencia de la aplicación.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-section {
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

.stat-icon.preview {
  border: 3px solid white;
  box-shadow: 0 0 0 2px #e2e8f0;
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

.color-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.current-color-card {
  padding: 2rem;
}

.color-header {
  margin-bottom: 2rem;
}

.color-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.color-header .material-icons {
  color: var(--primary-color);
}

.color-display-section {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.color-preview-large {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 3px solid white;
  overflow: hidden;
}

.color-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  text-align: center;
}

.color-hex {
  font-size: 1.25rem;
  font-weight: 600;
  font-family: monospace;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.color-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.detail-label {
  font-weight: 600;
  color: #4a5568;
}

.detail-value {
  font-family: monospace;
  color: #2d3748;
}

.hex-code {
  background: #2d3748;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.rgb-code {
  background: #4a5568;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-active {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-weight: 600;
}

.status-active .material-icons {
  font-size: 18px;
}

.color-actions {
  display: flex;
  gap: 1rem;
}

.color-samples {
  border-top: 1px solid #e2e8f0;
  padding-top: 2rem;
}

.color-samples h4 {
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.samples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.sample-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.sample-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  text-align: center;
  min-width: 120px;
}

.sample-link {
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.sample-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sample-border {
  padding: 1rem;
  border: 3px solid;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  color: #4a5568;
}

.sample-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.no-color-card {
  text-align: center;
  padding: 4rem 2rem;
}

.no-color-icon {
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

.no-color-icon .material-icons {
  font-size: 2.5rem;
}

.no-color-card h3 {
  color: #2d3748;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.no-color-card p {
  color: #718096;
  margin: 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .color-section {
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
  
  .current-color-card {
    padding: 1.5rem;
  }
  
  .color-display-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .color-actions {
    flex-direction: column;
  }
  
  .samples-grid {
    grid-template-columns: 1fr;
  }
}
</style>
