-- ============================================================================
-- ALATHEA COMP — COMPLETE SUPABASE SCHEMA, RLS, STORAGE & SEED DATA
-- ============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. TABLES CREATION
-- ============================================================================

-- Table: categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'Package',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    price NUMERIC(15, 2) NOT NULL CHECK (price >= 0),
    discount_price NUMERIC(15, 2) CHECK (discount_price IS NULL OR discount_price >= 0),
    stock_status TEXT NOT NULL DEFAULT 'available' CHECK (stock_status IN ('available', 'out_of_stock', 'pre_order')),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    short_description TEXT,
    description TEXT,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. INDEXES & AUTO-UPDATED_AT TRIGGER
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON public.products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Function to auto-update updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES FOR TABLES
-- ============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Categories Policies: Everyone can view, only authenticated Admin can mutate
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories"
    ON public.categories
    FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
CREATE POLICY "Authenticated users can insert categories"
    ON public.categories
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
CREATE POLICY "Authenticated users can update categories"
    ON public.categories
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;
CREATE POLICY "Authenticated users can delete categories"
    ON public.categories
    FOR DELETE
    TO authenticated
    USING (true);

-- Products Policies: Everyone can view, only authenticated Admin can mutate
DROP POLICY IF EXISTS "Public can read products" ON public.products;
CREATE POLICY "Public can read products"
    ON public.products
    FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
CREATE POLICY "Authenticated users can insert products"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
CREATE POLICY "Authenticated users can update products"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
CREATE POLICY "Authenticated users can delete products"
    ON public.products
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- 5. SUPABASE STORAGE BUCKET & STORAGE RLS POLICIES (`product-images`)
-- ============================================================================

-- Create public bucket `product-images` (Max 5MB per file, only image MIME types)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policy 1: Public Read Access for `product-images`
DROP POLICY IF EXISTS "Public Access to Product Images" ON storage.objects;
CREATE POLICY "Public Access to Product Images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'product-images');

-- Storage Policy 2: Authenticated Admin Upload Access
DROP POLICY IF EXISTS "Admin Upload Product Images" ON storage.objects;
CREATE POLICY "Admin Upload Product Images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

-- Storage Policy 3: Authenticated Admin Update Access
DROP POLICY IF EXISTS "Admin Update Product Images" ON storage.objects;
CREATE POLICY "Admin Update Product Images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images')
    WITH CHECK (bucket_id = 'product-images');

-- Storage Policy 4: Authenticated Admin Delete Access
DROP POLICY IF EXISTS "Admin Delete Product Images" ON storage.objects;
CREATE POLICY "Admin Delete Product Images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');

-- ============================================================================
-- 6. INITIAL SEED DATA (5 CATEGORIES & 8 REALISTIC HARDWARE PRODUCTS)
-- ============================================================================

INSERT INTO public.categories (name, slug, icon, description)
VALUES
    ('Laptop', 'laptop', 'Laptop', 'Laptop gaming, ultrabook kerja tipis, dan workstation profesional.'),
    ('PC Rakitan', 'pc-rakitan', 'Cpu', 'PC Desktop custom rakitan siap pakai untuk gaming, editing, dan kantor.'),
    ('Komponen PC', 'komponen-pc', 'HardDrive', 'Processor, Graphic Card (GPU), Motherboard, RAM, SSD NVMe, dan PSU.'),
    ('Monitor', 'monitor', 'Monitor', 'Monitor gaming refresh rate tinggi, OLED, dan layar akurasi warna 4K.'),
    ('Aksesoris', 'aksesoris', 'Keyboard', 'Mechanical keyboard, mouse gaming wireless, headset, dan perlengkapan desk setup.')
ON CONFLICT (slug) DO NOTHING;

-- Insert 8 Realistic Products referencing Categories
INSERT INTO public.products (
    category_id,
    name,
    slug,
    sku,
    brand,
    price,
    discount_price,
    stock_status,
    is_featured,
    short_description,
    description,
    specifications,
    images
)
VALUES
(
    (SELECT id FROM public.categories WHERE slug = 'laptop'),
    'ASUS ROG Zephyrus G16 (2025) OLED',
    'asus-rog-zephyrus-g16-2025-oled',
    'ALT-LPT-001',
    'ASUS',
    36999000,
    34499000,
    'available',
    true,
    'Laptop gaming dan kreator ultra-tipis dengan layar ROG Nebula OLED 240Hz dan GPU RTX 4070.',
    'ASUS ROG Zephyrus G16 menghadirkan sasis CNC aluminum presisi dengan bobot hanya 1.85 kg. Ditenagai prosesor Intel Core Ultra 9 dan layar OLED 2.5K 240Hz berakurasi tinggi untuk kebutuhan gaming kompetitif sekaligus produksi konten profesional.',
    '[
        {"label": "Processor", "value": "Intel Core Ultra 9 185H (16 Cores, up to 5.1 GHz)"},
        {"label": "Graphics (GPU)", "value": "NVIDIA GeForce RTX 4070 8GB GDDR6 (105W TGP)"},
        {"label": "Memory (RAM)", "value": "32GB LPDDR5X 7467MHz"},
        {"label": "Storage", "value": "1TB PCIe 4.0 NVMe M.2 SSD"},
        {"label": "Display", "value": "16-inch 2.5K (2560 x 1600) ROG Nebula OLED, 240Hz, 0.2ms, 100% DCI-P3"},
        {"label": "Battery & Weight", "value": "90WHrs, 1.85 Kg"},
        {"label": "Garansi", "value": "2 Tahun Garansi Resmi ASUS Indonesia + 1 Tahun VIP Perfect Warranty"}
    ]'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80'
    ]
),
(
    (SELECT id FROM public.categories WHERE slug = 'laptop'),
    'Lenovo Legion Pro 5i Gen 9 RTX 4060',
    'lenovo-legion-pro-5i-gen-9-rtx-4060',
    'ALT-LPT-002',
    'Lenovo',
    25999000,
    24299000,
    'available',
    true,
    'Workhorse gaming laptop dengan sistem pendingin Legion ColdFront dan layar PureSight 240Hz.',
    'Lenovo Legion Pro 5i dirancang untuk performa stabil jangka panjang. Menggunakan Intel Core i7-14700HX dan RTX 4060 full-power 140W, sangat ideal untuk rendering 3D, arsitektur, dan game AAA.',
    '[
        {"label": "Processor", "value": "Intel Core i7-14700HX (20 Cores, 28 Threads)"},
        {"label": "Graphics (GPU)", "value": "NVIDIA GeForce RTX 4060 8GB GDDR6 (140W)"},
        {"label": "Memory (RAM)", "value": "16GB DDR5-5600MHz (2x 8GB, Upgradeable)"},
        {"label": "Storage", "value": "1TB SSD M.2 2280 PCIe 4.0x4 NVMe"},
        {"label": "Display", "value": "16-inch WQXGA (2560x1600) IPS 500nits, 240Hz, 100% sRGB, DisplayHDR 400"},
        {"label": "Garansi", "value": "3 Tahun Lenovo Legion Ultimate Support + ADP"}
    ]'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80'
    ]
),
(
    (SELECT id FROM public.categories WHERE slug = 'pc-rakitan'),
    'Alathea Workstation Zero-Glow Edition (Ryzen 7 7800X3D + RTX 4070 Super)',
    'alathea-workstation-zero-glow-7800x3d-4070s',
    'ALT-PC-001',
    'Alathea Custom',
    28750000,
    27490000,
    'available',
    true,
    'PC Rakitan SFF/Mid-Tower minimalis tanpa lampu RGB mencolok, fokus pada airflow senyap dan performa murni.',
    'Dirakit langsung oleh teknisi senior Alathea Comp dengan manajemen kabel tingkat presisi tinggi. Menggunakan casing matte mesh industrial tanpa lampu neon berlebihan, dipadukan prosesor gaming terbaik AMD Ryzen 7 7800X3D dan GPU RTX 4070 Super 12GB.',
    '[
        {"label": "Processor", "value": "AMD Ryzen 7 7800X3D (8 Cores / 16 Threads, 96MB 3D V-Cache)"},
        {"label": "Motherboard", "value": "MSI MAG B650M Mortar WiFi DDR5"},
        {"label": "Graphics (GPU)", "value": "ASUS ProArt GeForce RTX 4070 SUPER 12GB GDDR6X"},
        {"label": "Memory (RAM)", "value": "32GB (2x16GB) Corsair Vengeance DDR5 6000MHz CL30 Matte Black"},
        {"label": "Storage", "value": "1TB Samsung 990 PRO PCIe 4.0 NVMe SSD"},
        {"label": "Cooler & Case", "value": "DeepCool AK620 Zero Dark + Asus Prime AP201 Matte Mesh"},
        {"label": "Power Supply", "value": "Corsair RM750e 750W 80+ Gold Fully Modular ATX 3.0"}
    ]'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80'
    ]
),
(
    (SELECT id FROM public.categories WHERE slug = 'pc-rakitan'),
    'Alathea Creator Studio Mini-ITX (Core i5-14500 + RTX 4060)',
    'alathea-creator-studio-mini-itx-14500',
    'ALT-PC-002',
    'Alathea Custom',
    16850000,
    NULL,
    'available',
    false,
    'PC produktivitas kompak hemat ruang untuk desain grafis, video editing 4K, dan multitasking harian.',
    'Solusi desktop ringkas di atas meja kerja Anda. Menggunakan komponen berstandar industri yang dingin dan hemat daya, siap langsung digunakan dengan Windows 11 Original.',
    '[
        {"label": "Processor", "value": "Intel Core i5-14500 (14 Cores, 20 Threads, up to 5.0 GHz)"},
        {"label": "Motherboard", "value": "ASRock B760M-ITX/D4 WiFi"},
        {"label": "Graphics (GPU)", "value": "MSI GeForce RTX 4060 Ventus 2X Black 8GB OC"},
        {"label": "Memory (RAM)", "value": "32GB (2x16GB) Kingston Fury Beast DDR4 3600MHz"},
        {"label": "Storage", "value": "1TB WD Black SN770 NVMe PCIe Gen4"},
        {"label": "Power Supply", "value": "Cooler Master V650 SFX Gold 650W"}
    ]'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80'
    ]
),
(
    (SELECT id FROM public.categories WHERE slug = 'komponen-pc'),
    'ASUS ProArt GeForce RTX 4070 Ti SUPER 16GB GDDR6X',
    'asus-proart-rtx-4070-ti-super-16gb',
    'ALT-CMP-001',
    'ASUS',
    15890000,
    15250000,
    'available',
    true,
    'Kartu grafis desain minimalis matte black-gold 2.5-slot dengan VRAM 16GB untuk AI dan 3D rendering.',
    'Seri ASUS ProArt dirancang khusus bagi profesional dan pecinta PC minimalis tanpa RGB. Dilengkapi kipas Axial-tech ganda yang hening dan ukuran ramping yang muat di berbagai casing SFF maupun Mid-Tower.',
    '[
        {"label": "GPU Engine", "value": "NVIDIA GeForce RTX 4070 Ti SUPER (8448 CUDA Cores)"},
        {"label": "Video Memory", "value": "16GB GDDR6X (256-bit)"},
        {"label": "Boost Clock", "value": "2670 MHz (OC Mode)"},
        {"label": "Dimensions", "value": "300 x 120 x 50 mm (2.5 Slot)"},
        {"label": "Recommended PSU", "value": "750W (1x 16-pin PCIe 5.0 / 12VHPWR)"},
        {"label": "Garansi", "value": "3 Tahun Garansi Resmi ASUS Indonesia"}
    ]'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80'
    ]
),
(
    (SELECT id FROM public.categories WHERE slug = 'komponen-pc'),
    'AMD Ryzen 7 9800X3D Box Resmi',
    'amd-ryzen-7-9800x3d-box-resmi',
    'ALT-CMP-002',
    'AMD',
    8950000,
    NULL,
    'pre_order',
    true,
    'Prosesor gaming generasi terbaru Zen 5 dengan teknologi 2nd Gen AMD 3D V-Cache.',
    'Prosesor desktop paling dicari untuk performa gaming ekstrem dan efisiensi termal lebih baik berkat arsitektur Zen 5 terbaru pada soket AM5.',
    '[
        {"label": "Cores / Threads", "value": "8 Cores / 16 Threads"},
        {"label": "Base / Boost Clock", "value": "4.7 GHz / Up to 5.2 GHz"},
        {"label": "Total Cache", "value": "104MB (L2 + L3 3D V-Cache)"},
        {"label": "Socket", "value": "AM5 (LGA 1718)"},
        {"label": "Default TDP", "value": "120W"},
        {"label": "Garansi", "value": "3 Tahun Garansi Resmi Distributor Indonesia"}
    ]'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=1200&q=80'
    ]
),
(
    (SELECT id FROM public.categories WHERE slug = 'monitor'),
    'Dell UltraSharp 27 4K USB-C Hub Monitor (U2723QE)',
    'dell-ultrasharp-27-4k-u2723qe',
    'ALT-MON-001',
    'Dell',
    8799000,
    8350000,
    'available',
    false,
    'Monitor produktivitas 27 inci 4K dengan panel IPS Black pertama di dunia dan USB-C Power Delivery 90W.',
    'Menghadirkan rasio kontras 2000:1 dua kali lebih pekat dibanding IPS biasa. Dilengkapi konektivitas satu kabel USB-C 90W dan RJ45 Ethernet bawaan untuk meja kerja rapi ala MacBook dan Ultrabook.',
    '[
        {"label": "Panel Size & Type", "value": "27-inch 4K UHD (3840 x 2160) IPS Black Technology"},
        {"label": "Color Gamut", "value": "98% DCI-P3, 100% sRGB, 100% Rec 709, Delta E < 2"},
        {"label": "Connectivity", "value": "USB-C (90W PD), HDMI 2.0, DisplayPort 1.4 (In/Out), RJ45 LAN"},
        {"label": "Ergonomics", "value": "Height, Pivot (Rotation), Swivel, Tilt Adjustable"},
        {"label": "Garansi", "value": "3 Tahun Dell Advanced Exchange Service"}
    ]'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80'
    ]
),
(
    (SELECT id FROM public.categories WHERE slug = 'aksesoris'),
    'Keychron Q1 Max QMK/VIA Wireless Custom Mechanical Keyboard',
    'keychron-q1-max-wireless-mechanical-keyboard',
    'ALT-ACC-001',
    'Keychron',
    3350000,
    3150000,
    'out_of_stock',
    false,
    'Mechanical keyboard full-metal CNC aluminum 75% dengan koneksi 2.4GHz, Bluetooth 5.1, dan gasket mount.',
    'Keyboard mekanikal kelas antusias dengan bodi aluminium 6063 mesin CNC penuh yang terasa sangat kokoh dan taktil. Mendukung kustomisasi penuh via web QMK/VIA tanpa perlu instalasi software berat.',
    '[
        {"label": "Layout & Body", "value": "75% Layout, Full CNC Machined 6063 Aluminum"},
        {"label": "Connectivity", "value": "2.4 GHz Wireless (1000Hz) / Bluetooth 5.1 / Wired Type-C"},
        {"label": "Mount Style", "value": "Double-Gasket Design with Polycarbonate Plate"},
        {"label": "Keycaps & Switches", "value": "KSA Double-shot PBT Keycaps, Gateron Jupiter Banana Tactile"},
        {"label": "Weight", "value": "1724g (Fully Assembled)"}
    ]'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80'
    ]
)
ON CONFLICT (slug) DO NOTHING;
