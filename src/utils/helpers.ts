import type { ProductsRedGlobal } from '../types/common';

import { normalizeString } from './';

export const filterProductsHelper = (products: ProductsRedGlobal[], searchTerm: string) => {
  const keywords = normalizeString(searchTerm)
    .split(/\s+/)
    .map(keyword => _singularize(keyword.trim()))
  
  return products.filter(product => {
    const productName = normalizeString(product.name).split(/\s+/).map(_singularize).join(' ')
    const productDescription = normalizeString(product.description).split(/\s+/).map(_singularize).join(' ')
    const productMaterial = normalizeString(product.material).split(/\s+/).map(_singularize).join(' ')
    const productCategory = normalizeString(product.category || '').split(/\s+/).map(_singularize).join(' ')
    const productId = normalizeString(product.id)
    
    return keywords.every(keyword =>
      productName.includes(keyword) ||
      productDescription.includes(keyword) ||
      productMaterial.includes(keyword) ||
      productCategory.includes(keyword) ||
      productId.includes(keyword)
    )
  })
}

const _singularize = (word: string): string => {
  return word.replace(/(as|es|os|is|us|s)$/, '');
};

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