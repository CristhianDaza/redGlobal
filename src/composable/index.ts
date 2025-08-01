import { useFilters } from '@/composable/useFilters';
import { useProductStockSur } from '@/composable/useProductStockSur';
import { useProductsCataProm } from '@/composable/useProductsCataProm';
import { useProductsMarpico } from '@/composable/useProductsMarpico';
import { useProductsPromos } from '@/composable/useProductsPromos';
import { useForm} from "@/composable/useForm.ts";

import { useMenuAdmin, useCategoryAdmin, useQuoteAdmin, useUserAdmin, useCatalogAdmin, useHeroAdmin, useOurClientAdmin } from '@/composable/admin/';

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
  useHeroAdmin,
  useOurClientAdmin,

  useWhatsApp,
  useIsMobile
};
