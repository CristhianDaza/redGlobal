import { useProductsPromos } from './useProductsPromos'
import { useProductsMarpico } from './useProductsMarpico'
import { useProductStockSur } from './useProductStockSur'

const {
  isLoadingProductsPromosComposable,
  getProductsPromos
} = useProductsPromos()

const {
  isLoadingProductsMarpicoComposable,
  getProductsMarpico
} = useProductsMarpico()

const {
  isLoadingProductsStockSurComposable,
  getProductsStockSur
} = useProductStockSur()

export {
  // Promos API
  isLoadingProductsPromosComposable,
  getProductsPromos,
  
  // Marpico API
  isLoadingProductsMarpicoComposable,
  getProductsMarpico,
  
  // StockSur API
  isLoadingProductsStockSurComposable,
  getProductsStockSur,
}
