const _processString = (input) => {
  if (typeof input !== 'string') {
    return ''
  }
  const lowerCased = input.toLowerCase()
  return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1)
}

export const constructPackagingPromos = (packaging) => {
  if (!packaging) return '';
  
  const parts = [];
  
  if (packaging.alto) parts.push(`${packaging.alto} cm de altura`);
  if (packaging.largo) parts.push(`${packaging.largo} cm de largo`);
  if (packaging.ancho) parts.push(`${packaging.ancho} cm de ancho`);
  if (packaging.pesoBruto) parts.push(`Peso bruto: ${packaging.pesoBruto} ${packaging.unidadPeso}`);
  if (packaging.pesoNeto) parts.push(`Peso neto: ${packaging.pesoNeto} ${packaging.unidadPeso}`);
  if (packaging.PiezasCaja) parts.push(`Contiene ${packaging.PiezasCaja} piezas por caja`);
  if (packaging.cajaIndividual) parts.push(`Caja individual: ${packaging.cajaIndividual === 'SI' ? 'Sí' : 'No'}`);
  
  return parts.join(' | ');
};


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
