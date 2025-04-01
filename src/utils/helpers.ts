import type { ProductsRedGlobal } from '../types/common';

import { normalizeString } from './';

export const filterProductsHelper = (products: ProductsRedGlobal[], searchTerm: string) => {
  // Si no hay término de búsqueda, devolver todos los productos
  if (!searchTerm.trim()) return products;

  const normalizedSearchTerm = searchTerm.toLowerCase().trim().replace(/\s+/g, '');
  
  return products.filter(product => {
    const productName = normalizeString(product.name)
    const productDescription = normalizeString(product.description)
    const productMaterial = normalizeString(product.material)
    const productCategory = normalizeString(product.category || '')
    const normalizedId = product.id.toString().toLowerCase().replace(/\s+/g, '')

    // Buscar coincidencia en cualquier campo
    return productName.includes(normalizedSearchTerm) ||
      productDescription.includes(normalizedSearchTerm) ||
      productMaterial.includes(normalizedSearchTerm) ||
      productCategory.includes(normalizedSearchTerm) ||
      normalizedId.includes(normalizedSearchTerm);
  });
}

export const formatNumber = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const getRelativeTime = (dateString: string | Date | null): string => {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const timeRules = [
      { limit: 60, divisor: 1, unit: ['un momento', 'un momento'], immediate: true },
      { limit: 3600, divisor: 60, unit: ['minuto', 'minutos'] },
      { limit: 86400, divisor: 3600, unit: ['hora', 'horas'] },
      { limit: 604800, divisor: 86400, unit: ['día', 'días'] },
      { limit: 2592000, divisor: 604800, unit: ['semana', 'semanas'] },
      { limit: 31536000, divisor: 2592000, unit: ['mes', 'meses'] },
      { limit: Infinity, divisor: 31536000, unit: ['año', 'años'] }
  ];

  const rule = timeRules.find(rule => diffInSeconds < rule.limit);
  if (rule?.immediate) return 'Hace ' + rule.unit[0] + '.';

  const value = Math.floor(diffInSeconds / rule!.divisor);
  const unit = value === 1 ? rule!.unit[0] : rule!.unit[1];
  
  return `Hace ${value} ${unit}.`;
};