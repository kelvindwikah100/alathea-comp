import {
  Category,
  CategoryFormData,
  Product,
  ProductFilterState,
  ProductFormData,
} from "@/types/database";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "@/lib/seed-data";

const LOCAL_STORAGE_PRODUCTS_KEY = "alathea_demo_products";
const LOCAL_STORAGE_CATEGORIES_KEY = "alathea_demo_categories";

/**
 * Check whether Supabase environment variables are actively configured
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
    anonKey &&
    !url.includes("your-project-ref-id") &&
    !url.includes("example.com")
  );
}

import { createClient } from "@/lib/supabase/client";

/**
 * Resolves Supabase client safely across client and server
 */
function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    return createClient();
  } catch (error) {
    console.warn("Error initializing Supabase client, falling back to local data layer:", error);
    return null;
  }
}

// ============================================================================
// LOCAL STORAGE & SEED FALLBACK HELPERS (CLIENT & SERVER DEMO MODE)
// ============================================================================

function getLocalCategories(): Category[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    } catch {
      // ignore localStorage parse error
    }
  }
  return [...INITIAL_CATEGORIES];
}

function saveLocalCategories(categories: Category[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
      console.warn("Failed to persist categories to localStorage", e);
    }
  }
}

function getLocalProducts(): Product[] {
  const categories = getLocalCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  let products: Product[] = [];
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (stored) {
        products = JSON.parse(stored);
      } else {
        products = [...INITIAL_PRODUCTS];
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
      }
    } catch {
      products = [...INITIAL_PRODUCTS];
    }
  } else {
    products = [...INITIAL_PRODUCTS];
  }

  // Populate category joins
  return products.map((p) => ({
    ...p,
    category: p.category_id ? categoryMap.get(p.category_id) || null : null,
  }));
}

function saveLocalProducts(products: Product[]) {
  if (typeof window !== "undefined") {
    try {
      // Strip nested category object before saving
      const plain = products.map(({ category, ...rest }) => rest);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(plain));
    } catch (e) {
      console.warn("Failed to persist products to localStorage", e);
    }
  }
}

// ============================================================================
// PUBLIC & ADMIN CATALOG SERVICE FUNCTIONS
// ============================================================================

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        return data as Category[];
      }
      console.warn("Supabase categories query error, using fallback:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, using fallback:", err);
    }
  }

  return getLocalCategories();
}

/**
 * Fetch products with optional filters, search, and sorting
 */
export async function getProducts(filters?: ProductFilterState): Promise<Product[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase
        .from("products")
        .select("*, category:categories(*)");

      if (filters?.categorySlug) {
        const { data: catData } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", filters.categorySlug)
          .single();

        if (catData?.id) {
          query = query.eq("category_id", catData.id);
        }
      }

      if (filters?.brand && filters.brand !== "all") {
        query = query.eq("brand", filters.brand);
      }

      if (filters?.stockStatus && filters.stockStatus !== "all") {
        query = query.eq("stock_status", filters.stockStatus);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
      }

      if (filters?.searchQuery) {
        const q = `%${filters.searchQuery}%`;
        query = query.or(`name.ilike.${q},brand.ilike.${q},sku.ilike.${q}`);
      }

      // Sorting
      switch (filters?.sortBy) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "name-asc":
          query = query.order("name", { ascending: true });
          break;
        case "name-desc":
          query = query.order("name", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "featured":
        default:
          query = query
            .order("is_featured", { ascending: false })
            .order("created_at", { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as Product[];
      }
      console.warn("Supabase products query error, using fallback:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, using fallback:", err);
    }
  }

  // --- LOCAL FALLBACK LOGIC ---
  let products = getLocalProducts();

  if (filters?.categorySlug) {
    products = products.filter(
      (p) => p.category?.slug === filters.categorySlug
    );
  }

  if (filters?.brand && filters.brand !== "all") {
    products = products.filter(
      (p) => p.brand.toLowerCase() === filters.brand?.toLowerCase()
    );
  }

  if (filters?.stockStatus && filters.stockStatus !== "all") {
    products = products.filter((p) => p.stock_status === filters.stockStatus);
  }

  if (filters?.minPrice !== undefined) {
    products = products.filter((p) => p.price >= (filters.minPrice || 0));
  }

  if (filters?.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= (filters.maxPrice || Infinity));
  }

  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
    );
  }

  // Sorting fallback
  products.sort((a, b) => {
    switch (filters?.sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "featured":
      default:
        if (a.is_featured === b.is_featured) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.is_featured ? -1 : 1;
    }
  });

  return products;
}

/**
 * Fetch a single product by its unique slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return data as Product;
      }
      if (error) {
        console.warn("Supabase product lookup error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase connection failed, using fallback:", err);
    }
  }

  const products = getLocalProducts();
  const match = products.find((p) => p.slug === slug);
  return match || null;
}

/**
 * Create a new product (Admin)
 */
export async function createProduct(data: ProductFormData): Promise<Product> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data: created, error } = await supabase
        .from("products")
        .insert({
          ...data,
          specifications: data.specifications || [],
          images: data.images || [],
        })
        .select("*, category:categories(*)")
        .single();

      if (!error && created) {
        return created as Product;
      }
      console.warn("Supabase create product error, storing locally:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, storing locally:", err);
    }
  }

  const products = getLocalProducts();
  const categories = getLocalCategories();
  const matchedCategory = categories.find((c) => c.id === data.category_id) || null;

  const now = new Date().toISOString();
  const newProduct: Product = {
    ...data,
    id: `p-local-${Date.now()}`,
    specifications: data.specifications || [],
    images: data.images || [],
    created_at: now,
    updated_at: now,
    category: matchedCategory,
  };

  const updatedProducts = [newProduct, ...products];
  saveLocalProducts(updatedProducts);
  return newProduct;
}

/**
 * Update an existing product (Admin)
 */
export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>
): Promise<Product> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data: updated, error } = await supabase
        .from("products")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*, category:categories(*)")
        .single();

      if (!error && updated) {
        return updated as Product;
      }
      console.warn("Supabase update product error, updating locally:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, updating locally:", err);
    }
  }

  const products = getLocalProducts();
  const categories = getLocalCategories();

  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Produk dengan ID ${id} tidak ditemukan.`);
  }

  const existing = products[index];
  const targetCategoryId = data.category_id !== undefined ? data.category_id : existing.category_id;
  const matchedCategory = categories.find((c) => c.id === targetCategoryId) || existing.category;

  const updatedProduct: Product = {
    ...existing,
    ...data,
    category_id: targetCategoryId,
    category: matchedCategory,
    updated_at: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  saveLocalProducts(products);
  return updatedProduct;
}

/**
 * Delete a product (Admin)
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) {
        return true;
      }
      console.warn("Supabase delete product error, deleting locally:", error.message);
    } catch (err) {
      console.warn("Supabase connection failed, deleting locally:", err);
    }
  }

  const products = getLocalProducts();
  const filtered = products.filter((p) => p.id !== id);
  saveLocalProducts(filtered);
  return true;
}

/**
 * Create a new category (Admin)
 */
export async function createCategory(data: CategoryFormData): Promise<Category> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data: created, error } = await supabase
        .from("categories")
        .insert(data)
        .select("*")
        .single();

      if (!error && created) {
        return created as Category;
      }
      console.warn("Supabase create category error, storing locally:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, storing locally:", err);
    }
  }

  const categories = getLocalCategories();
  const newCategory: Category = {
    ...data,
    id: `c-local-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  const updatedCategories = [...categories, newCategory];
  saveLocalCategories(updatedCategories);
  return newCategory;
}

/**
 * Update an existing category (Admin)
 */
export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
): Promise<Category> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data: updated, error } = await supabase
        .from("categories")
        .update(data)
        .eq("id", id)
        .select("*")
        .single();

      if (!error && updated) {
        return updated as Category;
      }
      console.warn("Supabase update category error, updating locally:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, updating locally:", err);
    }
  }

  const categories = getLocalCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Kategori dengan ID ${id} tidak ditemukan.`);
  }

  const updatedCategory: Category = {
    ...categories[index],
    ...data,
  };

  categories[index] = updatedCategory;
  saveLocalCategories(categories);
  return updatedCategory;
}

/**
 * Delete a category (Admin)
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (!error) {
        return true;
      }
      console.warn("Supabase delete category error, deleting locally:", error.message);
    } catch (err) {
      console.warn("Supabase connection failed, deleting locally:", err);
    }
  }

  const categories = getLocalCategories();
  const filtered = categories.filter((c) => c.id !== id);
  saveLocalCategories(filtered);
  return true;
}
