export interface CataPromCategory {
  idParent: number | null;
  nombre: string;
  id: number;
}

export interface CataPromProduct {
  referencia: string;
  nombre: string;
  resumen: string;
  idCategoria: number;
  palabrasClaveSeo: string;
  descripcionSeo: string;
  urlAmigable: string;
  descripcionProducto: string;
  precio1: number;
  precio2: number;
  precio3: number;
  precio4: number;
  precio5: number;
  descripcionPrecio1: string;
  descripcionPrecio2: string;
  descripcionPrecio3: string;
  descripcionPrecio4: string;
  descripcionPrecio5: string;
  imageUrl: string;
  id: number;
}

export interface CataPromStock {
  referencia: string;
  color: string;
  bodegaLocal: number;
  bodegaZonaFranca: number;
  totalDisponible: number;
  llegadaBodegaLocal: string;
  cantidadTransito: number;
  estadoOrden: string;
  id: number;
}

export interface CataPromProductDetails {
  imagenes: string[];
  referencia: string;
  nombre: string;
  resumen: string;
  idCategoria: number;
  palabrasClaveSeo: string;
  descripcionSeo: string;
  urlAmigable: string;
  descripcionProducto: string;
  precio1: number;
  precio2: number;
  precio3: number;
  precio4: number;
  precio5: number;
  descripcionPrecio1: string;
  descripcionPrecio2: string;
  descripcionPrecio3: string;
  descripcionPrecio4: string;
  descripcionPrecio5: string;
  imageUrl: string;
  id: number;
}
