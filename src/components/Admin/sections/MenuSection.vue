<script setup lang="ts">
import type { MenuItem } from '@/types/common.d'
import { defineAsyncComponent, computed } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

const props = defineProps<{ items: MenuItem[] }>()

defineEmits<{
  (e: 'edit', item: MenuItem): void
  (e: 'delete', id: string): void
}>()

const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => a.order - b.order)
})

const getMenuIcon = (path: string): string => {
  if (path === '/') return 'home'
  if (path.includes('products') || path.includes('catalogs')) return 'inventory_2'
  if (path.includes('about') || path.includes('mission')) return 'info'
  if (path.includes('contact')) return 'contact_mail'
  if (path.includes('quote')) return 'request_quote'
  return 'link'
}

const getPathType = (path: string): string => {
  if (path === '/') return 'Inicio'
  if (path.startsWith('http')) return 'Externo'
  if (path.includes('#')) return 'Ancla'
  return 'Interno'
}
</script>

<template>
  <div class="menu-section">
    <div class="section-header">
      <h2>
        <span class="material-icons">menu</span>
        Gestión de Menús de Navegación
      </h2>
      <p class="section-description">
        Administra los elementos del menú de navegación principal del sitio web.
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">menu</span>
        </div>
        <div class="stat-info">
          <h3>{{ items.length }}</h3>
          <p>Total Menús</p>
          <span class="stat-description">Elementos de navegación configurados</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon navigation">
          <span class="material-icons">navigation</span>
        </div>
        <div class="stat-info">
          <h3>{{ Math.max(...items.map(i => i.order), 0) }}</h3>
          <p>Máximo Orden</p>
          <span class="stat-description">Última posición en el menú</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon routes">
          <span class="material-icons">link</span>
        </div>
        <div class="stat-info">
          <h3>{{ new Set(items.map(i => i.path)).size }}</h3>
          <p>Rutas Únicas</p>
          <span class="stat-description">Enlaces de navegación diferentes</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Menú</th>
              <th>Configuración</th>
              <th>Orden</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedItems" :key="item.id" class="table-row">
              <td>
                <div class="menu-info">
                  <div class="menu-icon">
                    <span class="material-icons">{{ getMenuIcon(item.path) }}</span>
                  </div>
                  <div class="menu-details">
                    <strong class="menu-title">{{ item.title }}</strong>
                    <span class="menu-description">Elemento de navegación</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="config-info">
                  <div class="config-item">
                    <span class="config-label">Ruta:</span>
                    <span class="config-value path-value">{{ item.path }}</span>
                  </div>
                  <div class="config-item">
                    <span class="config-label">Tipo:</span>
                    <span class="config-value type-value">{{ getPathType(item.path) }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="order-display">
                  <div class="order-badge">
                    <span class="material-icons">sort</span>
                    {{ item.order }}
                  </div>
                </div>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <RgButton
                    icon="edit"
                    type="icon"
                    outlined
                    @click="$emit('edit', item)"
                    title="Editar Menú"
                    :customStyle="{
                      backgroundColor: '#4299e1',
                      color: '#ffffff',
                    }"
                  />
                  <RgButton
                    icon="remove"
                    type="icon"
                    outlined
                    title="Eliminar Menú"
                    @click="$emit('delete', item.id)"
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
.menu-section {
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

.stat-icon.navigation {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.stat-icon.routes {
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

.menu-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.menu-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-title {
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.menu-description {
  color: #718096;
  font-size: 0.875rem;
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
  min-width: 40px;
}

.config-value {
  font-size: 0.875rem;
  color: #2d3748;
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.path-value {
  font-family: monospace;
  background: #2d3748;
  color: white;
}

.type-value {
  background: var(--primary-color);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.order-display {
  display: flex;
  justify-content: center;
}

.order-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 700;
  color: #2d3748;
  font-size: 1.1rem;
}

.order-badge .material-icons {
  font-size: 18px;
  color: var(--primary-color);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .menu-section {
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
