const _processString = (input) => {
  if (typeof input !== 'string') {
    return ''
  }
  const lowerCased = input.toLowerCase()
  return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1)
}

export const constructPackagingPromos = (packaging) => {
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
}


export const constructTableQuantityPromos = (children, stockData) => {
  const table = []
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
}

export const constructCategoryMarpico = (product) => {
  return [
    product?.subcategoria_1?.nombre,
    product?.subcategoria_2?.nombre,
    product?.subcategoria_3?.nombre,
    product?.subcategoria_4?.nombre,
    product?.subcategoria_5?.nombre
  ].filter(Boolean)
}

export const getDiscountsMarpico = (materials) => {
  const discounts = materials
    .filter(material => material.descuento !== 0)
    .map(material => material.descuento)
  return discounts.length > 0 ? discounts[0] : null
}

export const constructLabelsMarpico = (product) => {
  const parts = []
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

export const constructPackagingMarpico = (packaging) => {
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

export const constructSizeMarpico = (size) => {
  if (!size) return ''
  
  const parts = []
  
  if (size.medidas_largo) parts.push(`Largo: ${Math.trunc(size.medidas_largo)} cm`)
  if (size.medidas_ancho) parts.push(`Ancho: ${Math.trunc(size.medidas_ancho)} cm`)
  if (size.medidas_alto) parts.push(`Alto: ${Math.trunc(size.medidas_alto)} cm`)
  if (size.medidas_diametro) parts.push(`Diámetro: ${size.medidas_diametro} cm`)
  
  return parts.join(' | ')
}

export const constructTableQuantityMarpico = (materials) => {
  const quantity = []
  
  materials.forEach(material => {
    const discountFactor = material.descuento / 100
    const discountedPrice = material.precio + (material.precio * discountFactor)
    
    const item = {
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
      if (item[key] == null) {
        delete item[key]
      }
    })
    
    quantity.push(item)
  })
  
  return quantity
}

export const constructTotalProductsMarpico = (materials) => {
  let totalProducts = 0
  materials.forEach(material => {
    totalProducts += material.inventario_almacen?.[0]?.cantidad
  })
  return totalProducts
}
