<script setup lang="ts">
import type { ColorItem } from '@/types/common.d'
import { defineAsyncComponent } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{ items: ColorItem[] }>()

defineEmits<{
  (e: 'edit', item: ColorItem): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="items-section">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="material-icons">format_paint</span>
        <div class="stat-info">
          <h3>Color Principal</h3>
        </div>
      </div>
    </div>

    <div class="rg-table">
      <table>
        <thead>
        <tr>
          <th>Color</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div
                :style="{ backgroundColor: item.hex }"
                style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ccc;"
              ></div>
              <span>{{ item.hex }}</span>
            </div>
          </td>

          <td class="actions">
            <RgButton
              icon="edit"
              type="icon"
              outlined
              title="Editar Color"
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
              title="Eliminar Color"
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
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.375rem;
}
</style>
