<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
  lines: string[];
}

defineProps<Props>();
</script>

<template>
  <div class="info-card">
    <span class="material-icons">{{ icon }}</span>
    <h3>{{ title }}</h3>
    <p>
      <template v-for="(line, index) in lines" :key="index">
        {{ line }}<br v-if="index < lines.length - 1">
      </template>
    </p>
  </div>
</template>

<style scoped>
.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.info-card:hover {
  transform: translateY(-2px);
}

.info-card .material-icons {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.info-card h3 {
  font-size: 1.1rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.info-card p {
  color: #64748b;
  line-height: 1.5;
}
</style>
