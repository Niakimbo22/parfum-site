-- Tutorial seen tracking (TEMPORARY — delete after both admins have completed)
CREATE TABLE IF NOT EXISTS admin_tutorial_seen (
  admin_name TEXT PRIMARY KEY,
  seen_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_tutorial_seen ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON admin_tutorial_seen FROM anon, authenticated;
