import type { ProductsRedGlobal } from '../types/common';
import type { FilterType, FilterMap, QueryValue } from '../types/filters';

import { useRouter, useRoute, LocationQuery } from 'vue-router';
import { useProductsStore } from '../store';
import { filterProductsHelper } from '../utils';


export function useFilters() {
  const store = useProductsStore();
  const router = useRouter();
  const route = useRoute();
  
  const _setRouteQuery = async (type: FilterType, value: QueryValue): Promise<void> => {
    let query: LocationQuery = { ...route.query };
    if (type === 'search') {
      query = { search: value };
    } else if (value) {
      query[type] = value;
    } else {
      delete query[type];
    }
    
    await router.push({ name: 'search', query });
  };
  
  const _setProductsToView = (products: ProductsRedGlobal[]): void => {
    store.setProductsToView(products);
  };
  
  const _filterSearch = async (search: string): Promise<void> => {
    const productsFiltered = filterProductsHelper(store.products || [], search)
    _setProductsToView(productsFiltered)
    await _setRouteQuery('search', search)
  };
  
  const filterProducts = async (type: FilterType, filter: string): Promise<void> => {
    const filterMap: FilterMap = {
      search: _filterSearch
    };

    if (filterMap[type]) {
      await filterMap[type](filter);
    }
    
    await _setRouteQuery(type, filter);
  };
  
  const clearFilters = async (type: FilterType | null = null): Promise<void> => {
    if (type) {
      await _setRouteQuery(type, null);
    } else {
      await _setRouteQuery('search', '');
    }
    if (store.products) {
      _setProductsToView(store.products);
    }
  };
  
  return {
    filterProducts,
    clearFilters
  };
}
