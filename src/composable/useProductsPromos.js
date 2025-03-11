import { ref } from 'vue'
import { getAllProductsPromos, getStockPromos } from '../api'
import {
  constructImagesPromos,
  constructPackagingPromos,
  constructTableQuantityPromos,
  formatText,
} from '../utils'

export function useProductsPromos() {
  const isLoadingProductsPromosComposable = ref(false)
  
  const getProductsPromos = async () => {
    try {
      isLoadingProductsPromosComposable.value = true
      const [
        { response: productsPromos },
        { Stocks: stockPromos}
      ] = await Promise.all([
        getAllProductsPromos(),
        getStockPromos()
      ])
      const products =  productsPromos.map(product => _normalizeProducts(product, stockPromos))
      isLoadingProductsPromosComposable.value = false
      return products
    } catch (error) {
      console.error('Error in getProducts:', error)
      return error
    }
  }
  
  const _normalizeProducts = (product, stock) => {
    return {
      api: 'promos',
      areaPrinting: formatText(product?.impresion?.areaImpresion),
      description: formatText(product?.descripcion),
      discount: null,
      id: product?.skuPadre,
      images: constructImagesPromos(product?.hijos, product?.imagenesPadre),
      mainImage: product?.imagenesPadre.length > 0 ? product?.imagenesPadre?.[0] : '../assets/images/no-image.jpg',
      material: formatText(product?.material),
      name: `${formatText(product?.nombrePadre, true)}${product?.capacidad !== '' ? ` - ${product?.capacidad}` : ''}`,
      packaging: constructPackagingPromos(product?.paquete),
      printing: formatText(product?.impresion.tecnicaImpresion),
      size: product?.medidas,
      tableQuantity: constructTableQuantityPromos(product?.hijos, stock),
      totalProducts: constructTableQuantityPromos(product?.hijos, stock)
    }
  }
  
  return {
    isLoadingProductsPromosComposable,
    getProductsPromos
  }
}
