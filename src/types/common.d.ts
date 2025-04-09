export interface ProductsRedGlobal {
  api: string;
  areaPrinting?: string;
  category?: string[];
  description: string;
  discount?: number | null;
  id: string;
  images?: ImagesRedGlobal[];
  labels?: Label[];
  mainImage: string;
  material?: string;
  name: string;
  packaging?: string;
  printing?: string;
  size?: string;
  stock?: number;
  tableQuantity?: TableEntry[];
  totalProducts?: number;
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
  name?: string;
  path: string;
  children?: MenuItem[];
  order: number;
  title: string;
}

export interface MenuState {
  menu: MenuItem[];
  isLoadingMenu: boolean;
  lastUpdateMenu: string | null;
}

export interface ImagesRedGlobal {
  urlImage: string[];
  color: string;
  id: number;
}

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client'
}

export interface User {
  id: string;
  name: string;
  email: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  priceIncrease: number;
  active: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  password?: string;
  logo?: File | string;
  active?: boolean;
}

export interface UserState {
  users: User[];
  isLoadingUsers: boolean;
  lastUpdateUsers: string | null;
}