<script setup lang="ts">
import type { User } from '@/types/common';
import { defineAsyncComponent, ref } from 'vue';
import { NotificationService } from '@/components/Notification/NotificationService';
import TvRelativeTime from '@todovue/tv-relative-time';

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

const copyToClipboard = async (email: string) => {
  try {
    await navigator.clipboard.writeText(email);
    NotificationService.push({
      title: 'Email copiado',
      description: `${email} ha sido copiado al portapapeles`,
      type: 'success'
    });
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    NotificationService.push({
      title: 'Error al copiar',
      description: 'No se pudo copiar el email al portapapeles',
      type: 'error'
    });
  }
};
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
          <th>Último<br />Acceso</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td class="email-cell">
            <span class="email-text">{{ user.email }}</span>
            <button 
              class="copy-btn"
              @click="copyToClipboard(user.email)"
              title="Copiar email"
            >
              <span class="material-icons">content_copy</span>
            </button>
          </td>
          <td>
            <span :class="['status-badge', user.active ? 'completed' : 'pending']">
              {{ user.active ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            {{ 
              user.role === 'admin' ? 'Administrador' : 
              user.role === 'advisor' ? 'Asesor' : 
              'Cliente' 
            }}
          </td>
          <td>
            <TvRelativeTime v-if="user.lastLogin" :date="user.lastLogin" lang="es" />
            <span v-else class="no-login">Nunca</span>
          </td>
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
.email-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.email-text {
  flex: 1;
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  padding: 0;
}

.copy-btn:hover {
  background: #f1f5f9;
  color: var(--primary-color);
  transform: scale(1.1);
}

.copy-btn:active {
  transform: scale(0.95);
}

.copy-btn .material-icons {
  font-size: 16px;
}

.no-login {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.875rem;
}
</style>
