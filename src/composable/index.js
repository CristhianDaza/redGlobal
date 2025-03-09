import { useProductsPromos } from './useProductsPromos'

const {
  isLoadingApiPromos,
  getProducts
} = useProductsPromos()

export {
  // Promos API
  isLoadingApiPromos,
  getProducts
}
