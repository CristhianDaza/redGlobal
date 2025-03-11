import { useProductsPromos } from './useProductsPromos'
import { useProductsMarpico } from './useProductsMarpico'

const {
  isLoadingProductsPromosComposable,
  getProductsPromos
} = useProductsPromos()

const {
  isLoadingProductsMarpicoComposable,
  getProductsMarpico
} = useProductsMarpico()

export {
  // Promos API
  isLoadingProductsPromosComposable,
  getProductsPromos,
  
  // Marpico API
  isLoadingProductsMarpicoComposable,
  getProductsMarpico,
}
