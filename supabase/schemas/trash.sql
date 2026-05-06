-- Trash/bin for soft deletes
CREATE TABLE IF NOT EXISTS trash (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'perfume', 'order', etc.
    item_id UUID NOT NULL,
    data JSONB NOT NULL, -- full item data
    deleted_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS trash_created_at_idx ON trash (created_at DESC);
ALTER TABLE trash ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON trash FROM anon, authenticated;
