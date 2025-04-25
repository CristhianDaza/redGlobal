import { formatText, cleanText, normalizeString, constructDescriptionCataProm } from './text';
import { constructImagesPromos, constructImagesStockSur, constructImagesMarpico } from './images';
import { filterProductsHelper, formatNumber, getRelativeTime, formatColor } from './helpers';
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
  constructCategoryCataProm,
} from './formatters';

export {
  // Text
  cleanText,
  formatText,
  normalizeString,
  constructDescriptionCataProm,
  
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
  constructCategoryCataProm,
  // Images
  constructImagesPromos,
  constructImagesStockSur,
  constructImagesMarpico,
  
  // Helpers
  filterProductsHelper,
  formatNumber,
  getRelativeTime,
  formatColor,
};
