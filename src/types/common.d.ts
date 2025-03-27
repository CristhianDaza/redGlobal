export interface ProductsRedGlobal {
  api: string;
  areaPrinting?: string;
  category?: string[];
  description: string;
  discount?: number | null;
  id: string;
  images: string[];
  labels?: Label[];
  mainImage: string;
  material?: string;
  name: string;
  packaging: string;
  printing: string;
  size?: string;
  stock?: number;
  tableQuantity: TableEntry[];
  totalProducts: number;
}

export interface Label {
  id: number;
  name: string;
  image: string;
}

export interface TableEntry {
  color: string;
  colorName: string;
  quantity: number;
  inTracking?: number | null;
  statusTracking?: string | null;
  dataTracking?: string | null;
  lastUpdateTracking?: string | null;
  idColorTracking?: number | null;
  price: number | string;
  sku?: string;
  type?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  order: number;
  title: string;
}

export interface MenuState {
  menu: MenuItem[] | null;
  isLoadingMenu: boolean;
  lastUpdateMenu: string | null;
}