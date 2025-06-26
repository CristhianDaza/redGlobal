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
  isLoadingApiPromos: ref<boolean>;
  isLoadingApiMarpico: ref<boolean>;
  isLoadingApiStockSur: ref<boolean>;
  isLoadingApiCataProm: ref<boolean>;
  isLoadingSaveProducts: ref<boolean>;
  lastUpdateProducts: string;
  productsToView: ProductsRedGlobal[];
  isUpdating: boolean;
  isSuccessApiPromos: ref<boolean>;
  isSuccessApiMarpico: ref<boolean>;
  isSuccessApiStockSur: ref<boolean>;
  isSuccessApiCataProm: ref<boolean>;
}

export interface Category {
  title: string;
  image: string;
  link: string;
  id: number;
  background: string;
  textButton: string;
}

export interface UploadApiResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}
export interface ContactInfo {
  icon: string;
  title: string;
  lines: string[];
}

export interface EmailData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
}

export interface EmailQuoteData {
  name: string;
  email: string;
  id: string;
}
