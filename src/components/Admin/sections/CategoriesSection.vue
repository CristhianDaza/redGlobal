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
  <div class="cards-section">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="material-icons">dashboard</span>
        <div class="stat-info">
          <h3>Total Categorías</h3>
          <p>{{ cards.length }}</p>
        </div>
      </div>
    </div>

    <div class="cards-table">
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Texto Botón</th>
            <th>Color de Fondo</th>
            <th>URL</th>
            <th>Estado</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in cards" :key="card.id">
            <td>{{ card.title }}</td>
            <td>{{ card.buttonText }}</td>
            <td>
              <div class="color-preview" :style="{ backgroundColor: card.backgroundColor }"></div>
              {{ card.backgroundColor }}
            </td>
            <td>{{ card.url }}</td>
            <td>
              <span class="status-badge" :class="{ 'completed': card.active, 'pending': !card.active }">
                {{ card.active ? 'Activa' : 'Inactiva' }}
              </span>
            </td>
            <td>
              <img
                :src="card.imageUrl"
                :alt="card.title"
                class="card-thumbnail"
              >
            </td>
            <td class="actions">
              <RgButton
                icon="edit"
                type="icon"
                outlined
                @click="$emit('edit', card)"
                title="Editar Categoría"
                :customStyle="{
                  backgroundColor: '#4299e1',
                  color: '#ebf8ff',
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
                  color: '#ebf8ff',
                }"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.card-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.375rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge.completed {
  background-color: #d1fae5;
  color: #059669;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
  border: 1px solid #e2e8f0;
}

</style>
