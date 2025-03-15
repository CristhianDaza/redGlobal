import { formatText, cleanText, normalizeString } from './text';
import { constructImagesPromos, constructImagesStockSur } from './images'
import { filterProductsHelper } from './helpers'
import {
  combineProducts,
  constructCategoryMarpico,
  constructCategoryStockSur,
  constructLabelsMarpico,
  constructPackagingMarpico,
  constructPackagingPromos,
  constructPackingStockSur,
  constructPrintingStockSur,
  constructSizeMarpico,
  constructTableQuantityMarpico,
  constructTableQuantityPromos,
  constructTableQuantityStockSur,
  constructTotalProductsMarpico,
  constructTotalProductsStockSur,
  getDiscountsMarpico,
} from './formatters'

export {
  // Text
  cleanText,
  formatText,
  normalizeString,
  
  // Formatters
  combineProducts,
  constructCategoryMarpico,
  constructCategoryStockSur,
  constructLabelsMarpico,
  constructPackagingMarpico,
  constructPackagingPromos,
  constructPackingStockSur,
  constructPrintingStockSur,
  constructSizeMarpico,
  constructTableQuantityMarpico,
  constructTableQuantityPromos,
  constructTableQuantityStockSur,
  constructTotalProductsMarpico,
  constructTotalProductsStockSur,
  getDiscountsMarpico,
  
  // Images
  constructImagesPromos,
  constructImagesStockSur,
  
  // Helpers
  filterProductsHelper,
}
