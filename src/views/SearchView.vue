<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../store'

const route = useRoute()
const router = useRouter()
const storeProducts = useProductsStore()

const currentPage = ref(route.query.page || 1)
const pageSize = ref(route.query.size || 15)
const totalPages = computed(() => Math.ceil(storeProducts.getProductsToView?.length / pageSize.value) || 0)

const RgCard = defineAsyncComponent(/* webpackChunkName: "rgCard" */() => import('../components/UI/RgCard.vue'))


const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    router.push({ query: { ...route.query, page: currentPage.value } })
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    router.push({ query: { ...route.query, page: currentPage.value } })
  }
}

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return storeProducts.getProductsToView?.slice(start, end)
})


const changePageSize = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  router.push({ query: { ...route.query, page: currentPage.value, size: newSize } })
}

const generatePageSizeOptions = (totalProducts) => {
  const options = []
  let step = 15

  while (step < totalProducts) {
    options.push(step)
    step += 15
  }

  options.push(totalProducts)
  return options
}

watch(() => route?.query, (newQuery) => {
  currentPage.value = Number(newQuery.page) || 1
  pageSize.value = Number(newQuery.size) || 15
}, { immediate: true })
</script>

<template>
  <button
    @click="prevPage"
    class="prev"
  > < </button>
  <span>Página {{ currentPage }} de {{ totalPages }}</span>
  <button
    class="next"
    @click="nextPage"
  > > </button>

  <div
    class="containerProduct"
    v-for="product in paginatedProducts"
  >
    <RgCard :productsView="product" />
  </div>
</template>

<style scoped>
.containerProduct {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  padding: 20px;
}

.next {
  margin-left: 10px;
}
.prev {
  margin-right: 10px;
}
</style>
