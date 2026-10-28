-- Run this whole file in Supabase > SQL Editor.

-- Function to auto-update updated_at column (safe to re-run)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4c. HOMEPAGE HERO (single row, edited from Admin > Tampilan Beranda)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.homepage_hero (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    image_url TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    callouts JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_homepage_hero_updated_at ON public.homepage_hero;
CREATE TRIGGER set_homepage_hero_updated_at
    BEFORE UPDATE ON public.homepage_hero
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.homepage_hero ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read homepage_hero" ON public.homepage_hero;
CREATE POLICY "Public can read homepage_hero"
    ON public.homepage_hero
    FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert homepage_hero" ON public.homepage_hero;
CREATE POLICY "Authenticated users can insert homepage_hero"
    ON public.homepage_hero
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update homepage_hero" ON public.homepage_hero;
CREATE POLICY "Authenticated users can update homepage_hero"
    ON public.homepage_hero
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

INSERT INTO public.homepage_hero (id, image_url, image_alt, callouts)
VALUES (
    1,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85',
    'Laptop unggulan Alathea Comp',
    '[
      {"title": "Liquid Retina XDR", "subtitle": "120Hz ProMotion & 1000 Nits Display"},
      {"title": "22-Hour Battery Life", "subtitle": "Silent Thermal & All-Day Efficiency"},
      {"title": "Apple M4 Max Chip", "subtitle": "Flagship Pro Laptop Computing"}
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Refresh the API so the new table is visible right away
NOTIFY pgrst, 'reload schema';
