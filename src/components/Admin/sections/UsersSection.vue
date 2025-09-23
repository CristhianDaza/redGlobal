<script setup lang="ts">
import type { User } from '@/types/common';
import { defineAsyncComponent, ref } from 'vue';

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{
  users: User[]
  total: number
  active: number
  inactive: number
  isLoading?: boolean
}>()

defineEmits<{
  (e: 'edit', user: User): void
  (e: 'delete', id: string): void
  (e: 'toggle-status', user: User): void
  (e: 'reset-password', user: User): void
}>()

const loadingUserId = ref<string | null>(null);
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

    <div class="rg-table">
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
              title="Editar usuario"
              @click="$emit('edit', user)"
              :customStyle="{
                backgroundColor: '#4299e1',
                color: '#ebf8ff',
              }"
            />
            <RgButton
              :icon="user.active ? 'block' : 'check'"
              type="icon"
              outlined
              @click="$emit('toggle-status', user); loadingUserId = user.id"
              :title="user.active ? 'Desactivar usuario' : 'Activar usuario'"
              :loading="isLoading && loadingUserId === user.id"
              :customStyle="{
                backgroundColor: user.active ? '#e53e3e' : '#4299e1',
                color: '#ebf8ff',
              }"
            />
            <RgButton
              icon="account"
              type="icon"
              outlined
              @click="$emit('reset-password', user)"
              title="Enviar correo de recuperación de contraseña"
              :customStyle="{
                backgroundColor: '#f6ad55',
                color: '#1a202c',
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
