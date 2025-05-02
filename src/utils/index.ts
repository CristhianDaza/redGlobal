import { formatText, cleanText, normalizeString, constructDescriptionCataProm } from './text';
import { constructImagesPromos, constructImagesStockSur, constructImagesMarpico } from './images';
import { filterProductsHelper, formatNumber, getRelativeTime, formatColor } from './helpers';
import {
  combineProducts,
  constructCategoryCataProm,
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
  constructTotalProductsPromos,
  constructTotalProductsStockSur,
  getDiscountsMarpico,
  transformColPhone,
  calculateTotalQuantity,
} from './formatters';
import { CONSTANTS } from './constants';

export {
  // Text
  cleanText,
  formatText,
  normalizeString,
  constructDescriptionCataProm,

  // Formatters
  combineProducts,
  constructCategoryCataProm,
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
  constructTotalProductsPromos,
  constructTotalProductsStockSur,
  getDiscountsMarpico,
  transformColPhone,
  calculateTotalQuantity,

  // Images
  constructImagesPromos,
  constructImagesStockSur,
  constructImagesMarpico,

  // Helpers
  filterProductsHelper,
  formatNumber,
  getRelativeTime,
  formatColor,

  // Constants
  CONSTANTS
};

