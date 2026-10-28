export type StockStatus = 'available' | 'out_of_stock' | 'pre_order';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string | null;
  created_at: string;
}

export interface UpgradeOption {
  id: string;
  category: 'RAM' | 'SSD';
  name: string;
  slot_type: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UpgradeOptionFormData {
  category: 'RAM' | 'SSD';
  name: string;
  slot_type: string;
  price: number;
  is_active: boolean;
}

export interface SelectedUpgradePlan {
  ram?: UpgradeOption | null;
  ssd?: UpgradeOption | null;
}

export interface Product {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  price: number;
  discount_price?: number | null;
  stock_status: StockStatus;
  is_featured: boolean;
  short_description?: string | null;
  description?: string | null;
  specifications: ProductSpecification[];
  images: string[];
  is_ram_upgradable?: boolean;
  is_ssd_upgradable?: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export type ProductSortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

export interface ProductFilterState {
  searchQuery?: string;
  categorySlug?: string;
  brand?: string;
  stockStatus?: StockStatus | 'all';
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortOption;
  isUpgradableOnly?: boolean;
}

export interface ProductFormData {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category_id: string;
  price: number;
  discount_price?: number | null;
  stock_status: StockStatus;
  is_featured: boolean;
  short_description?: string;
  description?: string;
  specifications: ProductSpecification[];
  images: string[];
  is_ram_upgradable?: boolean;
  is_ssd_upgradable?: boolean;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  icon: string;
  description?: string;
}


export interface StoreHighlight {
  title: string;
  text: string;
}

/** Single-row store profile shown on the /tentang page (editable in admin). */
export interface StoreInfo {
  id: number;
  name: string;
  description: string;
  highlights: StoreHighlight[];
  weekday_hours: string;
  weekend_hours: string;
  address: string;
  whatsapp_number: string;
  updated_at?: string;
}

export type StoreInfoFormData = Omit<StoreInfo, "id" | "updated_at">;

export interface HeroCallout {
  title: string;
  subtitle: string;
}

/** Single-row homepage hero settings (image + 3 floating labels), editable in admin. */
export interface HomepageHero {
  id: number;
  image_url: string;
  image_alt: string;
  callouts: HeroCallout[];
  updated_at?: string;
}

export type HomepageHeroFormData = Omit<HomepageHero, "id" | "updated_at">;
