import { useProductsPromos } from './useProductsPromos'

const {
  isLoadingProductsComposable,
  getProducts
} = useProductsPromos()

export {
  // Promos API
  isLoadingProductsComposable,
  getProducts
}
