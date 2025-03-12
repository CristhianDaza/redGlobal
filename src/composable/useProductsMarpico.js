import { ref } from 'vue'
import { getAllProductsMarpico } from '../api'
import {
  constructCategoryMarpico,
  constructLabelsMarpico,
  constructPackagingMarpico,
  constructSizeMarpico,
  constructTableQuantityMarpico,
  constructTotalProductsMarpico,
  formatText,
  getDiscountsMarpico,
} from '../utils'

export function useProductsMarpico() {
  const isLoadingProductsMarpicoComposable = ref(false)
  
  const getProductsMarpico = async () => {
    try {
      isLoadingProductsMarpicoComposable.value = true
      const { results: productsMarpico } = await getAllProductsMarpico()
      const products = productsMarpico.map(product => _normalizeProducts(product))
      isLoadingProductsMarpicoComposable.value = false
      return products
    } catch (error) {
      console.error('Error in getProducts:', error)
      return error
    }
  }
  
  const _normalizeProducts = product => {
    return {
      api: 'marpico',
      areaPrinting: product?.area_impresion,
      category: constructCategoryMarpico(product),
      description: formatText(product?.descripcion_larga),
      discount: getDiscountsMarpico(product?.materiales),
      id: product?.familia,
      images: product?.imagenes,
      labels: constructLabelsMarpico(product),
      mainImage: product?.imagen === '' ? '../assets/images/no-image.jpg' : product?.imagen,
      material: formatText(product?.material),
      name: formatText(product?.descripcion_comercial),
      packaging: constructPackagingMarpico(product),
      printing: formatText(product?.tecnica_marca_tecnica),
      size: constructSizeMarpico(product),
      tableQuantity: constructTableQuantityMarpico(product?.materiales),
      totalProducts: constructTotalProductsMarpico(product?.materiales)
    }
  }
  
  return {
    isLoadingProductsMarpicoComposable,
    getProductsMarpico
  }
}
