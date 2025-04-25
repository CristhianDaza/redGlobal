export interface StockSurResponse {
  meta: {
    pagination: {
      total_count: number;
    };
  };
  products: StockSurProduct[];
}

export interface StockSurProduct {
  id: number;
  code: string;
  name: string;
  description: string;
  categories: StockSurCategory[];
  packing: StockSurPacking;
  icons: StockSurIcono[];
  variants: StockSurVariant[];
}

export interface StockSurCategory {
  id: number;
  name: string;
}

export interface StockSurPacking {
  width: number | null;
  height: number | null;
  depth: number | null;
  volume: number | null;
  quantity: number | null;
  weight: number | null;
}

export interface StockSurIcono {
  id: number;
  label: string;
  short_name: string;
  picture: string;
}

export interface StockSurVariant {
  id: number;
  novedad: boolean;
  stock_available: number;
  stock_existent: number;
  list_price: string;
  net_price: string;
  picture: StockSurImagen;
  detail_picture: StockSurImagen;
  color: StockSurColor;
}

export interface StockSurImagen {
  small: string;
  medium: string;
  original: string;
}

export interface StockSurColor {
  id: number;
  name: string;
  hex_code: string;
  picture: string;
}
