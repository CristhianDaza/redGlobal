import { useFilters } from '@/composable/useFilters';
import { useProductStockSur } from '@/composable/useProductStockSur';
import { useProductsCataProm } from '@/composable/useProductsCataProm';
import { useProductsMarpico } from '@/composable/useProductsMarpico';
import { useProductsPromos } from '@/composable/useProductsPromos';

import { useMenuAdmin } from '@/composable/admin/';
import { useCategoryAdmin } from '@/composable/admin/';
import { useQuoteAdmin } from '@/composable/admin/';
import { useUserAdmin } from '@/composable/admin/';

export {
  useFilters,
  useProductStockSur,
  useProductsCataProm,
  useProductsMarpico,
  useProductsPromos,

  // Admin
  useMenuAdmin,
  useCategoryAdmin,
  useQuoteAdmin,
  useUserAdmin
};
