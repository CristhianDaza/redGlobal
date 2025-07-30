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
  <div class="items-section">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="material-icons">menu</span>
        <div class="stat-info">
          <h3>Imágenes de Clientes</h3>
          <p>{{ items.length }}</p>
        </div>
      </div>
    </div>

    <div class="rg-table">
      <table>
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.title }}</td>
          <td>
            <img :src="item.imageUrl" alt="Vista previa" class="card-thumbnail">
          </td>
          <td class="actions">
            <RgButton
              icon="edit"
              type="icon"
              outlined
              title="Editar Imagen"
              @click="$emit('edit', item)"
              :customStyle="{
                backgroundColor: '#4299e1',
                color: '#ebf8ff',
              }"
            />
            <RgButton
              icon="remove"
              type="icon"
              outlined
              title="Eliminar Imagen"
              @click="$emit('delete', item.id)"
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
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.375rem;
}
</style>
