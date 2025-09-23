/**
 * Utilidad para formatear números de manera consistente en toda la aplicación
 * Usa el formato colombiano (es-CO) para mantener consistencia
 */

/**
 * Formatea un número como moneda colombiana
 * @param value - El valor numérico a formatear
 * @param showCurrency - Si mostrar el símbolo de moneda (por defecto false)
 * @returns El número formateado con separadores de miles
 */
export function formatCurrency(value: number | string | null | undefined, showCurrency: boolean = false): string {
  // Convertir a número si es string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Manejar valores nulos, undefined o NaN
  if (numValue == null || isNaN(numValue)) {
    return showCurrency ? '$0' : '0';
  }

  // Formatear usando configuración colombiana
  const formatted = numValue.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return showCurrency ? `$${formatted}` : formatted;
}

/**
 * Formatea un número simple (sin símbolo de moneda)
 * @param value - El valor numérico a formatear
 * @returns El número formateado con separadores de miles
 */
export function formatNumber(value: number | string | null | undefined): string {
  return formatCurrency(value, false);
}

/**
 * Formatea un precio con símbolo de peso
 * @param value - El valor numérico a formatear
 * @returns El precio formateado con $ y separadores de miles
 */
export function formatPrice(value: number | string | null | undefined): string {
  return formatCurrency(value, true);
}

/**
 * Convierte un string formateado de vuelta a número
 * @param formattedValue - El valor formateado como string
 * @returns El número sin formato
 */
export function parseFormattedNumber(formattedValue: string): number {
  if (!formattedValue) return 0;
  
  // Remover símbolos de moneda y espacios
  const cleanValue = formattedValue
    .replace(/[$\s]/g, '')
    .replace(/\./g, '') // Remover puntos (separadores de miles)
    .replace(/,/g, '.'); // Convertir comas decimales a puntos
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Valida que un valor sea un número válido para precios
 * @param value - El valor a validar
 * @returns true si es un número válido, false en caso contrario
 */
export function isValidPrice(value: any): boolean {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return typeof numValue === 'number' && !isNaN(numValue) && numValue >= 0;
}

/**
 * Calcula el precio con aumento para un usuario específico
 * @param basePrice - El precio base
 * @param priceIncrease - El porcentaje de aumento (ej: 15 para 15%)
 * @returns El precio con aumento aplicado
 */
export function calculatePriceWithIncrease(basePrice: number, priceIncrease: number = 0): number {
  if (!isValidPrice(basePrice) || priceIncrease < 0) {
    return basePrice;
  }
  
  const finalPrice = basePrice * (1 + priceIncrease / 100);
  return Math.ceil(finalPrice);
}

/**
 * Calcula el precio con IVA (19%)
 * @param price - El precio base
 * @returns El precio con IVA incluido
 */
export function calculatePriceWithIva(price: number): number {
  if (!isValidPrice(price)) {
    return price;
  }
  
  return Math.ceil(price * 1.19);
}

/**
 * Formatea un precio aplicando lógica de negocio (aumento de usuario + IVA opcional)
 * @param basePrice - El precio base
 * @param priceIncrease - El porcentaje de aumento del usuario
 * @param includeIva - Si incluir IVA en el cálculo
 * @returns El precio formateado con símbolo de peso
 */
export function formatPriceWithBusinessLogic(
  basePrice: number, 
  priceIncrease: number = 0, 
  includeIva: boolean = false
): string {
  let finalPrice = calculatePriceWithIncrease(basePrice, priceIncrease);
  
  if (includeIva) {
    finalPrice = calculatePriceWithIva(finalPrice);
  }
  
  return formatPrice(finalPrice);
}
