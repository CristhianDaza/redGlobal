export function formatCurrency(value: number | string | null | undefined, showCurrency: boolean = false): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (numValue == null || isNaN(numValue)) {
    return showCurrency ? '$0' : '0';
  }

  const formatted = numValue.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return showCurrency ? `$${formatted}` : formatted;
}

export function formatNumber(value: number | string | null | undefined): string {
  return formatCurrency(value, false);
}

export function formatPrice(value: number | string | null | undefined): string {
  return formatCurrency(value, true);
}

export function parseFormattedNumber(formattedValue: string): number {
  if (!formattedValue) return 0;
  
  const cleanValue = formattedValue
    .replace(/[$\s]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

export function isValidPrice(value: any): boolean {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return typeof numValue === 'number' && !isNaN(numValue) && numValue >= 0;
}

export function calculatePriceWithIncrease(basePrice: number, priceIncrease: number = 0): number {
  if (!isValidPrice(basePrice) || priceIncrease < 0) {
    return basePrice;
  }
  
  const finalPrice = basePrice * (1 + priceIncrease / 100);
  return Math.ceil(finalPrice);
}

export function calculatePriceWithIva(price: number): number {
  if (!isValidPrice(price)) {
    return price;
  }
  
  return Math.ceil(price * 1.19);
}

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
