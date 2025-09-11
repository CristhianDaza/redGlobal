<script setup lang="ts">
import type { Advisor } from '@/types/common.d'
import { defineAsyncComponent } from "vue";

const RgButton = defineAsyncComponent(/* webpackChunkName: "rgButton" */() => import('@/components/UI/RgButton.vue'));

defineProps<{ items: Advisor[] }>()

defineEmits<{
  (e: 'edit', item: Advisor): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="items-section">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="material-icons">support_agent</span>
        <div class="stat-info">
          <h3>Asesores Registrados</h3>
          <p>{{ items.length }}</p>
        </div>
      </div>
    </div>

    <div class="rg-table">
      <table>
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>WhatsApp</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.nombre }}</td>
          <td>{{ item.telefono }}</td>
          <td>
            <a :href="`https://api.whatsapp.com/send?phone=${item.telefono}`" target="_blank" class="whatsapp-link">
              <button class="whatsapp-table-btn" title="Abrir WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width="20px" height="20px" fill-rule="nonzero">
                  <g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                    <g transform="scale(10.66667,10.66667)">
                      <path d="M19.077,4.928c-1.886,-1.887 -4.394,-2.927 -7.066,-2.928c-5.506,0 -9.987,4.479 -9.989,9.985c-0.001,1.76 0.459,3.478 1.333,4.992l-1.355,5.023l5.233,-1.237c1.459,0.796 3.101,1.215 4.773,1.216h0.004c5.505,0 9.986,-4.48 9.989,-9.985c0.002,-2.669 -1.036,-5.178 -2.922,-7.066zM16.898,15.554c-0.208,0.583 -1.227,1.145 -1.685,1.186c-0.458,0.042 -0.887,0.207 -2.995,-0.624c-2.537,-1 -4.139,-3.601 -4.263,-3.767c-0.125,-0.167 -1.019,-1.353 -1.019,-2.581c0,-1.228 0.645,-1.832 0.874,-2.081c0.229,-0.25 0.499,-0.312 0.666,-0.312c0.166,0 0.333,0 0.478,0.006c0.178,0.007 0.375,0.016 0.562,0.431c0.222,0.494 0.707,1.728 0.769,1.853c0.062,0.125 0.104,0.271 0.021,0.437c-0.083,0.166 -0.125,0.27 -0.249,0.416c-0.125,0.146 -0.262,0.325 -0.374,0.437c-0.125,0.124 -0.255,0.26 -0.11,0.509c0.146,0.25 0.646,1.067 1.388,1.728c0.954,0.85 1.757,1.113 2.007,1.239c0.25,0.125 0.395,0.104 0.541,-0.063c0.146,-0.166 0.624,-0.728 0.79,-0.978c0.166,-0.25 0.333,-0.208 0.562,-0.125c0.229,0.083 1.456,0.687 1.705,0.812c0.25,0.125 0.416,0.187 0.478,0.291c0.062,0.103 0.062,0.603 -0.146,1.186z"></path>
                    </g>
                  </g>
                </svg>
              </button>
            </a>
          </td>
          <td class="actions">
            <RgButton
              icon="edit"
              type="icon"
              outlined
              title="Editar Asesor"
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
              title="Eliminar Asesor"
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
.items-section {
  padding: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card .material-icons {
  font-size: 2rem;
  color: #4299e1;
}

.stat-info h3 {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.stat-info p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background-color: #f7fafc;
  font-weight: 600;
  color: #2d3748;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

.empty-state .material-icons {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.whatsapp-link {
  text-decoration: none;
}

.whatsapp-table-btn {
  background-color: #25D366;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: white;
}

.whatsapp-table-btn:hover {
  background-color: #1ebe57;
  transform: scale(1.05);
}

.whatsapp-table-btn svg {
  display: block;
}
</style>
