<script setup lang="ts">
defineProps<{
  category: string
  subcategories: string[]
}>()

defineEmits<{
  (e: 'select', subcategory: string): void
  (e: 'select-category', category: string): void
}>()
</script>

<template>
  <div class="category-card">
    <div class="category-title" @click="$emit('select-category', category)">
      {{ category }}
    </div>
    <ul class="subcategory-list">
      <li
        v-for="sub in subcategories"
        :key="sub"
        class="subcategory"
        @click="$emit('select', sub)"
      >
        {{ sub }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.category-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  border-left: 6px solid var(--primary-color);
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.category-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.8rem;
}

.subcategory-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.subcategory {
  font-size: 0.95rem;
  padding: 4px 0;
  color: #555;
  transition: color 0.2s ease;
  cursor: pointer;
}

.subcategory:hover {
  color: var(--primary-color);
}
</style>
