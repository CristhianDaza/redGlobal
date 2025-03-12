import { ref } from 'vue'
import { getAllProductsStockSur } from '../api'
import {
  cleanText,
  constructCategoryStockSur,
  constructImagesStockSur,
  constructPackingStockSur,
  constructPrintingStockSur,
  constructTableQuantityStockSur,
  constructTotalProductsStockSur,
  formatText,
} from '../utils'

export function useProductStockSur() {
  const isLoadingProductsStockSurComposable = ref(false)
  
  const getProductsStockSur = async () => {
    try {
      isLoadingProductsStockSurComposable.value = true
      const products = await getAllProductsStockSur()
      const productsNormalized = products.map(product => _normalizeProducts(product))
      isLoadingProductsStockSurComposable.value = false
      return productsNormalized
    } catch (error) {
      console.error('Error in getProducts:', error)
      return error
    }
  }
  
  const _normalizeProducts = product => {
    return {
      api: 'stockSur',
      areaPrinting: null,
      category: constructCategoryStockSur(product),
      description: product?.description,
      discount: null,
      id: product?.code,
      images: constructImagesStockSur(product.variants),
      labels: null,
      mainImage: constructImagesStockSur(product.variants)?.[0] || '../assets/images/no-image.jpg',
      material: null,
      name: formatText(cleanText(product?.name), true),
      packaging: constructPackingStockSur(product?.packing),
      printing: constructPrintingStockSur(product?.icons),
      size: null,
      tableQuantity: constructTableQuantityStockSur(product.variants),
      totalProducts: constructTotalProductsStockSur(product.variants)
    }
  }
  
  return {
    isLoadingProductsStockSurComposable,
    getProductsStockSur
  }
}
