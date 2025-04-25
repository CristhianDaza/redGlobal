import type { MarpicoMaterial } from '@/types/marpico.d';
import type { PromosProductChild } from '@/types/promos.d';
import type { ImagesRedGlobal } from '@/types/common.d';
import { StockSurVariant } from '@/types/stocksur.d';
import noImage from '@/assets/images/no-image.jpg';

export const constructImagesPromos = (
  children: PromosProductChild[],
  mainImage: string[]
): ImagesRedGlobal[] => {
  const images: ImagesRedGlobal[] = [];

  if (children) {
    children.forEach(child => {
      if (child?.imagenesHijo) {
        images.push({
          urlImage: child.imagenesHijo,
          color: child.color.charAt(0).toUpperCase() + child.color.slice(1).toLowerCase(),
          id: parseInt(child.skuHijo.replace(/\D/g, '')) || 0
        });
      }
    });
  }

  if (mainImage.length > 0) {
    images.push({
      urlImage: mainImage,
      color: '',
      id: 0
    });
  }

  return images;
};

export const constructImagesStockSur = (variants: StockSurVariant[] | undefined): ImagesRedGlobal[] => {
  if (!variants || !Array.isArray(variants)) return []

  return variants.map(variant => ({
    urlImage: [variant.picture?.original || noImage],
    color: variant.color?.name || '',
    id: variant.id
  }));
};

export const constructImagesMarpico = (materials: MarpicoMaterial[]): ImagesRedGlobal[] => {
  const images: ImagesRedGlobal[] = []
  materials.forEach(material => {
    images.push({
      urlImage: material.imagenes || [noImage],
      color: material.color_nombre,
      id: material.codigo
    })
  })
  return images
};
