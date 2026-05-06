# Parfumerie Les 2 As - Admin Panel

**Tech Stack:** Next.js 16.2.4 (App Router) + Supabase + Custom JWT Auth

**Key Features:**
- ✅ Gestion parfums (CRUD + corbeille)
- ✅ Commandes (détail + modification statut)
- ✅ Import CSV en masse (Zod validation)
- ✅ Chat Realtime avec audit
- ✅ Logs persistants (soft delete, permanent entries)
- ✅ Rate-limiting (login/chat)
- ✅ Authentification : 2 admins (Nico/Luca), bcryptjs, session JWT

**Critical Files:**
- `src/lib/auth.ts` - Session + JWT + double TTL
- `src/lib/supabase-admin.ts` - Service role (server-only)
- `src/app/admin/*/actions.ts` - Server Actions + Zod
- `.env.local` - SESSION_SECRET (≥32 chars), hashes en base64

**Next:** Exécuter SQL dans Supabase: `supabase/schemas/trash.sql`
