import {
  Category,
  CategoryFormData,
  Product,
  ProductFilterState,
  ProductFormData,
  UpgradeOption,
  UpgradeOptionFormData,
  StoreInfo,
  StoreInfoFormData,
  HomepageHero,
  HomepageHeroFormData,
} from "@/types/database";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_UPGRADE_OPTIONS,
  INITIAL_STORE_INFO,
  INITIAL_HOMEPAGE_HERO,
} from "@/lib/seed-data";

const LOCAL_STORAGE_PRODUCTS_KEY = "alathea_demo_products";
const LOCAL_STORAGE_CATEGORIES_KEY = "alathea_demo_categories";
const LOCAL_STORAGE_UPGRADES_KEY = "alathea_demo_upgrade_options";

/**
 * Check whether Supabase environment variables are actively configured
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

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

function getLocalUpgradeOptions(): UpgradeOption[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_UPGRADES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(
        LOCAL_STORAGE_UPGRADES_KEY,
        JSON.stringify(INITIAL_UPGRADE_OPTIONS)
      );
    } catch {
      // ignore parse error
    }
  }
  return [...INITIAL_UPGRADE_OPTIONS];
}

function saveLocalUpgradeOptions(options: UpgradeOption[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_UPGRADES_KEY, JSON.stringify(options));
    } catch (e) {
      console.warn("Failed to persist upgrade options to localStorage", e);
    }
  }
}

// ============================================================================
// PUBLIC & ADMIN CATALOG SERVICE FUNCTIONS
// ============================================================================


/**
 * Enriches product with RAM & SSD upgradability flags based on specifications,
 * explicit properties, or intelligent device category classification.
 */
export function enrichProductUpgradability(p: any): Product {
  let is_ram_upgradable = p.is_ram_upgradable;
  let is_ssd_upgradable = p.is_ssd_upgradable;

  // 1. Check inside specifications metadata
  if (Array.isArray(p.specifications)) {
    const ramSpec = p.specifications.find(
      (s: any) =>
        s.label === "__is_ram_upgradable" ||
        s.label === "Opsi Upgrade RAM" ||
        s.label?.toLowerCase()?.includes("upgrade ram")
    );
    if (ramSpec) {
      is_ram_upgradable =
        ramSpec.value === "true" ||
        ramSpec.value === "Didukung" ||
        ramSpec.value === "Ya";
    }

    const ssdSpec = p.specifications.find(
      (s: any) =>
        s.label === "__is_ssd_upgradable" ||
        s.label === "Opsi Upgrade SSD" ||
        s.label?.toLowerCase()?.includes("upgrade ssd")
    );
    if (ssdSpec) {
      is_ssd_upgradable =
        ssdSpec.value === "true" ||
        ssdSpec.value === "Didukung" ||
        ssdSpec.value === "Ya";
    }
  }

  // 2. Fallback based on category and device type
  const catSlug = p.category?.slug?.toLowerCase() || "";
  const prodSlug = p.slug?.toLowerCase() || "";

  if (is_ram_upgradable === undefined) {
    if (prodSlug.includes("zephyrus")) {
      is_ram_upgradable = false; // Soldered LPDDR5X
    } else if (catSlug === "laptop" || catSlug === "pc-rakitan") {
      is_ram_upgradable = true;
    } else {
      is_ram_upgradable = false;
    }
  }

  if (is_ssd_upgradable === undefined) {
    if (catSlug === "laptop" || catSlug === "pc-rakitan") {
      is_ssd_upgradable = true;
    } else {
      is_ssd_upgradable = false;
    }
  }

  return {
    ...p,
    is_ram_upgradable: Boolean(is_ram_upgradable),
    is_ssd_upgradable: Boolean(is_ssd_upgradable),
  };
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  let categories: Category[] = [];
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        categories = data as Category[];
      } else {
        console.warn("Supabase categories query error, using fallback:", error?.message);
      }
    } catch (err) {
      console.warn("Supabase connection failed, using fallback:", err);
    }
  }

  const localCats = getLocalCategories();
  if (categories.length === 0) {
    return localCats;
  }

  // Seamlessly merge Supabase categories with any local-only categories
  const existingIds = new Set(categories.map((c) => c.id));
  const existingSlugs = new Set(categories.map((c) => c.slug.toLowerCase()));

  for (const lCat of localCats) {
    if (!existingIds.has(lCat.id) && !existingSlugs.has(lCat.slug.toLowerCase())) {
      categories.push(lCat);
    }
  }

  return categories;
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
        let prods = (data as any[]).map(enrichProductUpgradability);
        if (filters?.isUpgradableOnly) {
          prods = prods.filter((p) => p.is_ram_upgradable || p.is_ssd_upgradable);
        }
        return prods;
      }
      console.warn("Supabase products query error, using fallback:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, using fallback:", err);
    }
  }

  // --- LOCAL FALLBACK LOGIC ---
  let products = getLocalProducts().map(enrichProductUpgradability);

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

  if (filters?.isUpgradableOnly) {
    products = products.filter((p) => p.is_ram_upgradable || p.is_ssd_upgradable);
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
        return enrichProductUpgradability(data);
      }
      if (error) {
        console.warn("Supabase product lookup error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase connection failed, using fallback:", err);
    }
  }

  const products = getLocalProducts().map(enrichProductUpgradability);
  const match = products.find((p) => p.slug === slug);
  return match || null;
}

/**
 * Create a new product (Admin)
 */
export async function createProduct(data: ProductFormData): Promise<Product> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        const enriched = enrichProductUpgradability(created);
        const products = getLocalProducts();
        saveLocalProducts([enriched, ...products.filter((p) => p.id !== enriched.id)]);
        return enriched;
      }
    } catch (e) {
      console.warn("Failed calling /api/admin/products POST, falling back:", e);
    }
  }

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
        return enrichProductUpgradability(created);
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
  const newProduct: Product = enrichProductUpgradability({
    ...data,
    id: `p-local-${Date.now()}`,
    specifications: data.specifications || [],
    images: data.images || [],
    created_at: now,
    updated_at: now,
    category: matchedCategory,
  });

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
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        const enriched = enrichProductUpgradability(updated);
        const products = getLocalProducts();
        const idx = products.findIndex((p) => p.id === id);
        if (idx !== -1) {
          products[idx] = { ...products[idx], ...enriched };
          saveLocalProducts(products);
        }
        return enriched;
      }
    } catch (e) {
      console.warn("Failed calling /api/admin/products PUT, falling back:", e);
    }
  }

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
        return enrichProductUpgradability(updated);
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

  const updatedProduct: Product = enrichProductUpgradability({
    ...existing,
    ...data,
    category_id: targetCategoryId,
    category: matchedCategory,
    updated_at: new Date().toISOString(),
  });

  products[index] = updatedProduct;
  saveLocalProducts(products);
  return updatedProduct;
}

/**
 * Delete a product (Admin)
 */
export async function deleteProduct(id: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const products = getLocalProducts();
        saveLocalProducts(products.filter((p) => p.id !== id));
        return true;
      }
    } catch (e) {
      console.warn("Failed calling /api/admin/products DELETE, falling back:", e);
    }
  }

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
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        const local = getLocalCategories();
        saveLocalCategories([...local.filter((c) => c.id !== created.id), created]);
        return created;
      }
    } catch (e) {
      console.warn("Failed calling /api/admin/categories POST, falling back:", e);
    }
  }

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
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        const local = getLocalCategories();
        const idx = local.findIndex((c) => c.id === id);
        if (idx !== -1) {
          local[idx] = { ...local[idx], ...updated };
          saveLocalCategories(local);
        }
        return updated;
      }
    } catch (e) {
      console.warn("Failed calling /api/admin/categories PUT, falling back:", e);
    }
  }

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
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const local = getLocalCategories();
        saveLocalCategories(local.filter((c) => c.id !== id));
        return true;
      }
    } catch (e) {
      console.warn("Failed calling /api/admin/categories DELETE, falling back:", e);
    }
  }

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

/**
 * Upload a product image to Supabase Storage bucket 'product-images',
 * or convert to DataURL in demo mode.
 */
export async function uploadProductImage(file: File, folder = "products"): Promise<string> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);
        return publicUrlData.publicUrl;
      }
      console.warn("Supabase storage upload failed, using DataURL fallback:", error?.message);
    } catch (err) {
      console.warn("Supabase storage connection failed:", err);
    }
  }

  // Fallback to FileReader base64 DataURL for Demo Mode
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// CUSTOM UPGRADE (RAM & SSD) SERVICE FUNCTIONS
// ============================================================================

/**
 * Fetch all upgrade options (RAM & SSD)
 */
export async function getUpgradeOptions(): Promise<UpgradeOption[]> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("custom_upgrades")
        .select("*")
        .order("price", { ascending: true });

      if (!error && data) {
        return data as UpgradeOption[];
      }
      console.warn("Supabase upgrades query error, using fallback:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, using fallback:", err);
    }
  }

  const options = getLocalUpgradeOptions();
  return options.sort((a, b) => a.price - b.price);
}

/**
 * Fetch single upgrade option by ID
 */
export async function getUpgradeOptionById(id: string): Promise<UpgradeOption | null> {
  const options = await getUpgradeOptions();
  return options.find((o) => o.id === id) || null;
}

/**
 * Create a new upgrade option (Admin)
 */
export async function createUpgradeOption(
  data: UpgradeOptionFormData
): Promise<UpgradeOption> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data: created, error } = await supabase
        .from("custom_upgrades")
        .insert({
          ...data,
        })
        .select("*")
        .single();

      if (!error && created) {
        return created as UpgradeOption;
      }
      console.warn("Supabase create upgrade error, storing locally:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, storing locally:", err);
    }
  }

  const options = getLocalUpgradeOptions();
  const now = new Date().toISOString();
  const newOption: UpgradeOption = {
    ...data,
    id: `u-local-${Date.now()}`,
    created_at: now,
    updated_at: now,
  };

  const updatedOptions = [...options, newOption];
  saveLocalUpgradeOptions(updatedOptions);
  return newOption;
}

/**
 * Update an existing upgrade option (Admin)
 */
export async function updateUpgradeOption(
  id: string,
  data: Partial<UpgradeOptionFormData>
): Promise<UpgradeOption> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data: updated, error } = await supabase
        .from("custom_upgrades")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .single();

      if (!error && updated) {
        return updated as UpgradeOption;
      }
      console.warn("Supabase update upgrade error, updating locally:", error?.message);
    } catch (err) {
      console.warn("Supabase connection failed, updating locally:", err);
    }
  }

  const options = getLocalUpgradeOptions();
  const index = options.findIndex((o) => o.id === id);
  if (index === -1) {
    throw new Error(`Opsi upgrade dengan ID ${id} tidak ditemukan.`);
  }

  const updatedOption: UpgradeOption = {
    ...options[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  options[index] = updatedOption;
  saveLocalUpgradeOptions(options);
  return updatedOption;
}

/**
 * Delete an upgrade option (Admin)
 */
export async function deleteUpgradeOption(id: string): Promise<boolean> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("custom_upgrades").delete().eq("id", id);
      if (!error) {
        return true;
      }
      console.warn("Supabase delete upgrade error, deleting locally:", error.message);
    } catch (err) {
      console.warn("Supabase connection failed, deleting locally:", err);
    }
  }

  const options = getLocalUpgradeOptions();
  const filtered = options.filter((o) => o.id !== id);
  saveLocalUpgradeOptions(filtered);
  return true;
}

/**
 * Toggle active availability status of an upgrade option (Admin)
 */
export async function toggleUpgradeOptionStatus(id: string): Promise<UpgradeOption> {
  const options = getLocalUpgradeOptions();
  const item = options.find((o) => o.id === id);
  if (!item) {
    throw new Error(`Opsi upgrade dengan ID ${id} tidak ditemukan.`);
  }
  return updateUpgradeOption(id, { is_active: !item.is_active });
}


// ============================================================================
// STORE INFO ("Tentang Toko") SERVICE FUNCTIONS
// ============================================================================

const LOCAL_STORAGE_STORE_INFO_KEY = "alathea_demo_store_info";

function getLocalStoreInfo(): StoreInfo {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_STORE_INFO_KEY);
      if (stored) {
        return { ...INITIAL_STORE_INFO, ...JSON.parse(stored) };
      }
    } catch {
      // ignore parse error
    }
  }
  return { ...INITIAL_STORE_INFO };
}

/**
 * Fetch the store profile shown on the /tentang page
 */
export async function getStoreInfo(): Promise<StoreInfo> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("store_info")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data) {
        return { ...INITIAL_STORE_INFO, ...data } as StoreInfo;
      }
      if (error) {
        console.warn("Supabase store_info query error, using fallback:", error.message);
      }
    } catch (err) {
      console.warn("Supabase connection failed, using fallback:", err);
    }
  }

  return getLocalStoreInfo();
}

/**
 * Save the store profile (Admin)
 */
export async function updateStoreInfo(data: StoreInfoFormData): Promise<StoreInfo> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    // RLS only allows logged-in Supabase users to write. Demo Mode has no Supabase session.
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error(
        "Anda masuk lewat Mode Demo. Keluar, lalu login dengan email & password admin Supabase untuk menyimpan."
      );
    }

    const { data: saved, error } = await supabase
      .from("store_info")
      .upsert({ id: 1, ...data, updated_at: new Date().toISOString() })
      .select("*")
      .single();

    if (error) {
      throw new Error(
        error.code === "42501"
          ? "Akses ditolak database. Pastikan Anda login sebagai admin Supabase."
          : error.message
      );
    }
    return saved as StoreInfo;
  }

  const saved: StoreInfo = { id: 1, ...data, updated_at: new Date().toISOString() };
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_STORE_INFO_KEY, JSON.stringify(saved));
  }
  return saved;
}

// ============================================================================
// HOMEPAGE HERO ("Tampilan Beranda") SERVICE FUNCTIONS
// ============================================================================

const LOCAL_STORAGE_HERO_KEY = "alathea_demo_homepage_hero";

function getLocalHomepageHero(): HomepageHero {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HERO_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.image_url || parsed.image_url.includes("images.unsplash.com")) {
          parsed.image_url = INITIAL_HOMEPAGE_HERO.image_url;
        }
        return { ...INITIAL_HOMEPAGE_HERO, ...parsed };
      }
    } catch {
      // ignore parse error
    }
  }
  return { ...INITIAL_HOMEPAGE_HERO };
}

/**
 * Fetch the homepage hero image and floating labels
 */
export async function getHomepageHero(): Promise<HomepageHero> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("homepage_hero")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data) {
        return { ...INITIAL_HOMEPAGE_HERO, ...data } as HomepageHero;
      }
      if (error) {
        console.warn("Supabase homepage_hero query error, using fallback:", error.message);
      }
    } catch (err) {
      console.warn("Supabase connection failed, using fallback:", err);
    }
  }

  return getLocalHomepageHero();
}

/**
 * Save the homepage hero settings (Admin)
 */
export async function updateHomepageHero(data: HomepageHeroFormData): Promise<HomepageHero> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    // RLS only allows logged-in Supabase users to write. Demo Mode has no Supabase session.
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error(
        "Anda masuk lewat Mode Demo. Keluar, lalu login dengan email & password admin Supabase untuk menyimpan."
      );
    }

    const { data: saved, error } = await supabase
      .from("homepage_hero")
      .upsert({ id: 1, ...data, updated_at: new Date().toISOString() })
      .select("*")
      .single();

    if (error) {
      throw new Error(
        error.code === "42501"
          ? "Akses ditolak database. Pastikan Anda login sebagai admin Supabase."
          : error.message
      );
    }
    return saved as HomepageHero;
  }

  const saved: HomepageHero = { id: 1, ...data, updated_at: new Date().toISOString() };
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_HERO_KEY, JSON.stringify(saved));
  }
  return saved;
}
