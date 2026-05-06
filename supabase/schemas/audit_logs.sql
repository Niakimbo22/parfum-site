-- Persistent audit log for all admin actions.
-- Writes go through the service_role key (bypasses RLS).
-- The anon and authenticated roles must NOT be able to read or write directly.

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'info' CHECK (status IN ('success', 'warning', 'info', 'error')),
    ip TEXT,
    permanent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON audit_logs (actor);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON audit_logs FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS audit_logs_archive (LIKE audit_logs INCLUDING ALL);
ALTER TABLE audit_logs_archive ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON audit_logs_archive FROM anon, authenticated;

-- Archive RPC: moves non-permanent logs to archive, permanent rows STAY FOREVER.
CREATE OR REPLACE FUNCTION archive_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Copy all non-permanent logs to archive
    INSERT INTO audit_logs_archive
    SELECT * FROM audit_logs WHERE permanent = false;
    -- Delete only non-permanent logs
    DELETE FROM audit_logs WHERE permanent = false;
END;
$$;

REVOKE ALL ON FUNCTION archive_audit_logs() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION archive_audit_logs() TO service_role;

-- Migration: add permanent column if table already exists
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS permanent BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE audit_logs_archive ADD COLUMN IF NOT EXISTS permanent BOOLEAN NOT NULL DEFAULT false;

-- Fix status check constraint to include 'error'
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_status_check;
ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_status_check CHECK (status IN ('success', 'warning', 'info', 'error'));
