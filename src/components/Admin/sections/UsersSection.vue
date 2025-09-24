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
    <div class="section-header">
      <h2>
        <span class="material-icons">group</span>
        Gestión de Usuarios
      </h2>
      <p class="section-description">
        Administra los usuarios del sistema, sus roles y permisos de acceso.
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="material-icons">group</span>
        </div>
        <div class="stat-info">
          <h3>{{ total }}</h3>
          <p>Total Usuarios</p>
          <span class="stat-description">Usuarios registrados en el sistema</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active">
          <span class="material-icons">check_circle</span>
        </div>
        <div class="stat-info">
          <h3>{{ active }}</h3>
          <p>Usuarios Activos</p>
          <span class="stat-description">Con acceso al sistema</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon inactive">
          <span class="material-icons">block</span>
        </div>
        <div class="stat-info">
          <h3>{{ inactive }}</h3>
          <p>Usuarios Inactivos</p>
          <span class="stat-description">Sin acceso al sistema</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo Electrónico</th>
              <th>Estado</th>
              <th>Rol</th>
              <th>Último Acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="table-row">
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    <span class="material-icons">person</span>
                  </div>
                  <div class="user-details">
                    <strong class="user-name">{{ user.name }}</strong>
                  </div>
                </div>
              </td>
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
                <span :class="['status-badge', user.active ? 'active' : 'inactive']">
                  <span class="material-icons">{{ user.active ? 'check_circle' : 'cancel' }}</span>
                  {{ user.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <span class="role-badge" :class="user.role">
                  {{ 
                    user.role === 'admin' ? 'Administrador' : 
                    user.role === 'advisor' ? 'Asesor' : 
                    'Cliente' 
                  }}
                </span>
              </td>
              <td>
                <div class="last-login">
                  <TvRelativeTime v-if="user.lastLogin" :date="user.lastLogin" lang="es" />
                  <span v-else class="no-login">
                    <span class="material-icons">schedule</span>
                    Nunca
                  </span>
                </div>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <RgButton
                    icon="edit"
                    type="icon"
                    outlined
                    title="Editar usuario"
                    @click="$emit('edit', user)"
                    :customStyle="{
                      backgroundColor: '#4299e1',
                      color: '#ffffff',
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
                      backgroundColor: user.active ? '#e53e3e' : '#10b981',
                      color: '#ffffff',
                    }"
                  />
                  <RgButton
                    icon="account"
                    type="icon"
                    outlined
                    @click="$emit('reset-password', user)"
                    title="Enviar correo de recuperación de contraseña"
                    :customStyle="{
                      backgroundColor: '#f59e0b',
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
.users-section {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.user-name {
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.email-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.email-text {
  flex: 1;
  color: #4a5568;
  font-size: 0.875rem;
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f7fafc;
  color: #718096;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 0;
}

.copy-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: scale(1.05);
}

.copy-btn .material-icons {
  font-size: 16px;
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

.role-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.advisor {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.client {
  background: #e0e7ff;
  color: #3730a3;
}

.last-login {
  color: #4a5568;
  font-size: 0.875rem;
}

.no-login {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0aec0;
  font-style: italic;
  font-size: 0.875rem;
}

.no-login .material-icons {
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .users-section {
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
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
