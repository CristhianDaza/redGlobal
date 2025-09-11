const pluralRules = [
  { pattern: /^(.+)os$/, replacement: '$1o' },
  { pattern: /^(.+)as$/, replacement: '$1a' },
  { pattern: /^(.+)es$/, replacement: '$1' },
  { pattern: /^(.+)s$/, replacement: '$1' },
];

const irregularPlurals = new Map([
  ['lápices', 'lápiz'],
  ['relojes', 'reloj'],
  ['papeles', 'papel'],
  ['materiales', 'material'],
  ['animales', 'animal'],
  ['cristales', 'cristal'],
  ['metales', 'metal'],
  ['digitales', 'digital'],
  ['especiales', 'especial'],
  ['sociales', 'social'],
  ['comerciales', 'comercial'],
  ['industriales', 'industrial'],
  ['personales', 'personal'],
  ['profesionales', 'profesional'],
  ['promocionales', 'promocional'],
  ['corporativos', 'corporativo'],
  ['ejecutivos', 'ejecutivo'],
  ['deportivos', 'deportivo'],
  ['educativos', 'educativo'],
  ['creativos', 'creativo'],
  ['tecnológicos', 'tecnológico'],
  ['ecológicos', 'ecológico'],
  ['prácticos', 'práctico'],
  ['clásicos', 'clásico'],
  ['básicos', 'básico'],
  ['únicos', 'único'],
  ['típicos', 'típico'],
  ['específicos', 'específico'],
  ['genéricos', 'genérico'],
  ['numéricos', 'numérico'],
  ['gráficos', 'gráfico'],
  ['plásticos', 'plástico'],
  ['magnéticos', 'magnético'],
  ['automáticos', 'automático'],
  ['electrónicos', 'electrónico'],
  ['mecánicos', 'mecánico'],
  ['orgánicos', 'orgánico'],
  ['sintéticos', 'sintético'],
  ['artísticos', 'artístico'],
  ['turísticos', 'turístico'],
  ['domésticos', 'doméstico'],
  ['rústicos', 'rústico'],
  ['modernos', 'moderno'],
  ['antiguos', 'antiguo'],
  ['nuevos', 'nuevo'],
  ['usados', 'usado'],
  ['grandes', 'grande'],
  ['pequeños', 'pequeño'],
  ['medianos', 'mediano'],
  ['largos', 'largo'],
  ['cortos', 'corto'],
  ['anchos', 'ancho'],
  ['estrechos', 'estrecho'],
  ['altos', 'alto'],
  ['bajos', 'bajo'],
  ['gruesos', 'grueso'],
  ['delgados', 'delgado'],
  ['ligeros', 'ligero'],
  ['pesados', 'pesado'],
  ['duros', 'duro'],
  ['blandos', 'blando'],
  ['suaves', 'suave'],
  ['ásperos', 'áspero'],
  ['lisos', 'liso'],
  ['rugosos', 'rugoso'],
  ['brillantes', 'brillante'],
  ['opacos', 'opaco'],
  ['transparentes', 'transparente'],
  ['coloridos', 'colorido'],
  ['blancos', 'blanco'],
  ['negros', 'negro'],
  ['rojos', 'rojo'],
  ['azules', 'azul'],
  ['verdes', 'verde'],
  ['amarillos', 'amarillo'],
  ['naranjas', 'naranja'],
  ['morados', 'morado'],
  ['rosas', 'rosa'],
  ['grises', 'gris'],
  ['marrones', 'marrón'],
  ['dorados', 'dorado'],
  ['plateados', 'plateado'],
]);

export function pluralToSingular(word: string): string {
  if (!word || word.length < 2) return word;
  
  const normalizedWord = word.toLowerCase().trim();
  
  if (irregularPlurals.has(normalizedWord)) {
    return irregularPlurals.get(normalizedWord)!;
  }
  for (const rule of pluralRules) {
    if (rule.pattern.test(normalizedWord)) {
      return normalizedWord.replace(rule.pattern, rule.replacement);
    }
  }
  
  return word;
}

export function generateSearchVariations(query: string): string[] {
  if (!query) return [];
  
  const words = query.toLowerCase().trim().split(/\s+/);
  const variations = new Set<string>();
  
  variations.add(query.toLowerCase().trim());
  
  const singularWords = words.map(word => pluralToSingular(word));
  const singularQuery = singularWords.join(' ');
  
  if (singularQuery !== query.toLowerCase().trim()) {
    variations.add(singularQuery);
  }
  
  words.forEach(word => {
    const singular = pluralToSingular(word);
    if (singular !== word) {
      variations.add(singular);
    }
  });
  
  return Array.from(variations);
}
