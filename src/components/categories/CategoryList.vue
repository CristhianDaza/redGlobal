<script setup lang="ts">
interface Props {
  category: string;
  subcategories: string[];
}

const props = defineProps<Props>();
const emit = defineEmits(['select']);
</script>

<template>
  <div class="category-container">
    <h3 class="category-title">{{ props.category }}</h3>
    <ul class="subcategories-list">
      <li v-for="sub in props.subcategories" 
        :key="sub"
        @click="emit('select', sub)">
        {{ sub }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.category-container {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.category-title {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

.subcategories-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.subcategories-list li {
  padding: 0.5rem 0;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.subcategories-list li:hover {
  color: #1a73e8;
}

@media (max-width: 768px) {
  .category-container {
    padding: 1rem;
    margin-bottom: 0.5rem;
  }

  .category-title {
    font-size: 1.1rem;
  }

  .subcategories-list li {
    font-size: 0.9rem;
  }
}
</style>
