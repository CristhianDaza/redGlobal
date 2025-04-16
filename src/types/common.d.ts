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
  price?: number;
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

export enum QuoteStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface QuoteItem {
  productId: string
  productName: string
  productImage: string
  color: string
  colorName: string
  quantity: number
  maxQuantity: number
  includeMarking: boolean
  inkColors?: number
  unitPrice: number
  totalPrice: number
}

export interface CategoryCard {
  id: string;
  title: string;
  imageUrl: string;
  buttonText: string;
  backgroundColor: string;
  active: boolean;
  buttonColor: string;
  order: number;
  url: string;
  textColor: string;
}

export type CategoryCardCreate = Pick<CategoryCard, 'title' | 'buttonText' | 'backgroundColor' | 'imageUrl' | 'active' | 'url' | 'textColor'>;

export interface Quote {
  id: string
  userId: string
  userName: string
  userEmail: string
  status: QuoteStatus
  items: QuoteItem[]
  createdAt: string
  updatedAt: string
  total?: number
}

export interface User {
  idDoc: string;
  id: string;
  name: string;
  email: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  priceIncrease: number;
  discount?: number;
  active: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  password?: string;
  logo?: File | string;
  active?: boolean;
  name: string,
  email: string,
  primaryColor: string;
  secondaryColor: string;
  priceIncrease: number;
  role: UserRole;
  idDoc?: string;
}

export interface UserState {
  users: User[];
  isLoadingUsers: boolean;
  lastUpdateUsers: string | null;
}

export interface QuoteState {
  quotes: Quote[];
  currentQuote: QuoteItem[];
  isLoadingQuotes: boolean;
  lastUpdateQuotes: string | null;
}

export interface Notification {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  isClosed?: boolean
}

export interface QuoteAdmin {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    color: string;
    colorName: string;
    quantity: number;
    maxQuantity: number;
    includeMarking: boolean;
    inkColors?: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Catalog {
  id: string;
  title: string
  imageUrl: string;
  toRoute: string;
}
