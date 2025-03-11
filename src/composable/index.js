import { useProductsPromos } from './useProductsPromos'
import { useProductsMarpico } from './useProductsMarpico'
import { useProductStockSur } from './useProductStockSur'
import { useProductsCataProm } from './useProductsCataProm.js'

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

const {
  isLoadingProductsCataPromComposable,
  getProductsCataProm
} = useProductsCataProm()

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
  
  // CataProm API
  isLoadingProductsCataPromComposable,
  getProductsCataProm,
}
