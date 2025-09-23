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
  IN_REVIEW = 'in_review',
  QUOTED = 'quoted',
  NEGOTIATING = 'negotiating',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
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
  idDoc: string
  userId: string
  userName: string
  userEmail: string
  status: QuoteStatus
  items: QuoteItem[]
  createdAt: string
  updatedAt: string
  total?: number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  dueDate?: string
  estimatedValue?: number
  actualValue?: number
  conversionRate?: number
  tags?: string[]
  source?: string
  lastContactDate?: string
  followUpDate?: string
  clientNotes?: string
  internalNotes?: string
  attachments?: string[]
  statusHistory?: QuoteStatusHistory[]
}

export interface QuoteStatusHistory {
  status: QuoteStatus
  changedBy: string
  changedAt: string
  notes?: string
}

export interface QuoteComment {
  id: string
  quoteId: string
  userId: string
  userName: string
  comment: string
  isInternal: boolean
  createdAt: string
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
  lastLogin?: string;
  isHidden?: boolean;
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
  idDoc: string;
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

export interface ButtonProps {
  text?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  type?: 'default' | 'icon';
  onClick?: (event: MouseEvent) => void;
  customStyle?: Record<string, string>;
  disabled?: boolean;
  outlined?: boolean;
  full?: boolean;
}

export interface CarouselItem {
  id: string;
  title: string;
  imageUrl: string;
  toRoute: string;
}

export interface OurClients {
  id: string;
  title: string;
  imageUrl: string;
}

export interface ColorItem {
  id: string;
  hex: string;
}

export interface Advisor {
  id: string;
  nombre: string;
  telefono: string;
}

export type tabs = 'menu' | 'users' | 'quotes' | 'advanced-quotes' | 'cards' | 'catalogs' | 'carousel' | 'our-clients' | 'color' | 'advisors';
