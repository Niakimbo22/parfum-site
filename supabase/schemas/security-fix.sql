-- ============================================================
-- Security fix: corrige les warnings critiques Supabase
-- À exécuter dans Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Drop des tables abandonnées (vides, non utilisées par le code)
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.admin_logs CASCADE;

-- 2. Durcir la policy RLS de commandes : INSERT only avec validation
DROP POLICY IF EXISTS "Customers can place orders" ON public.commandes;
DROP POLICY IF EXISTS "Anon can insert orders only" ON public.commandes;

CREATE POLICY "Anon can insert orders only"
  ON public.commandes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(customer_name) BETWEEN 1 AND 200
    AND char_length(customer_email) BETWEEN 5 AND 300
    AND position('@' in customer_email) > 1
    AND total_amount >= 0
    AND jsonb_typeof(items) = 'array'
    AND jsonb_array_length(items) > 0
    AND jsonb_array_length(items) <= 50
  );

-- Confirmer le revoke (idempotent)
REVOKE SELECT, UPDATE, DELETE ON public.commandes FROM anon, authenticated;

-- 3. Verrouiller search_path des functions (anti SQL injection via path)
ALTER FUNCTION public.set_order_number() SET search_path = public, pg_catalog;
ALTER FUNCTION public.update_updated_at() SET search_path = public, pg_catalog;

-- update_updated_at_column existe peut-être avec une signature différente — protège-toi
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    EXECUTE 'ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_catalog';
  END IF;
END $$;
