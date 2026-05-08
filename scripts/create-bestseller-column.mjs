/**
 * Script de diagnostic pour la colonne is_bestseller.
 * Usage: node --env-file=.env.local scripts/create-bestseller-column.mjs
 *
 * Si la colonne est manquante, exécuter dans Supabase Dashboard > SQL Editor:
 * ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;
 */
const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!projectRef || !serviceRoleKey) {
  console.error("Variables d'environnement manquantes.");
  process.exit(1);
}

const response = await fetch(
  `https://${projectRef}.supabase.co/rest/v1/rpc/exec_sql`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      sql: "ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;",
    }),
  }
);

if (response.ok) {
  console.log("✓ Colonne is_bestseller créée via exec_sql RPC.");
} else {
  console.log("RPC exec_sql non disponible. Exécutez manuellement:");
  console.log("ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;");
}
