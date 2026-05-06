-- Perfume catalogue.
-- Public (anon) can read for the storefront.
-- Writes are restricted to service_role; admin server actions enforce auth.

CREATE TABLE IF NOT EXISTS perfumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
    brand TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    olfactory_family TEXT,
    occasion TEXT,
    season TEXT,
    top_notes TEXT[],
    heart_notes TEXT[],
    base_notes TEXT[],
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS perfumes_name_idx ON perfumes (name);

ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

REVOKE INSERT, UPDATE, DELETE ON perfumes FROM anon, authenticated;

DROP POLICY IF EXISTS "Public read perfumes" ON perfumes;
CREATE POLICY "Public read perfumes" ON perfumes
    FOR SELECT
    TO anon, authenticated
    USING (true);
