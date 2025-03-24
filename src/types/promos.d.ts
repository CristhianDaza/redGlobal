export interface PromosUserData {
  user: string;
  password: string;
}

export interface PromosStock {
  success: boolean;
  Stocks: Stock[];
}

export interface Stock {
  Material: string;
  Planta: string;
  Stock: number;
}

export interface PrmosAllProducts {
  response: PromosProduct[];
  success: boolean;
}

export interface PromosProduct {
  skuPadre: string;
  nombrePadre: string;
  categorias: string;
  subCategorias: string;
  descripcion: string;
  material: string;
  capacidad: string;
  medidas: string;
  paquete: PromosPackaging;
  impresion: Impresion;
  imagenesPadre: string[];
  imagenesVector: string[];
  Actualizado: string;
  hijos: PromosProductChild[];
}
  
export interface PromosPackaging {
  alto: string;
  largo: string;
  ancho: string;
  pesoBruto: string;
  pesoNeto: string;
  PiezasCaja: string;
  PiezasInner: string;
  cajaIndividual: string;
  innersCaja: string;
  unidadPeso: string;
  unidadVolumen: string;
}
  
interface Impresion {
  tecnicaImpresion: string;
  areaImpresion: string;
}
  
export interface PromosProductChild {
  skuHijo: string;
  nombreHijo: string;
  color: string;
  tipo: string;
  moneda: string;
  talla: string | null;
  imagenesHijo: string[];
  estatus: string;
  precio: number;
}
  
