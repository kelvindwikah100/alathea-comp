# Product Requirements Document (PRD) & Agile Spec: Alathea Comp

**Nama Proyek:** Alathea Comp  
**Tipe Proyek:** Modern Web-Based Product Catalog & Admin CMS  
**Metodologi Pengembangan:** Agile Scrum (5 Phases / Sprints)  
**Tech Stack Utama:** Next.js (App Router, TypeScript), Tailwind CSS, `shadcn/ui` (`--all`), Supabase (Database, Auth, Storage)  
**Target Estetika:** Minimalist Tactile **Claymorphism + Glassmorphism** (Strictly **NO GLOW**, Pure Depth & Multi-layered Shadows)

---

## 1. Gambaran Umum Proyek (Project Overview)
**Alathea Comp** adalah platform katalog produk digital modern untuk toko perangkat keras komputer, laptop, komponen PC, dan aksesoris IT. Aplikasi ini menggabungkan pengalaman eksplorasi produk yang cepat bagi pelanggan dengan panel manajemen inventaris (*Admin CMS*) yang terstruktur bagi pengelola toko.

---

## 2. Filosofi Desain & UI/UX: Minimalist Claymorphism + Glassmorphism (No-Glow)

Sebagai pendekatan *Senior Frontend Engineer*, kita meninggalkan tren *neon/glow* yang berlebihan dan beralih ke estetika **Tactile Hardware Design** (terinspirasi dari desain industrial Braun, Teenage Engineering, dan Apple macOS). Fokus utama adalah permainan **elevasi, bayangan luar (*ambient shadow*), bayangan dalam (*inner clay shadow*), dan lapisan kaca buram (*frosted glass*)**.

### A. Aturan Ketat Visual (Strict Visual Rules)
1.  **ZERO GLOW POLICY:** Dilarang menggunakan efek *neon glow*, *colored drop-shadow*, atau *blurred background blobs* berwarna mencolok.
2.  **Claymorphism (Untuk Card Produk, Bento Box, Tombol, & Badge):**
    *   Menggunakan sudut membulat lembut (`rounded-2xl` hingga `rounded-3xl`).
    *   Mengombinasikan **Outer Drop Shadow** (memberikan jarak dari background) + **Dual Inset Shadow** (highlight putih halus di bagian atas-kiri dan bayangan lembut di bagian bawah-kanan) sehingga elemen tampak bervolume seperti tanah liat matte (*matte clay*) yang solid dan nyaman disentuh.
3.  **Glassmorphism (Untuk Sticky Navbar, Command Search `Cmd+K`, Filter Drawer, & Compare Tray):**
    *   Menggunakan efek kaca buram (`backdrop-blur-xl`) dengan opasitas permukaan `bg-white/75` (Light) atau `bg-zinc-900/75` (Dark).
    *   Dilengkapi garis tepi tipis (*specular border*) `border-white/60 dark:border-zinc-800/80` dan bayangan struktural lembut (`shadow-[0_8px_30px_rgb(0,0,0,0.06)]`).

### B. Palet Warna (Matte Surface Palette)
*   **Light Mode (Default - Matte Off-White):**
    *   Canvas Background: `#F2F4F7` (Soft Cool Clay Gray)
    *   Clay Card Surface: `#F8F9FA` hingga `#FFFFFF`
    *   Primary Text: `#18181B` (Zinc 900) | Secondary Text: `#52525B` (Zinc 600)
*   **Dark Mode (Matte Carbon Clay):**
    *   Canvas Background: `#0F1012` (Deep Matte Charcoal)
    *   Clay Card Surface: `#18191C`
    *   Primary Text: `#F4F4F5` (Zinc 100) | Secondary Text: `#A1A1AA` (Zinc 400)
*   **Accent Color (Solid & Matte):**
    *   Primary Action: Matte Cobalt (`#2563EB`) dengan shadow clay internal.
    *   Stock Available: Matte Emerald (`#059669`).

### C. Formula CSS Utility (Clay + Glass Tokens)
*   **`.clay-card` (Light):**
    `bg-[#F8F9FB] rounded-3xl border border-white/90 shadow-[8px_8px_20px_rgba(163,177,198,0.3),-6px_-6px_16px_rgba(255,255,255,0.9),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-2px_-2px_5px_rgba(163,177,198,0.2)]`
*   **`.clay-card` (Dark):**
    `dark:bg-[#18191D] dark:border-zinc-800/80 dark:shadow-[8px_8px_20px_rgba(0,0,0,0.55),-4px_-4px_12px_rgba(255,255,255,0.02),inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-2px_-2px_5px_rgba(0,0,0,0.5)]`
*   **`.clay-button`:**
    Efek timbul dengan respons tekan `active:scale-[0.98]` dan perubahan *inset shadow* saat ditekan.
*   **`.glass-panel`:**
    `bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/60 dark:border-zinc-800/70 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]`

---

## 3. Arsitektur Database (Supabase PostgreSQL)

### Tabel 1: `categories`
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Default `gen_random_uuid()` |
| `name` | `text` | Nama kategori (Laptop, PC Rakitan, GPU, Monitor, dll) |
| `slug` | `text` (Unique) | URL-friendly slug |
| `icon` | `text` | Nama ikon Lucide |
| `description` | `text` | Deskripsi singkat kategori |
| `created_at` | `timestamptz` | Default `now()` |

### Tabel 2: `products`
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Default `gen_random_uuid()` |
| `category_id` | `uuid` (FK) | Referensi ke `categories.id` (`ON DELETE SET NULL`) |
| `name` | `text` | Nama lengkap produk |
| `slug` | `text` (Unique) | URL-friendly slug |
| `sku` | `text` | Kode SKU barang |
| `brand` | `text` | Merek (ASUS, MSI, Apple, Lenovo, dll) |
| `price` | `numeric` | Harga normal (IDR) |
| `discount_price` | `numeric` | Harga promo/diskon (nullable) |
| `stock_status` | `text` | `'available'`, `'out_of_stock'`, `'pre_order'` |
| `is_featured` | `boolean` | Default `false` |
| `short_description` | `text` | Ringkasan singkat produk |
| `description` | `text` | Deskripsi lengkap produk |
| `specifications` | `jsonb` | Array objek: `[{"label": "Processor", "value": "AMD Ryzen 7 7800X3D"}]` |
| `images` | `text[]` | Array Public URL dari Supabase Storage `product-images` |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |

---

## 4. Agile Roadmap & Pembagian Sprint (Phased Development)

Pengembangan dibagi menjadi **5 Sprint** yang terukur. Setiap Sprint menghasilkan *deliverable* yang berfungsi penuh dan bebas error sebelum lanjut ke Sprint berikutnya.

### Phase 1 — Sprint 1: Project Foundation, Design System & Supabase Core
*   **Goal:** Menyiapkan fondasi Next.js, seluruh komponen `shadcn/ui`, konfigurasi CSS Claymorphism + Glassmorphism, serta integrasi Supabase & skema SQL.
*   **Deliverables:**
    *   Inisialisasi Next.js (App Router, TypeScript) & eksekusi `npx shadcn@latest add --all --yes`.
    *   Setup utility classes `.clay-card`, `.clay-button`, `.clay-inset`, dan `.glass-panel` di `globals.css`.
    *   Pembuatan file `supabase/schema.sql` (Tabel, RLS Policies, Storage Bucket `product-images`, dan Seed Data).
    *   Setup Supabase SSR clients (`client.ts`, `server.ts`, `middleware.ts`) + Fallback Mock Data agar aplikasi tetap berjalan mulus meskipun `.env.local` belum diisi.
    *   Definisi TypeScript Interfaces (`src/types/database.ts`) & helper (`formatRupiah`, `generateSlug`, `generateWhatsAppLink`).

### Phase 2 — Sprint 2: Public Storefront, Bento Showcase & Real-Time Catalog
*   **Goal:** Membangun halaman utama katalog yang cepat, estetik, dan interaktif untuk pengunjung.
*   **Deliverables:**
    *   **Glassmorphic Sticky Navbar** dengan Theme Toggle, navigasi kategori, dan tombol Search `⌘K`.
    *   **Command Palette Search (`Cmd + K`)** menggunakan `<CommandDialog />` untuk pencarian produk instan.
    *   **Hero & Claymorphic Bento Grid** yang menampilkan kategori populer dan produk unggulan (`is_featured`).
    *   **Interactive Product Catalog:** Filter berdasarkan Kategori, Brand, Status Stok, dan Rentang Harga (`<Slider />`), ditambah fitur *Sorting* (Terbaru, Harga Terendah, Harga Tertinggi).

### Phase 3 — Sprint 3: Product Detail Page, WhatsApp Conversion & Compare Engine
*   **Goal:** Memberikan informasi spesifikasi mendalam dan mempermudah konversi pembelian pelanggan.
*   **Deliverables:**
    *   **Halaman Detail Produk (`/products/[slug]`):** Breadcrumb, Galeri Foto `<Carousel />` dengan thumbnail claymorphic, badge stok & persentase diskon.
    *   **Tabel Spesifikasi Teknis:** Render dinamis dari kolom JSONB `specifications` dengan font monospace pada nilai teknis.
    *   **Direct WhatsApp CTA:** Tombol taktil "Pesan / Tanya via WhatsApp" yang menyusun teks otomatis berisi nama produk, harga, dan tautan halaman.
    *   **Fitur Bandingkan Produk (Compare Tray):** Floating Glassmorphic Bar di bagian bawah layar untuk membandingkan hingga 3 produk secara berdampingan di dalam `<Sheet />` atau `<Dialog />`.

### Phase 4 — Sprint 4: Admin Authentication & CMS Inventory Management
*   **Goal:** Membangun sistem manajemen katalog yang aman dan komprehensif bagi Admin Alathea Comp.
*   **Deliverables:**
    *   **Halaman Login Admin (`/admin/login`)** dengan Supabase Auth + proteksi rute di Next.js Middleware.
    *   **Admin Layout (`/admin/layout.tsx`)** menggunakan komponen `<Sidebar />` dari `shadcn/ui`.
    *   **Dashboard Analitik Ringkas (`/admin`):** Claymorphic summary cards (Total Produk, Ready Stock, Habis, Total Kategori) & daftar produk terbaru.
    *   **Manajemen Kategori CRUD (`/admin/categories`):** Tambah, edit, hapus kategori beserta pemilihan ikon.
    *   **Manajemen Produk CRUD (`/admin/products`):**
        *   Data Table (`@tanstack/react-table`) dengan pencarian, filter, quick toggle `is_featured` (`<Switch />`), dan konfirmasi hapus (`<AlertDialog />`).
        *   Form Modal/Drawer Produk dengan **Dynamic Specification Builder** (tambah/hapus baris `{ label, value }`) dan **Multi-Image Uploader** ke Supabase Storage `product-images`.

### Phase 5 — Sprint 5: Quality Assurance, UX Polish & Production Readiness
*   **Goal:** Memastikan tidak ada bug, loading state halus, responsif di semua ukuran layar, dan siap produksi.
*   **Deliverables:**
    *   Implementasi `<Skeleton />` claymorphic pada saat *fetching* data.
    *   Ilustrasi *Empty State* ketika hasil filter kosong + tombol "Reset Filter".
    *   Audit SEO Metadata dinamis pada halaman produk (`generateMetadata`).
    *   Verifikasi TypeScript (`tsc --noEmit`) dan `npm run build` tanpa error.