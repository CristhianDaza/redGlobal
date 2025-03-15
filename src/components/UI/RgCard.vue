<script setup>
const props = defineProps({
  productsView: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="product">
    <img :src="productsView.mainImage" alt="" width="100" height="100" />
    <p>{{ productsView.id }} {{ productsView.name }} - {{ productsView.api }}</p>
    <p>{{ productsView.description }}</p>
  </div>
</template>

<style scoped>
.product {
  width: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  transition: transform 0.2s ease-in-out;
}

.product img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

.product p {
  font-size: 14px;
  margin: 5px 0;
  color: #333;
}

.product:hover {
  transform: scale(1.05);
}
</style>
