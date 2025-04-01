import { formatText, cleanText, normalizeString } from './text';
import { constructImagesPromos, constructImagesStockSur } from './images';
import { filterProductsHelper, formatNumber, getRelativeTime } from './helpers';
import {
  combineProducts,
  constructCategoryMarpico,
  constructCategoryStockSur,
  constructLabelsMarpico,
  constructPackagingMarpico,
  constructPackagingPromos,
  constructPackingStockSur,
  constructPrintingStockSur,
  constructTableQuantityMarpico,
  constructTableQuantityPromos,
  constructTableQuantityStockSur,
  constructTotalProductsMarpico,
  constructTotalProductsStockSur,
  getDiscountsMarpico,
  constructSizeMarpico,
  constructTotalProductsPromos,
} from './formatters';

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
  constructTableQuantityMarpico,
  constructTableQuantityPromos,
  constructTableQuantityStockSur,
  constructTotalProductsMarpico,
  constructTotalProductsStockSur,
  getDiscountsMarpico,
  constructSizeMarpico,
  constructTotalProductsPromos,

  // Images
  constructImagesPromos,
  constructImagesStockSur,
  
  // Helpers
  filterProductsHelper,
  formatNumber,
  getRelativeTime,
};
