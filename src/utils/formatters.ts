import type { MarpicoProduct, MarpicoMaterial } from '@/types/marpico.d';
import type { Label, TableEntry, ProductsRedGlobal } from '@/types/common.d';
import type { PromosPackaging, PromosProductChild, Stock } from '@/types/promos.d';
import type { StockSurProduct, StockSurPacking, StockSurIcono, StockSurVariant } from '@/types/stocksur.d';
import type { CataPromProduct, CataPromCategory } from '@/types/cataprom.d';

const _processString = (input: string | undefined): string => {
  if (typeof input !== 'string') {
    return '';
  }
  const lowerCased = input.toLowerCase();
  return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
};

export const constructPackagingPromos = (packaging: PromosPackaging | undefined): string => {
  if (!packaging) return ''

  const parts = []

  if (packaging.alto) parts.push(`${packaging.alto} cm de altura`)
  if (packaging.largo) parts.push(`${packaging.largo} cm de largo`)
  if (packaging.ancho) parts.push(`${packaging.ancho} cm de ancho`)
  if (packaging.pesoBruto) parts.push(`Peso bruto: ${packaging.pesoBruto} ${packaging.unidadPeso}`)
  if (packaging.pesoNeto) parts.push(`Peso neto: ${packaging.pesoNeto} ${packaging.unidadPeso}`)
  if (packaging.PiezasCaja) parts.push(`Contiene ${packaging.PiezasCaja} piezas por caja`)
  if (packaging.cajaIndividual) parts.push(`Caja individual: ${packaging.cajaIndividual === 'SI' ? 'Sí' : 'No'}`)

  return parts.join(' | ')
};

export const constructTableQuantityPromos = (
  children: PromosProductChild[] | undefined,
  stockData: Stock[]
): TableEntry[] => {
  const table: TableEntry[] = []
  if (children) {
    children.forEach(child => {
      const stockEntry = stockData.find(item => item.Material === child.skuHijo)
      if (stockEntry) {
        table.push({
          color: _processString(child.color),
          colorName: _processString(child.color),
          quantity: stockEntry.Stock,
          price: child.precio,
          type: child.tipo,
          sku: child.skuHijo
        })
      }
    })
  }
  return table
};

export const constructTotalProductsPromos = (
  product: PromosProductChild[],
  stockData: Stock[]
): number => {
  const table: TableEntry[] = []
  if (product) {
    product.forEach(child => {
      const stockEntry = stockData.find(item => item.Material === child.skuHijo)
      if (stockEntry) {
        table.push({
          color: _processString(child.color),
          colorName: _processString(child.color),
          quantity: stockEntry.Stock,
          price: child.precio,
          type: child.tipo,
          sku: child.skuHijo
        })
      }
    })
  }
  return table.reduce((acc, item) => acc + item.quantity, 0)
};

export const constructCategoryMarpico = (product: MarpicoProduct): string[] => {
  return [
    product?.subcategoria_1?.nombre,
    product?.subcategoria_2?.nombre,
    product?.subcategoria_3?.nombre,
    product?.subcategoria_4?.nombre,
    product?.subcategoria_5?.nombre
  ].filter(Boolean).map(_processString)
};

export const getDiscountsMarpico = (materials: MarpicoMaterial[]): number | null => {
  const discounts = materials
    .filter(material => material.descuento !== 0)
    .map(material => material.descuento)
  return discounts.length > 0 ? discounts[0] : null
};

export const constructLabelsMarpico = (product: MarpicoProduct): Label[] => {
  const parts: Label[] = [];
  if (product?.etiquetas) {
    product.etiquetas.forEach(label => {
      parts.push({
        id: label.id,
        name: label.nombre,
        image: label.imagen
      })
    })
  }
  return parts
}

export const constructPackagingMarpico = (packaging: MarpicoProduct | undefined): string => {
  if (!packaging) return ''

  const parts = []

  if (packaging.empaque_unds_caja) parts.push(`${packaging.empaque_unds_caja} unidades por caja`)
  if (packaging.empaque_largo) parts.push(`Largo: ${packaging.empaque_largo} cm`)
  if (packaging.empaque_ancho) parts.push(`Ancho: ${packaging.empaque_ancho} cm`)
  if (packaging.empaque_alto) parts.push(`Alto: ${packaging.empaque_alto} cm`)
  if (packaging.empaque_peso_neto) parts.push(`Peso neto: ${packaging.empaque_peso_neto} g`)
  if (packaging.empaque_peso_bruto) parts.push(`Peso bruto: ${packaging.empaque_peso_bruto} g`)
  if (packaging.cajas_individuales) parts.push(`Cajas individuales: ${packaging.cajas_individuales}`)

  return parts.join(' | ')
}

export const constructSizeMarpico = (size: MarpicoProduct | undefined): string => {
  if (!size) return ''

  const parts: string[] = []

  if (size.medidas_largo) parts.push(`Largo: ${Number(size.medidas_largo)} cm`)
  if (size.medidas_ancho) parts.push(`Ancho: ${Number(size.medidas_ancho)} cm`)
  if (size.medidas_alto) parts.push(`Alto: ${Number(size.medidas_alto)} cm`)
  if (size.medidas_diametro) parts.push(`Diámetro: ${Number(size.medidas_diametro)} cm`)

  return parts.join(' | ')
}

export const constructTableQuantityMarpico = (materials: MarpicoMaterial[] | undefined): TableEntry[] => {
  if (!materials) return [];
  const quantity: TableEntry[] = []

  materials.forEach(material => {
    const discountFactor = material.descuento / 100
    const discountedPrice = material.precio + (material.precio * discountFactor)

    const item: Partial<TableEntry> = {
      color: material.color_nombre,
      colorName: `${material.color_nombre}${material.variedad?.trim() && material.variedad.trim() !== '' ? ` (${material.variedad.trim()})` : ''}`,
      quantity: material.inventario_almacen?.[0]?.cantidad,
      inTracking: material.trackings_importacion.length > 0 ? material.trackings_importacion[0].cantidad : null,
      statusTracking: material.trackings_importacion.length > 0 ? material.trackings_importacion[0].estado : null,
      dataTracking: material.trackings_importacion.length > 0 ? material.trackings_importacion[0].fecha : null,
      lastUpdateTracking: material.trackings_importacion.length > 0 ? material.trackings_importacion[0].ultima_actualizacion : null,
      idColorTracking: material.trackings_importacion.length > 0 ? material.trackings_importacion[0].material_id : null,
      price: discountedPrice
    }

    Object.keys(item).forEach(key => {
      if (item[key as keyof TableEntry] == null) {
        delete item[key as keyof TableEntry]
      }
    })

    quantity.push(item as TableEntry)
  })

  return quantity
}

export const constructTotalProductsMarpico = (materials: MarpicoMaterial[]): number => {
  let totalProducts = 0
  materials.forEach(material => {
    totalProducts += material.inventario_almacen?.[0]?.cantidad
  })
  return totalProducts
}

export const constructCategoryStockSur = (product: StockSurProduct): string[] => {
  return product?.categories?.map(category => category.name).filter(Boolean) || []
};

export const constructPackingStockSur = (packing: StockSurPacking | undefined): string => {
  if (!packing) return ''

  const parts = []

  if (packing.width) parts.push(`Ancho: ${packing.width} cm`)
  if (packing.height) parts.push(`Alto: ${packing.height} cm`)
  if (packing.depth) parts.push(`Profundidad: ${packing.depth} cm`)
  if (packing.volume) parts.push(`Volumen: ${packing.volume} m³`)
  if (packing.quantity) parts.push(`Cantidad por caja: ${packing.quantity}`)
  if (packing.weight) parts.push(`Peso: ${packing.weight} kg`)

  return parts.length > 0 ? parts.join(' | ') : ''
}

export const constructPrintingStockSur = (suggestions: StockSurIcono[] | undefined) => {
  if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) {
    return ''
  }

  const filteredSuggestions = suggestions
    .filter(suggestion => ![1, 92, 93].includes(suggestion.id))
    .map(suggestion => suggestion.label.trim())

  if (filteredSuggestions.length === 0) {
    return ''
  }

  const formattedSuggestions = filteredSuggestions.length > 1
    ? filteredSuggestions.slice(0, -1).join(', ') + ' o ' + filteredSuggestions.slice(-1)
    : filteredSuggestions[0]

  return `${formattedSuggestions}.`
}

export const constructTableQuantityStockSur = (variants: StockSurVariant[]): TableEntry[] => {
  return variants.map(variant => ({
    color: variant.color?.name,
    colorName: variant.color?.name,
    quantity: variant.stock_available,
    price: variant.list_price,
  }))
}

export const constructTotalProductsStockSur = (variants: StockSurVariant[] | undefined): number => {
  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    return 0
  }

  return variants.reduce((total, variant) => total + (variant.stock_available || 0), 0)
};

export const combineProducts = (docs: any[]): any[] => {
  const combinedProducts: ProductsRedGlobal[] = []

  docs.forEach(doc => {
    const products = doc.data().products
    if (Array.isArray(products)) {
      combinedProducts.push(...products)
    } else {
      console.warn('Without products:', doc)
    }
  })

  return combinedProducts
};

export const constructCategoryCataProm = (
  product: CataPromProduct,
  categories: CataPromCategory[]
): string[] => {
  const matchedCategory = categories.find(category => category.id === product.idCategoria);
  return matchedCategory ? [matchedCategory.nombre] : [];
};

export const transformColPhone = (phone: string, normalized = false): string => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  const country = cleaned.slice(0, 3);
  const subscriber = cleaned.slice(3);
  if (normalized) {
    return (country + subscriber).replace(/\D/g, ''); // "573312517140"
  }

  const p1 = subscriber.slice(0, 3);
  const p2 = subscriber.slice(3, 6);
  const p3 = subscriber.slice(6);
  return `(${country}) ${p1} ${p2} ${p3}`;
}
