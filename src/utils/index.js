import { formatText, cleanText } from './text';
import { constructImagesPromos, constructImagesStockSur } from './images'
import {
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
  formatText,
  cleanText,
  
  // Formatters
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
}
