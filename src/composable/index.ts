import { useFilters } from '@/composable/useFilters';
import { useProductStockSur } from '@/composable/useProductStockSur';
import { useProductsCataProm } from '@/composable/useProductsCataProm';
import { useProductsMarpico } from '@/composable/useProductsMarpico';
import { useProductsPromos } from '@/composable/useProductsPromos';
import { useForm} from "@/composable/useForm.ts";

import { useMenuAdmin } from '@/composable/admin/';
import { useCategoryAdmin } from '@/composable/admin/';
import { useQuoteAdmin } from '@/composable/admin/';
import { useUserAdmin } from '@/composable/admin/';
import { useCatalogAdmin } from '@/composable/admin/';

import { useWhatsApp } from '@/composable/useWhatsApp';
import { useIsMobile } from '@/composable/useIsMobile';

export {
  useFilters,
  useProductStockSur,
  useProductsCataProm,
  useProductsMarpico,
  useProductsPromos,
  useForm,

  // Admin
  useMenuAdmin,
  useCategoryAdmin,
  useQuoteAdmin,
  useUserAdmin,
  useCatalogAdmin,

  useWhatsApp,
  useIsMobile
};
