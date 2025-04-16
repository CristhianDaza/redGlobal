<script setup lang="ts">
import type { MenuItem } from '@/types/common.d'
import { defineAsyncComponent } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{ items: MenuItem[] }>()

defineEmits<{
  (e: 'edit', item: MenuItem): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="items-section">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="material-icons">menu</span>
        <div class="stat-info">
          <h3>Items en Menú</h3>
          <p>{{ items.length }}</p>
        </div>
      </div>
    </div>

    <div class="menu-table">
      <table>
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Ruta</th>
          <th>Orden</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.path }}</td>
            <td>{{ item.order }}</td>
            <td class="actions">
              <RgButton
                icon="edit"
                type="icon"
                outlined
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

</style>
