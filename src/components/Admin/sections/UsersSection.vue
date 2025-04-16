<script setup lang="ts">
import type { User } from '@/types/common';
import { defineAsyncComponent } from 'vue';

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{
  users: User[]
  total: number
  active: number
  inactive: number
}>()

defineEmits<{
  (e: 'edit', user: User): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="users-section">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="material-icons">group</span>
        <div class="stat-info">
          <h3>Total Usuarios</h3>
          <p>{{ total }}</p>
        </div>
      </div>
      <div class="stat-card">
        <span class="material-icons">check_circle</span>
        <div class="stat-info">
          <h3>Activos</h3>
          <p>{{ active }}</p>
        </div>
      </div>
      <div class="stat-card">
        <span class="material-icons">block</span>
        <div class="stat-info">
          <h3>Inactivos</h3>
          <p>{{ inactive }}</p>
        </div>
      </div>
    </div>

    <div class="menu-table">
      <table>
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Estado</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span :class="['status-badge', user.active ? 'completed' : 'pending']">
              {{ user.active ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>{{ user.role === 'admin' ? 'Administrador' : 'Cliente' }}</td>
          <td class="actions">
            <RgButton
              icon="edit"
              type="icon"
              outlined
              @click="$emit('edit', user)"
              :customStyle="{
              backgroundColor: '#4299e1',
              color: '#ebf8ff',
              }"
            />
            <RgButton
              icon="remove"
              type="icon"
              outlined
              @click="$emit('delete', user.idDoc)"
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
