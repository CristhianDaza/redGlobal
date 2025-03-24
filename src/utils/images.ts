import type { PromosProductChild } from '../types/promos';

import { StockSurVariant } from '@/types/stocksur';

export const constructImagesPromos = (
  children: PromosProductChild[],
  mainImage: string[]
): string[] => {
  const images: string[] = [];
  
  if (children) {
    children.forEach(child => {
      if (child?.imagenesHijo) {
        child?.imagenesHijo.forEach(image => {
          images.push(image)
        })
      }
    })
  }
  
  if (mainImage.length > 0) {
    images.push(mainImage[0]);
  }
  
  return images;
};

export const constructImagesStockSur = (variants: StockSurVariant[] | undefined): string[] => {
  if (!variants || !Array.isArray(variants)) return []
  
  return variants.map(variant => variant.picture?.original).filter(Boolean)
};
