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