/**
 * Script alternatif — tente /rest/v1/rpc/sql endpoint.
 * Usage: node --env-file=.env.local scripts/create-bestseller-column2.mjs
 */
const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!projectRef || !serviceRoleKey) {
  console.error("Variables d'environnement manquantes.");
  process.exit(1);
}

const res = await fetch(`https://${projectRef}.supabase.co/rest/v1/rpc/sql`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  },
  body: JSON.stringify({
    query: "ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;",
  }),
});

if (res.ok) {
  console.log("✓ Colonne créée.");
} else {
  const body = await res.text();
  console.log("Échec:", res.status, body.slice(0, 200));
  console.log("\n⚠️  SQL à exécuter manuellement dans Supabase Dashboard > SQL Editor:");
  console.log("ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;");
}
