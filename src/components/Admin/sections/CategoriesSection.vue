<script setup lang="ts">
import type { CategoryCard } from '@/types/common.d'
import { defineAsyncComponent } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{
  cards: CategoryCard[]
}>()

defineEmits<{
  (e: 'edit', card: CategoryCard): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="categories-section">
    <div class="section-header">
      <h2>
        <span class="material-icons">dashboard</span>
        Gestión de Categorías
      </h2>
      <p class="section-description">
        Administra las categorías de productos que se muestran en la página principal.
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">dashboard</span>
        </div>
        <div class="stat-info">
          <h3>{{ cards.length }}</h3>
          <p>Total Categorías</p>
          <span class="stat-description">Categorías configuradas en el sistema</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active">
          <span class="material-icons">visibility</span>
        </div>
        <div class="stat-info">
          <h3>{{ cards.filter(c => c.active).length }}</h3>
          <p>Categorías Activas</p>
          <span class="stat-description">Visibles para los usuarios</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon inactive">
          <span class="material-icons">visibility_off</span>
        </div>
        <div class="stat-info">
          <h3>{{ cards.filter(c => !c.active).length }}</h3>
          <p>Categorías Inactivas</p>
          <span class="stat-description">Ocultas para los usuarios</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Configuración</th>
              <th>Estado</th>
              <th>Vista Previa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in cards" :key="card.id" class="table-row">
              <td>
                <div class="category-info">
                  <div class="category-icon" :style="{ backgroundColor: card.backgroundColor }">
                    <span class="material-icons">category</span>
                  </div>
                  <div class="category-details">
                    <strong class="category-title">{{ card.title }}</strong>
                    <span class="category-url">{{ card.url }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="config-info">
                  <div class="config-item">
                    <span class="config-label">Botón:</span>
                    <span class="config-value">{{ card.buttonText }}</span>
                  </div>
                  <div class="config-item">
                    <span class="config-label">Color:</span>
                    <div class="color-display">
                      <div class="color-preview" :style="{ backgroundColor: card.backgroundColor }"></div>
                      <span class="color-code">{{ card.backgroundColor }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['status-badge', card.active ? 'active' : 'inactive']">
                  <span class="material-icons">{{ card.active ? 'visibility' : 'visibility_off' }}</span>
                  {{ card.active ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td>
                <div class="image-preview">
                  <img
                    :src="card.imageUrl"
                    :alt="card.title"
                    class="category-thumbnail"
                  >
                </div>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <RgButton
                    icon="edit"
                    type="icon"
                    outlined
                    @click="$emit('edit', card)"
                    title="Editar Categoría"
                    :customStyle="{
                      backgroundColor: '#4299e1',
                      color: '#ffffff',
                    }"
                  />
                  <RgButton
                    icon="remove"
                    type="icon"
                    outlined
                    title="Eliminar Categoría"
                    @click="$emit('delete', card.id)"
                    :customStyle="{
                      backgroundColor: '#e53e3e',
                      color: '#ffffff',
                    }"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories-section {
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

.stat-icon.active {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.stat-icon.inactive {
  background: linear-gradient(135deg, #ef4444, #f87171);
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

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  padding: 1.25rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modern-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f7fafc;
  vertical-align: middle;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.category-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-title {
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.category-url {
  color: #718096;
  font-size: 0.875rem;
  font-family: monospace;
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.config-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.config-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  min-width: 50px;
}

.config-value {
  font-size: 0.875rem;
  color: #2d3748;
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.color-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.color-code {
  font-size: 0.875rem;
  color: #4a5568;
  font-family: monospace;
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fecaca;
  color: #991b1b;
}

.status-badge .material-icons {
  font-size: 16px;
}

.image-preview {
  display: flex;
  justify-content: center;
}

.category-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #e2e8f0;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .categories-section {
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
  
  .modern-table th,
  .modern-table td {
    padding: 1rem;
  }
  
  .config-info {
    gap: 0.5rem;
  }
  
  .config-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
