export interface MarpicoProduct {
  familia: string;
  descripcion_comercial: string;
  descripcion_larga: string;
  material: string;
  empaque_individual: string;
  empaque_unds_caja: number;
  empaque_unds_medida: number | null;
  empaque_largo: string;
  empaque_ancho: string;
  empaque_alto: string;
  empaque_peso_neto: string;
  empaque_peso_bruto: string;
  cajas_individuales: number;
  area_impresion: string;
  medidas_largo: string | number | null;
  medidas_ancho: string | number | null;
  medidas_alto: string | number | null;
  medidas_diametro: string | number;
  medidas_peso_neto: string;
  tecnica_marca_codigo: string;
  tecnica_marca_tecnica: string;
  tecnica_marca_precio: number | null;
  tecnica_marca_num_tintas: number | null;
  tecnica_marca_descripcion: string;
  subcategoria_1: Subcategoria;
  subcategoria_2: Subcategoria | null;
  subcategoria_3: Subcategoria | null;
  subcategoria_4: Subcategoria | null;
  subcategoria_5: Subcategoria | null;
  temas: string[];
  etiquetas: Etiqueta[];
  imagenes: string[];
  materiales: MarpicoMaterial[];
  imagen: string;
}

interface Subcategoria {
  jerarquia: string;
  nombre: string;
  categoria: string;
  nombre_categoria: string;
}

interface Etiqueta {
  id: number;
  nombre: string;
  imagen: string;
}

export interface MarpicoMaterial {
  codigo: number;
  familia: string;
  variedad: string;
  color_nombre: string;
  precio: number;
  descuento: number;
  estado: string;
  inventario_almacen: InventarioAlmacen[];
  trackings_importacion: TrackingImportacion[];
  imagenes: string[];
}

interface InventarioAlmacen {
  cantidad: number;
  unidad: string;
}

interface TrackingImportacion {
  id: string;
  estado: string;
  fecha: string;
  cantidad: number;
  unidad: string;
  ultima_actualizacion: string;
  material_id: number;
}

export interface MarpicoResponse {
  results: MarpicoProduct[];
  count: number;
  next: string | null;
  previous: string | null;
}