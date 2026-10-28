import { z } from "zod";

export interface LoginFormData {
  email: string;
  password: string;
}

export const loginSchema: z.ZodType<LoginFormData> = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export interface CategoryFormValues {
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

export const categorySchema: z.ZodType<CategoryFormValues> = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  slug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip (-)"),
  icon: z.string().min(1, "Pilih salah satu ikon"),
  description: z.string().optional(),
});

export type CategorySchemaType = CategoryFormValues;

export interface ProductFormValues {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category_id: string;
  stock_status: "available" | "out_of_stock" | "pre_order";
  is_featured: boolean;
  price: number;
  discount_price?: number | null;
  short_description?: string;
  description?: string;
  specifications: { label: string; value: string }[];
  images: string[];
  is_ram_upgradable?: boolean;
  is_ssd_upgradable?: boolean;
}

export const productSchema: z.ZodType<ProductFormValues> = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  slug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip (-)"),
  sku: z.string().min(2, "SKU minimal 2 karakter"),
  brand: z.string().min(2, "Brand minimal 2 karakter"),
  category_id: z.string().min(1, "Pilih kategori produk"),
  stock_status: z.enum(["available", "out_of_stock", "pre_order"]),
  is_featured: z.boolean(),
  price: z.coerce.number().min(0, "Harga harus >= 0"),
  discount_price: z.coerce.number().nullable().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  specifications: z.array(
    z.object({
      label: z.string().min(1, "Label spesifikasi wajib diisi"),
      value: z.string().min(1, "Nilai spesifikasi wajib diisi"),
    })
  ),
  images: z.array(z.string()),
  is_ram_upgradable: z.boolean().optional(),
  is_ssd_upgradable: z.boolean().optional(),
}).refine((d) => !d.discount_price || d.discount_price < d.price, {
  // discount_price is the selling price after discount; price is shown struck through.
  message: "Harga promo harus lebih kecil dari Harga Normal (atau kosongkan jika tidak ada diskon)",
  path: ["discount_price"],
});

export type ProductSchemaType = ProductFormValues;

export const upgradeOptionSchema = z.object({
  category: z.enum(["RAM", "SSD"]),
  name: z.string().min(2, "Nama paket upgrade minimal 2 karakter"),
  slot_type: z.string().min(2, "Tipe slot minimal 2 karakter"),
  price: z.coerce.number().min(0, "Harga tambahan harus >= 0"),
  is_active: z.boolean(),
});

export type UpgradeOptionFormValues = z.infer<typeof upgradeOptionSchema>;
export type UpgradeOptionSchemaType = UpgradeOptionFormValues;


export const storeInfoSchema = z.object({
  name: z.string().trim().min(2, "Nama toko minimal 2 karakter"),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter"),
  highlights: z
    .array(
      z.object({
        title: z.string().trim().min(2, "Judul minimal 2 karakter"),
        text: z.string().trim().min(5, "Keterangan minimal 5 karakter"),
      })
    )
    .max(6, "Maksimal 6 keunggulan"),
  weekday_hours: z.string().trim().min(3, "Jam operasional wajib diisi"),
  weekend_hours: z.string().trim().min(3, "Jam operasional wajib diisi"),
  address: z.string().trim().min(5, "Alamat wajib diisi"),
  whatsapp_number: z
    .string()
    .trim()
    .regex(/^62\d{8,13}$/, "Format nomor: 62xxxxxxxxxx (tanpa + atau spasi)"),
});
export type StoreInfoFormValues = z.infer<typeof storeInfoSchema>;

export const homepageHeroSchema = z.object({
  image_url: z.string().trim().min(1, "Gambar wajib diisi"),
  image_alt: z.string().trim().min(3, "Deskripsi gambar minimal 3 karakter"),
  product_url: z.string().trim().optional(),
  product_slug: z.string().trim().optional(),
  // Exactly 3 labels (fixed positions on the hero). Empty title hides that label.
  callouts: z
    .array(
      z.object({
        title: z.string().trim().max(40, "Maksimal 40 karakter"),
        subtitle: z.string().trim().max(60, "Maksimal 60 karakter"),
      })
    )
    .length(3),
});
export type HomepageHeroFormValues = z.infer<typeof homepageHeroSchema>;
