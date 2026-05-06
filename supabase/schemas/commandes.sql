-- Commandes (orders) table
-- Anon can INSERT to place orders from storefront.
-- Only service_role (admin) can SELECT, UPDATE, DELETE.

CREATE SEQUENCE IF NOT EXISTS commande_seq START 1;

CREATE TABLE IF NOT EXISTS commandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL DEFAULT '',
    customer_name TEXT NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 200),
    customer_email TEXT NOT NULL CHECK (char_length(customer_email) BETWEEN 1 AND 300),
    customer_phone TEXT,
    customer_address TEXT,
    items JSONB NOT NULL DEFAULT '[]',
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-generate order_number on INSERT
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'CMD-2AS-' || LPAD(nextval('commande_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_order_number ON commandes;
CREATE TRIGGER trg_set_order_number
  BEFORE INSERT ON commandes
  FOR EACH ROW
  WHEN (NEW.order_number = '')
  EXECUTE FUNCTION set_order_number();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_commandes_updated_at ON commandes;
CREATE TRIGGER trg_commandes_updated_at
  BEFORE UPDATE ON commandes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS commandes_status_idx ON commandes (status);
CREATE INDEX IF NOT EXISTS commandes_created_at_idx ON commandes (created_at DESC);

ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;

-- Customers (anon) can place orders
DROP POLICY IF EXISTS "Customers can place orders" ON commandes;
CREATE POLICY "Customers can place orders" ON commandes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Admins use service_role (bypasses RLS) — no SELECT/UPDATE/DELETE policy needed for anon
REVOKE SELECT, UPDATE, DELETE ON commandes FROM anon, authenticated;
