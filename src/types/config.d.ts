import type { ProductsRedGlobal } from "./common";

export interface ApiHeaders {
  Authorization?: string;
  'Content-Type': string;
  [key: string]: string | undefined;
}

export interface ApiParams {
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponse<T> {
  data?: T;
  results?: T;
  message?: string;
  status?: number;
}

export interface HtmlEntities {
  [key: string]: string;
}

export interface StateGlobal {
  products: ProductsRedGlobal[] | null;
  isLoadingApiPromos: boolean;
  isLoadingApiMarpico: boolean;
  isLoadingApiStockSur: boolean;
  isLoadingApiCataProm: boolean;
  isLoadingSaveProducts: boolean;
  lastUpdateProducts: Date | null;
  productsToView: ProductsRedGlobal[];
}