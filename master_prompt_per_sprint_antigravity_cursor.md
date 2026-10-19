# Master Prompt Terpisah Per Phase & Sprint — Alathea Comp

> **Cara Penggunaan di Antigravity / AI Code Editor:**
> 1. Pastikan file `.agent/rules.md` (dari dokumen Rules sebelumnya) sudah berada di *root folder* project kamu.
> 2. **Jangan copy sekaligus.** Salin **Prompt Phase 1 (Sprint 1)** terlebih dahulu, jalankan di Antigravity, dan tunggu sampai selesai.
> 3. Setelah Sprint 1 selesai dan tidak ada error, lanjutkan salin **Prompt Phase 2 (Sprint 2)** di *chat* yang sama atau *session* baru, begitu seterusnya hingga **Phase 5 (Sprint 5)**.

---

## 📦 PHASE 1 — SPRINT 1: Project Foundation, Clay+Glass Design System & Supabase Core

Salin dan tempel prompt di bawah ini untuk memulai **Sprint 1**:

```markdown
You are an elite Fullstack Developer and Senior Frontend Engineer working on **"Alathea Comp"**, a modern computer, laptop, and IT hardware product catalog with an Admin CMS.

First, read and strictly obey all rules inside `.agent/rules.md`.

We are working using an **Agile Sprint methodology**. Right now, execute **ONLY PHASE 1 — SPRINT 1 (Foundation, Clay+Glass Design System, Supabase Schema, and Fallback Data Layer)**. Do NOT build the public storefront pages or admin pages yet.

### 🎯 SPRINT 1 TASKS:

1. **Project Initialization & Dependencies:**
   - Ensure the Next.js project (App Router, TypeScript, Tailwind CSS) is initialized.
   - Install all `shadcn/ui` components using: `npx shadcn@latest add --all --yes`
   - Install required packages: `npm install @supabase/supabase-js @supabase/ssr @tanstack/react-table react-hook-form zod @hookform/resolvers lucide-react sonner next-themes`

2. **Tactile Claymorphism + Glassmorphism CSS (Strictly NO GLOW):**
   - Configure `src/app/globals.css` with a matte hardware aesthetic. **Never use neon glows or colored blur blobs.**
   - Set Light Mode canvas background to `#F2F4F7` (Soft Cool Clay Gray) and Dark Mode canvas background to `#0F1012` (Deep Matte Charcoal).
   - Create these custom utility classes in `src/app/globals.css`:
     - `.clay-card`:
       - Light: `bg-[#F8F9FB] rounded-3xl border border-white/90 shadow-[8px_8px_20px_rgba(163,177,198,0.32),-6px_-6px_16px_rgba(255,255,255,0.95),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(163,177,198,0.22)]`
       - Dark: `dark:bg-[#18191D] dark:border-zinc-800/90 dark:shadow-[8px_8px_20px_rgba(0,0,0,0.6),-4px_-4px_12px_rgba(255,255,255,0.02),inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-2px_-2px_5px_rgba(0,0,0,0.5)]`
     - `.clay-inset` (recessed container for inputs, search bars, thumbnails, spec pills):
       - Light: `bg-[#EEF1F5] rounded-2xl border border-white/50 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]`
       - Dark: `dark:bg-[#121316] dark:border-zinc-800/60 dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.65),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]`
     - `.clay-button`:
       - Tactile 3D button with `rounded-2xl transition-all duration-150 active:scale-[0.98] shadow-[0_6px_14px_rgba(0,0,0,0.1),inset_0_2px_2px_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.2)]`.
     - `.glass-panel` (for floating navbar, modals, compare bar, sheets):
       - `bg-white/75 dark:bg-zinc-900/75 backdrop-blur-xl border border-white/70 dark:border-zinc-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)]`

3. **Environment & Supabase SQL Schema:**
   - Create `.env.example` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890`.
   - Create `supabase/schema.sql` containing:
     - `categories` table (`id` uuid PK, `name` text, `slug` text unique, `icon` text, `description` text, `created_at` timestamptz).
     - `products` table (`id` uuid PK, `category_id` uuid FK, `name` text, `slug` text unique, `sku` text, `brand` text, `price` numeric, `discount_price` numeric nullable, `stock_status` text check in `('available', 'out_of_stock', 'pre_order')`, `is_featured` boolean, `short_description` text, `description` text, `specifications` jsonb default `'[]'::jsonb`, `images` text[] default `'{}'`, `created_at` timestamptz, `updated_at` timestamptz).
     - Row Level Security (RLS) policies: Public `SELECT` for everyone; `INSERT`, `UPDATE`, `DELETE` for `authenticated` users.
     - Storage bucket `product-images` setup & policies.
     - Seed Data: 5 Categories (`Laptop`, `PC Rakitan`, `Komponen PC`, `Monitor`, `Aksesoris`) and 8 realistic computer products in Indonesia with rich JSONB `specifications` and realistic Unsplash hardware image URLs.

4. **TypeScript Types & Helper Utilities:**
   - Create `src/types/database.ts` defining `Category`, `Product`, `ProductSpecification` (`{ label: string; value: string }`), `StockStatus`, and filter types.
   - Update `src/lib/utils.ts` with helpers:
     - `formatRupiah(amount: number)` -> `Rp 15.499.000`
     - `generateSlug(text: string)`
     - `calculateDiscountPercentage(price: number, discountPrice?: number | null)`
     - `generateWhatsAppLink(product: Product, currentUrl?: string)`

5. **Supabase SSR Clients & Resilient Data Service Layer:**
   - Create `src/lib/supabase/client.ts` (`createBrowserClient`), `src/lib/supabase/server.ts` (`createServerClient`), and `src/lib/supabase/middleware.ts`.
   - Create `src/lib/seed-data.ts` containing the 5 categories and 8 realistic hardware products.
   - Create `src/lib/services/catalog.ts` with functions to fetch/mutate categories and products (`getCategories`, `getProducts`, `getProductBySlug`, `createProduct`, `updateProduct`, `deleteProduct`, `createCategory`, `updateCategory`, `deleteCategory`).
   - **CRITICAL RESILIENCE RULE:** If `NEXT_PUBLIC_SUPABASE_URL` is not configured yet, `catalog.ts` MUST seamlessly fall back to `seed-data.ts` (and sync client-side mutations with `localStorage` in demo mode) so the app works 100% out-of-the-box without crashing.

### 🛑 DEFINITION OF DONE (SPRINT 1):
- Verify that all files in Sprint 1 compile cleanly with zero TypeScript errors.
- **STOP HERE.** Do not build Sprint 2 pages yet. Summarize what was created in Sprint 1 and wait for my Sprint 2 prompt.
```

---

## 🖥️ PHASE 2 — SPRINT 2: Public Storefront, Glass Navbar, `Cmd+K` Search & Interactive Catalog

Setelah Sprint 1 selesai, salin dan tempel prompt di bawah ini untuk menjalankan **Sprint 2**:

```markdown
We are now advancing to **PHASE 2 — SPRINT 2: Public Storefront, Glassmorphic Navbar, Command Palette (`Cmd+K`), Bento Grid Showcase, and Interactive Product Catalog**.

Read `.agent/rules.md` to ensure full compliance with the **Claymorphism + Glassmorphism ( strictly NO GLOW )** design system. Execute **ONLY SPRINT 2** tasks below.

### 🎯 SPRINT 2 TASKS:

1. **Theme Provider & Root Layout Setup:**
   - Configure `ThemeProvider` (`next-themes`) and `<Toaster />` (`sonner`) in `src/app/layout.tsx` using `Geist` Sans and `Geist Mono` fonts.

2. **Glassmorphic Sticky Navbar & Footer (`src/components/layout/`):**
   - Build `src/components/layout/navbar.tsx` using `.glass-panel` (`sticky top-4 z-40 mx-auto max-w-7xl rounded-2xl`):
     - Brand logo & name **"Alathea Comp"** with a tactile hardware icon.
     - Quick navigation links (`Katalog`, `Unggulan`, `Kategori`, plus a subtle link to `Admin Panel`).
     - Tactile `.clay-inset` search button showing `"Cari laptop, GPU, rakitan... ⌘K"`.
     - Light/Dark mode toggle button (`.clay-button`).
   - Build `src/components/layout/footer.tsx` with store address, operational hours, WhatsApp contact, and category links inside a clean matte layout.
   - Create `src/app/(public)/layout.tsx` wrapping public pages with the Navbar and Footer.

3. **Instant Search Command Palette (`Cmd + K`):**
   - Build `src/components/catalog/command-search.tsx` using `shadcn/ui` `<CommandDialog />` styled with `.glass-panel`.
   - Listen to keyboard shortcut `Cmd+K` / `Ctrl+K` and clicking the Navbar search trigger.
   - Allow instant filtering of products by name, brand, SKU, or category, displaying product thumbnail, stock badge, and price in `font-mono`. Clicking an item navigates to `/products/[slug]`.

4. **Tactile Claymorphic Product Card (`src/components/catalog/product-card.tsx`):**
   - Use `.clay-card` with subtle hover lift (`hover:-translate-y-1 transition-all duration-200`).
   - Inside the card:
     - Recessed image frame (`.clay-inset`) with Next.js `<Image />` (or fallback img), Stock Status `<Badge />` (`Ready Stock` in matte emerald, `Pre-Order` in matte amber, `Stok Habis` in matte rose), and Discount percentage badge if `discount_price` exists.
     - Brand pill & Category name.
     - Product title (2-line clamp) linking to `/products/[slug]`.
     - Top 2 key specifications rendered as compact `.clay-inset` micro-badges in `font-mono`.
     - Price in `font-mono` bold (with strikethrough original price if discounted).
     - Action footer: "Detail" `.clay-button` and a quick "Bandingkan" (`Scale` icon) toggle button.

5. **Storefront Home Page (`src/app/(public)/page.tsx`) & Interactive Catalog Explorer (`src/components/catalog/catalog-explorer.tsx`):**
   - **Tactile Hero Section:** Clean hardware typography, store trust badges (Garansi Resmi, Rakit PC Presisi, Konsultasi Gratis), and quick CTA inside `.clay-card` containers.
   - **Claymorphic Bento Grid Showcase:** Highlight Featured Products (`is_featured = true`) and interactive Category Cards (`Laptop`, `PC Rakitan`, `Komponen PC`, `Monitor`, `Aksesoris`) in an asymmetric Bento layout.
   - **Interactive Catalog Section (`catalog-explorer.tsx`):**
     - **Desktop Left Sidebar (`.clay-card`) & Mobile `<Sheet />` Drawer (`.glass-panel`):**
       - Search input (`.clay-inset`)
       - Category filter pills/list (never use empty string `value=""` in `<SelectItem />`; use `"all"`)
       - Brand multi-checkbox filter
       - Stock status filter (`all`, `available`, `pre_order`, `out_of_stock`)
       - Price Range `<Slider />` with formatted IDR min/max labels in `font-mono`
     - **Top Filter Bar:** Shows total matching products, active filter chips with remove (`X`) button, and Sort `<Select />` (`Terbaru`, `Harga: Rendah ke Tinggi`, `Harga: Tinggi ke Rendah`, `Nama: A-Z`).
     - **Product Grid:** Responsive 1 / 2 / 3-column grid of `<ProductCard />`.

### 🛑 DEFINITION OF DONE (SPRINT 2):
- Verify that `/` renders the Hero, Bento Grid, `Cmd+K` search, and full interactive filtering without errors.
- **STOP HERE.** Do not build Sprint 3 or Admin pages yet. Summarize Sprint 2 deliverables and wait for my Sprint 3 prompt.
```

---

## 🔍 PHASE 3 — SPRINT 3: Product Detail Page, JSONB Spec Table, WhatsApp CTA & Compare Engine

Setelah Sprint 2 selesai, salin dan tempel prompt di bawah ini untuk menjalankan **Sprint 3**:

```markdown
We are now advancing to **PHASE 3 — SPRINT 3: Product Detail Page (`/products/[slug]`), JSONB Technical Specification Table, Direct WhatsApp Order CTA, and Multi-Product Comparison Engine**.

Read `.agent/rules.md` before coding. Execute **ONLY SPRINT 3** tasks below.

### 🎯 SPRINT 3 TASKS:

1. **Multi-Product Comparison Engine (`src/context/compare-context.tsx` & Components):**
   - Create a `CompareProvider` context storing up to **3 products** in state + `localStorage` (`addToCompare`, `removeFromCompare`, `clearCompare`, `isInCompare`).
   - Connect the "Bandingkan" button on `<ProductCard />` and the Navbar Compare counter badge to this context (with `sonner` toast feedback when adding/removing or when limit of 3 is reached).
   - Build `src/components/catalog/compare-bar.tsx`:
     - A floating bottom `.glass-panel` bar that slides up when $\ge 1$ product is selected.
     - Displays mini thumbnails of selected products, a "Hapus Semua" button, and a "Bandingkan Sekarang" `.clay-button`.
   - Build `src/components/catalog/compare-modal.tsx`:
     - Uses `shadcn/ui` `<Dialog />` or `<Sheet />` (always include `<DialogTitle />` for accessibility).
     - Displays a side-by-side comparison table of the selected products: Photo, Name, Brand, Price (`font-mono`), Stock Status, and a merged list of all unique `specifications` labels so users can compare CPU, GPU, RAM, Storage, and Display side-by-side.

2. **Product Detail Page (`src/app/(public)/products/[slug]/page.tsx`):**
   - Remember Next.js 15+ App Router rule: `params` is a Promise (`const { slug } = await params;`).
   - **Breadcrumb Navigation:** `Beranda > Katalog > [Nama Kategori] > [Nama Produk]`.
   - **Left Column — Interactive Claymorphic Image Gallery (`src/components/catalog/product-gallery.tsx`):**
     - Main image preview inside a `.clay-card` container with aspect-square/video support and zoom/lightbox preview.
     - Clickable thumbnail strip below using `.clay-inset` frames with active border highlight.
   - **Right Column — Product Info & Conversion Panel (`.clay-card`):**
     - Brand badge, Stock Status `<Badge />`, and SKU code in `font-mono`.
     - Product Title (`text-2xl md:text-3xl font-bold tracking-tight`).
     - Price Box (`.clay-inset`): Large formatted IDR price in `font-mono`, original strikethrough price, and "Hemat Rp X (Y%)" badge if discounted.
     - `short_description` summary.
     - Key specification highlight pills.
     - **Primary CTA (`.clay-button` in Matte Emerald/Cobalt):** `"Pesan / Tanya via WhatsApp"` — opens `generateWhatsAppLink(product)` in a new tab with a pre-filled Indonesian message:
       *"Halo Admin Alathea Comp, saya tertarik dengan produk *[Nama Produk]* (SKU: [SKU]) seharga *[Harga]*. Apakah stoknya masih tersedia?"*
     - **Secondary Actions:** `"Bandingkan Produk"` toggle button and `"Salin Link Produk"` button (copies URL & triggers `sonner` toast).
   - **Bottom Section — Full Details & JSONB Specification Table:**
     - Use `shadcn/ui` `<Tabs />` (`Spesifikasi Lengkap` & `Deskripsi Produk`).
     - In `Spesifikasi Lengkap`, render a clean striped `<Table />` inside a `.clay-card` iterating over `product.specifications` (`{ label, value }`), using `font-mono` for specification values.
   - **Related Products Section:**
     - Display up to 3 other products from the same category at the bottom of the page.

### 🛑 DEFINITION OF DONE (SPRINT 3):
- Verify `/products/[slug]` works smoothly for any product, WhatsApp link generates properly, and comparing up to 3 products works end-to-end.
- **STOP HERE.** Do not build Sprint 4 (Admin CMS) yet. Summarize Sprint 3 deliverables and wait for my Sprint 4 prompt.
```

---

## 🛠️ PHASE 4 — SPRINT 4: Admin Authentication, Sidebar Layout & Full CRUD CMS

Setelah Sprint 3 selesai, salin dan tempel prompt di bawah ini untuk menjalankan **Sprint 4**:

```markdown
We are now advancing to **PHASE 4 — SPRINT 4: Admin Authentication, Admin Sidebar Layout, Analytics Overview, Category CRUD, and Product CRUD (with Dynamic Spec Builder & Multi-Image Uploader)**.

Read `.agent/rules.md` before coding. Execute **ONLY SPRINT 4** tasks below.

### 🎯 SPRINT 4 TASKS:

1. **Admin Login & Authentication (`src/app/admin/login/page.tsx` & Middleware):**
   - Build a clean, centered `.clay-card` login form for **Alathea Comp Admin CMS** using `react-hook-form` + `zod` (`email`, `password`).
   - Authenticate via Supabase `signInWithPassword`.
   - **Demo Mode Support:** If Supabase environment variables are not configured (or if the user clicks `"Masuk Mode Demo Admin"`), allow setting a local demo session (`localStorage` / cookie) so the Admin CMS can be tested immediately during development and review.

2. **Admin CMS Sidebar Layout (`src/app/admin/layout.tsx`):**
   - Build a responsive Admin Layout using `shadcn/ui` `<SidebarProvider />` and `<Sidebar />` (or a clean matte Clay+Glass sidebar + mobile `<Sheet />` navigation).
   - Navigation links:
     - `Dashboard` (`/admin`, `LayoutDashboard` icon)
     - `Kelola Produk` (`/admin/products`, `Package` icon)
     - `Kelola Kategori` (`/admin/categories`, `Layers` icon)
     - `Lihat Katalog Publik` (`/`, `ExternalLink` icon)
   - Include a top glassmorphic header bar showing active page title, Demo/Connected status badge, Theme Toggle, and `"Keluar (Logout)"` button.

3. **Admin Dashboard Overview (`src/app/admin/page.tsx`):**
   - Render 4 tactile `.clay-card` KPI summary widgets:
     1. **Total Produk** (total count)
     2. **Ready Stock** (count of `stock_status === 'available'`)
     3. **Pre-Order / Stok Habis** (count of `pre_order` + `out_of_stock`)
     4. **Total Kategori** (total categories count)
   - **Category Distribution Card (`.clay-card`):** Visual progress bars showing number of products per category.
   - **Recent Products Table (`.clay-card`):** Quick view of the 5 most recently added/updated products with quick "Tambah Produk Baru" button.

4. **Category Management CRUD (`src/app/admin/categories/page.tsx`):**
   - Display all categories in a `.clay-card` table showing Icon, Category Name, Slug (`font-mono`), Description, Product Count, and Actions (Edit, Delete).
   - Create/Edit Category `<Dialog />` (with `<DialogTitle />`):
     - Fields: `name`, `slug` (auto-generated from name as user types, but editable), `icon` (selectable from verified Lucide hardware icons: `Laptop`, `Cpu`, `Monitor`, `HardDrive`, `Keyboard`, `Mouse`, `Headphones`, `Package`), and `description`.
   - Delete confirmation using `<AlertDialog />` with `sonner` toast feedback.

5. **Product Management CRUD & Dynamic Spec Builder (`src/app/admin/products/page.tsx`):**
   - Build an interactive Data Table (`@tanstack/react-table` inside `.clay-card`) featuring:
     - Search by product name, SKU, or brand.
     - Filter by Category and Stock Status (remember: use `"all"` instead of `""` for `<SelectItem />`).
     - Columns: Thumbnail image, Product Name & Brand, SKU (`font-mono`), Category Badge, Price & Discount Price (`font-mono`), Stock Status Badge, **Quick Featured Toggle (`<Switch />`)**, and Actions (`Edit`, `Hapus`).
   - Build the **Create / Edit Product Modal or Drawer (`<Dialog />` or `<Sheet />`)** with `react-hook-form` + `zod`:
     - Basic Info: `name`, auto-generated `slug`, `sku`, `brand`, `category_id`, `stock_status`, `is_featured` switch.
     - Pricing: `price` (IDR), `discount_price` (optional IDR).
     - Descriptions: `short_description`, `description` (`<Textarea />`).
     - **Dynamic Specification Builder:** An interactive list inside `.clay-inset` where Admin can click `"+ Tambah Spesifikasi"` to add `{ label, value }` rows (e.g., `Processor` -> `AMD Ryzen 7 7800X3D`), edit existing rows, or remove rows with a trash button. Include a quick `"Template Spesifikasi (Laptop / PC / Monitor)"` button that pre-fills common spec labels to save Admin time!
     - **Multi-Image Manager:** Allow uploading files to Supabase Storage bucket `product-images` AND adding image URLs directly, showing `.clay-inset` image previews with a remove button and reordering support.
   - Delete Product confirmation via `<AlertDialog />`.

### 🛑 DEFINITION OF DONE (SPRINT 4):
- Verify `/admin/login`, `/admin`, `/admin/categories`, and `/admin/products` work seamlessly (both with Supabase and in Demo Mode).
- **STOP HERE.** Summarize Sprint 4 deliverables and wait for my Sprint 5 prompt.
```

---

## ✨ PHASE 5 — SPRINT 5: UX Polish, Clay Skeletons, Empty States, SEO & Final Build QA

Setelah Sprint 4 selesai, salin dan tempel prompt terakhir ini untuk menjalankan **Sprint 5**:

```markdown
We are now in the final phase: **PHASE 5 — SPRINT 5: UX Polish, Claymorphic Loading Skeletons, Empty States, Dynamic SEO Metadata, and Final Production Build Verification**.

Read `.agent/rules.md` before coding. Execute **SPRINT 5** tasks below to bring **Alathea Comp** to 100% production readiness.

### 🎯 SPRINT 5 TASKS:

1. **Claymorphic Loading Skeletons:**
   - Create `src/app/(public)/loading.tsx` with `.clay-card` `<Skeleton />` placeholders matching the Hero, Bento Grid, and Product Card Grid layout.
   - Create `src/app/(public)/products/[slug]/loading.tsx` matching the 2-column Product Gallery + Info layout.
   - Create `src/app/admin/loading.tsx` matching the Admin KPI cards and Data Table layout.

2. **Polished Empty States & Custom 404 Page:**
   - Ensure the Catalog Explorer shows a tactile `.clay-card` Empty State when no products match the current search/filter criteria, complete with an icon, helpful Indonesian copy, and a `"Reset Semua Filter"` `.clay-button`.
   - Create `src/app/not-found.tsx` styled with `.clay-card` and a `"Kembali ke Katalog Alathea Comp"` `.clay-button`.

3. **Dynamic SEO & OpenGraph Metadata:**
   - Add descriptive Indonesian metadata to `src/app/layout.tsx` (`Alathea Comp — Katalog Komputer, Laptop & Rakit PC Modern`).
   - Implement `generateMetadata` in `src/app/(public)/products/[slug]/page.tsx` so each product page dynamically sets its `<title>`, `<meta name="description">`, and OpenGraph image based on the product data.

4. **Strict Design & Anti-Hallucination Audit:**
   - Check all components to guarantee **ZERO glow effects** (only Claymorphism `.clay-card`, `.clay-inset`, `.clay-button` and Glassmorphism `.glass-panel`).
   - Check all `<DialogContent />` and `<SheetContent />` for `<DialogTitle />` / `<SheetTitle />` accessibility compliance.
   - Check all `<SelectItem />` components to ensure none use `value=""`.

5. **Final TypeScript & Build Verification:**
   - Run `npx tsc --noEmit` and `npm run build` in the terminal.
   - Fix any TypeScript, ESLint, or Next.js build issues until the production build succeeds with zero errors.
```