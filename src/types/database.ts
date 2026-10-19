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
}

export interface CategoryFormData {
  name: string;
  slug: string;
  icon: string;
  description?: string;
}
