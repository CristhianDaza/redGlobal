import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '../store'
import { filterProductsHelper } from '../utils'

export function useFilters() {
  const store = useProductsStore()
  const router = useRouter()
  const route = useRoute()
  
  const _setRouteQuery = async (type, value) => {
    let query = { ...route.query }
    if (type === 'search') {
      query = { search: value }
    } else if (value) {
      query[type] = value
    } else {
      delete query[type]
    }
    
    await router.push({ name: 'search', query })
  }
  
  const _setProductsToView = (products) => {
    store.setProductsToView(products)
  }
  
  const _filterSearch = async (search) => {
    const productsFiltered = filterProductsHelper(store.products, search)
    _setProductsToView(productsFiltered)
    await _setRouteQuery(search)
  }
  
  const filterProducts = async (type, filter) => {
    const filterMap = {
      search: _filterSearch
    }

    if (filterMap[type]) {
      await filterMap[type](filter)
    }
    
    await _setRouteQuery(type, filter)
  }
  
  const clearFilters = async (type = null) => {
    if (type) {
      await _setRouteQuery(type, null)
    } else {
      await _setRouteQuery('search', '')
    }
    _setProductsToView(store.products)
  }

  
  return {
    filterProducts,
    clearFilters
  }
}
