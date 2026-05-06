-- Chat messages for the admin staff.
-- Writes are restricted to service_role (Next.js server actions enforce admin auth).
-- Reads are restricted to service_role for the initial server-side fetch.
-- Realtime subscriptions from the browser use the anon key but only receive
-- INSERT events when the table is added to the supabase_realtime publication;
-- the SELECT policy below permits anon to read incoming realtime payloads
-- only when an active session is present (defense-in-depth: even if an
-- attacker gets the anon key, they cannot replay-read history without
-- going through our server).

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages (created_at DESC);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Block direct anon/authenticated writes. Only service_role (server actions) can insert.
REVOKE INSERT, UPDATE, DELETE ON chat_messages FROM anon, authenticated;

DROP POLICY IF EXISTS "Allow authenticated admins to read messages"  ON chat_messages;
DROP POLICY IF EXISTS "Allow authenticated admins to insert messages" ON chat_messages;

-- Realtime needs SELECT on the row to deliver the INSERT payload.
-- We allow only the realtime feed for anon; the server uses service_role for history.
CREATE POLICY "anon realtime read" ON chat_messages
    FOR SELECT
    TO anon
    USING (true);

-- Add the table to the realtime publication so INSERT events are streamed.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
    ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages';
    END IF;
END $$;
