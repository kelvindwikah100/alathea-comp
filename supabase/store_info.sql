-- Run this whole file in Supabase > SQL Editor.

-- Function to auto-update updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 4b. STORE INFO (single row, edited from Admin > Tentang Toko)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.store_info (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    weekday_hours TEXT NOT NULL,
    weekend_hours TEXT NOT NULL,
    address TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_store_info_updated_at ON public.store_info;
CREATE TRIGGER set_store_info_updated_at
    BEFORE UPDATE ON public.store_info
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.store_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read store_info" ON public.store_info;
CREATE POLICY "Public can read store_info"
    ON public.store_info
    FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert store_info" ON public.store_info;
CREATE POLICY "Authenticated users can insert store_info"
    ON public.store_info
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update store_info" ON public.store_info;
CREATE POLICY "Authenticated users can update store_info"
    ON public.store_info
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

INSERT INTO public.store_info (id, name, description, highlights, weekday_hours, weekend_hours, address, whatsapp_number)
VALUES (
    1,
    'Alathea Comp',
    'Pusat katalog laptop resmi, MacBook, dan perangkat hardware terkurasi dengan jaminan 100% garansi resmi serta layanan Custom Upgrade profesional.',
    '[
      {"title": "Katalog Terkurasi", "text": "Laptop resmi, MacBook, dan perangkat hardware pilihan yang sudah kami seleksi kualitasnya."},
      {"title": "100% Garansi Resmi", "text": "Setiap unit dilengkapi garansi resmi distributor, dan kami bantu proses klaimnya."},
      {"title": "Custom Upgrade", "text": "Upgrade RAM, SSD, hingga rakit PC oleh teknisi berpengalaman sesuai kebutuhan kerja Anda."}
    ]'::jsonb,
    '09.00 – 21.00 WIB',
    '10.00 – 18.00 WIB',
    'Jl. Raya Teknologi No. 88, Jakarta (Alathea Store)',
    '6281234567890'
)
ON CONFLICT (id) DO NOTHING;

-- Refresh the API so the new table is visible right away
NOTIFY pgrst, 'reload schema';
