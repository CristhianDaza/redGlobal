import type { HtmlEntities } from '../types/config'

const _decodeHtmlEntities = (text: string | undefined): string | undefined => {
  const htmlEntities: HtmlEntities = {
    '&Aacute;': 'Á',
    '&Eacute;': 'É',
    '&Iacute;': 'Í',
    '&Oacute;': 'Ó',
    '&Uacute;': 'Ú',
    '&aacute;': 'á',
    '&eacute;': 'é',
    '&iacute;': 'í',
    '&oacute;': 'ó',
    '&uacute;': 'ú',
    '&Ntilde;': 'Ñ',
    '&ntilde;': 'ñ'
  };
  
  if (!text) return text;
  return text.replace(/&[A-Za-z]+;/g, match => htmlEntities[match] || match);
};

const _alwaysUppercase: string[] = ['USB', 'LED', 'ID', 'mAh', 'GB', 'TB', 'HD', 'TV'];

export const formatText = (text: string | undefined, isUpperCase = false): string => {
  const decodedText = _decodeHtmlEntities(text);
  if (!decodedText) return '';
  
  if (isUpperCase) {
    const words = decodedText.toLowerCase().split(' ');
    return words
      .map(word => _alwaysUppercase.includes(word.toUpperCase()) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return decodedText;
};

export const cleanText = (text: string | undefined): string => {
  if (!text) return '';
  return text.replace(/\\?"/g, '').trim();
};

export const normalizeString = (str: string | string[] | undefined): string => {
  if (!str) return '';
  if (Array.isArray(str)) str = str.join(' ');
  return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};
