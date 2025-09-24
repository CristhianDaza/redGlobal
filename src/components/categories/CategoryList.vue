<script setup lang="ts">
defineProps<{
  category: string
  subcategories: string[]
}>()

defineEmits<{
  (e: 'select', subcategory: string): void
  (e: 'select-category', category: string): void
}>()

const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'Bolígrafos': 'edit',
    'Mugs y Vasos': 'local_cafe',
    'Paraguas': 'beach_access',
    'Llaveros': 'vpn_key',
    'Maletines y Morrales': 'work',
    'Libretas': 'menu_book',
    'Tecnología': 'devices',
    'Hogar': 'home',
    'Oficina': 'business',
    'Deportes': 'sports_soccer',
    'Ecológicos': 'eco',
    'Salud y Cuidado': 'health_and_safety',
    'Accesorios y Varios': 'category'
  }
  return iconMap[category] || 'inventory_2'
}
</script>

<template>
  <div class="category-card">
    <div class="category-header" @click="$emit('select-category', category)">
      <div class="category-icon">
        <span class="material-icons">{{ getCategoryIcon(category) }}</span>
      </div>
      <div class="category-info">
        <h3 class="category-title">{{ category }}</h3>
        <span class="category-count">{{ subcategories.length }} subcategorías</span>
      </div>
      <div class="category-arrow">
        <span class="material-icons">arrow_forward</span>
      </div>
    </div>
    
    <div class="subcategories-container">
      <div class="subcategories-header">
        <span class="material-icons">list</span>
        <span>Subcategorías disponibles</span>
      </div>
      <ul class="subcategory-list">
        <li
          v-for="sub in subcategories"
          :key="sub"
          class="subcategory"
          @click="$emit('select', sub)"
        >
          <span class="material-icons subcategory-icon">chevron_right</span>
          <span class="subcategory-text">{{ sub }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.category-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  height: fit-content;
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #e2e8f0;
}

.category-header:hover {
  background: linear-gradient(135deg, var(--primary-color), #4299e1);
  color: white;
}

.category-header:hover .category-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.category-header:hover .category-arrow {
  color: white;
  transform: translateX(4px);
}

.category-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
}

.category-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
  transition: color 0.3s ease;
}

.category-count {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
  transition: color 0.3s ease;
}

.category-arrow {
  color: var(--primary-color);
  transition: all 0.3s ease;
  opacity: 0.7;
}

.subcategories-container {
  padding: 1.5rem;
}

.subcategories-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.subcategories-header .material-icons {
  font-size: 16px;
  color: var(--primary-color);
}

.subcategory-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.subcategory {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  color: #4a5568;
}

.subcategory:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(4px);
  border-color: var(--primary-color);
}

.subcategory-icon {
  font-size: 16px;
  color: var(--primary-color);
  transition: color 0.2s ease;
}

.subcategory:hover .subcategory-icon {
  color: white;
}

.subcategory-text {
  font-weight: 500;
  line-height: 1.4;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-header {
    padding: 1.25rem;
  }
  
  .category-icon {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  .category-title {
    font-size: 1.1rem;
  }
  
  .subcategories-container {
    padding: 1.25rem;
  }
  
  .subcategory {
    padding: 0.625rem 0.875rem;
    font-size: 0.85rem;
  }
}
</style>
