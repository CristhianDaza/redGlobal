import type { ProductsRedGlobal } from '@/types/common.d';

import { normalizeString } from './';

export const filterProductsHelper = (products: ProductsRedGlobal[], searchTerm: string) => {
  if (!searchTerm.trim()) return products;

  const normalizedSearchTerm = searchTerm.toLowerCase().trim().replace(/\s+/g, '');

  return products.filter(product => {
    const productName = normalizeString(product.name)
    const productDescription = normalizeString(product.description)
    const productMaterial = normalizeString(product.material)
    const productCategory = normalizeString(product.category || '')
    const normalizedId = product.id.toString().toLowerCase().replace(/\s+/g, '')

    return productName.includes(normalizedSearchTerm) ||
      productDescription.includes(normalizedSearchTerm) ||
      productMaterial.includes(normalizedSearchTerm) ||
      productCategory.includes(normalizedSearchTerm) ||
      normalizedId.includes(normalizedSearchTerm);
  });
}

export const formatNumber = (number: number | undefined): string => {
  if (!number) return '0';
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
  if (rule?.immediate) return 'Hace ' + rule.unit[0];

  const value = Math.floor(diffInSeconds / rule!.divisor);
  const unit = value === 1 ? rule!.unit[0] : rule!.unit[1];

  return `Hace ${value} ${unit}`;
};

const _colors = new Map([
  ['amarillo limon', '#FFFFE0'],
  ['amarillo metalico', '#FFD700'],
  ['amarillo neon', '#FFFF33'],
  ['amarillo solido', '#FFFF00'],
  ['amarillo traslucido', '#FFFF0088'],
  ['amarillo', '#FFFF00'],
  ['azul', '#0000FF'],
  ['azul cielo', '#87CEEB'],
  ['azul claro', '#ADD8E6'],
  ['azul metalico', '#0000FF88'],
  ['azul navy', '#000080'],
  ['azul oscuro', '#00008B'],
  ['azul pastel', '#AEC6CF'],
  ['azul petroleo', '#004953'],
  ['azul reflex', '#002366'],
  ['azul rey / negro', '#4169E1'],
  ['azul rey / rsd, amr, vr', '#4169E1'],
  ['azul rey solido', '#4169E1'],
  ['azul rey traslucido', '#4169E188'],
  ['azul rey', '#184ae3'],
  ['azul royal', '#4169E1'],
  ['azul traslucido', '#0000FF88'],
  ['azul turquesa', '#40E0D0'],
  ['azul y verde', '#00FF7F'],
  ['bamboo', '#E3A857'],
  ['bambu', '#E3A857'],
  ['beige', '#F5F5DC'],
  ['blanco / azul oscuro', '#FFFFFF'],
  ['blanco / azul rey', '#FFFFFF'],
  ['blanco / blanco', '#FFFFFF'],
  ['blanco / colores', '#FFFFFF'],
  ['blanco / negro', '#FFFFFF'],
  ['blanco / rojo', '#FFFFFF'],
  ['blanco / rosado neon', '#FFFFFF'],
  ['blanco / rsd, amr, vr', '#FFFFFF'],
  ['blanco / verde', '#FFFFFF'],
  ['blanco solido', '#FFFFFF'],
  ['blanco traslucido', '#FFFFFF80'],
  ['blanco', '#FFFFFF'],
  ['burgundy', '#800020'],
  ['cafe', '#6F4E37'],
  ['camel', '#C19A6B'],
  ['celeste', '#87CEEB'],
  ['cian', '#00FFFF'],
  ['fucsia', '#FF00FF'],
  ['gris metalico', '#808080'],
  ['gris oscuro', '#A9A9A9'],
  ['gris translucido', '#80808080'],
  ['gris', '#808080'],
  ['khaki', '#F0E68C'],
  ['lavanda', '#E6E6FA'],
  ['lima', '#00FF00'],
  ['marron', '#A52A2A'],
  ['morado pastel', '#DCC6E0'],
  ['morado solido', '#800080'],
  ['morado traslucido', '#80008088'],
  ['morado', '#800080'],
  ['naranja neon / blanco', '#FFFFFF'],
  ['naranja neon', '#FF6600'],
  ['naranja solido', '#FFA500'],
  ['naranja traslucido', '#FFA50088'],
  ['naranja', '#ff4d00'],
  ['natural', '#F5F5DC'],
  ['negro / azul oscuro', '#000000'],
  ['negro / azul rey', '#000000'],
  ['negro / gris', '#2F4F4F'],
  ['negro / negro', '#000000'],
  ['negro / rojo', '#000000'],
  ['negro translucido', '#00000080'],
  ['negro translucido', '#00000080'],
  ['negro traslucido', '#00000080'],
  ['negro', '#000000'],
  ['oro', '#FFD700'],
  ['plata', '#C0C0C0'],
  ['plateado / azul rey', '#4169E1'],
  ['plateado / negro', '#C0C0C0'],
  ['plateado', '#C0C0C0'],
  ['rojo metalico', '#800020'],
  ['rojo solido', '#FF0000'],
  ['rojo traslucido', '#FF000088'],
  ['rojo', '#FF0000'],
  ['rojo metalizado', '#CB1B45'],
  ['rosa neon', '#FF00FF'],
  ['rosa pastel', '#FFD1DC'],
  ['rosa', '#FFC0CB'],
  ['rosado oro', '#B76E79'],
  ['rosado traslucido', '#FFC0CB88'],
  ['rosado', '#bf61ff'],
  ['rosado, amarillo, azul', '#FFC0CB'],
  ['rosado, amarillo, verde', '#FFC0CB'],
  ['rosado, amarillo. verde', '#FFC0CB'],
  ['silver', '#C0C0C0'],
  ['tinto', '#800020'],
  ['transparente / azul rey', '#FFFFFF00'],
  ['transparente / negro', '#FFFFFF00'],
  ['transparente', '#FFFFFF00'],
  ['tricolor', '#FFD700'],
  ['turquesa', '#40E0D0'],
  ['verde cali', '#007A33'],
  ['verde esmeralda traslucido', '#50C87888'],
  ['verde esmeralda', '#50C878'],
  ['verde limon', '#32CD32'],
  ['verde metalico', '#50C878'],
  ['verde neon', '#00FF00'],
  ['verde oscuro', '#006400'],
  ['verde pastel', '#77DD77'],
  ['verde translucido', '#00800080'],
  ['verde traslucido', '#00800080'],
  ['verde', '#008000'],
  ['vinotinto', '#800000'],
  ['violeta', '#EE82EE']
])

const _normalizeColorName = (name: string): string => {
  if (!name) return ''
  return name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export const formatColor = (color: string): string => {
  const normalizedColor = _normalizeColorName(color)
  return _colors.get(normalizedColor) || '#FFFFFF'
}
