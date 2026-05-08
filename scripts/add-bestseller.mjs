import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Variables d'environnement manquantes: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// Try to update a row with is_bestseller — if column missing, we get error code PGRST204
const { error } = await supabase
  .from("perfumes")
  .update({ is_bestseller: false })
  .eq("is_bestseller", false);

if (error && (error.code === "42703" || error.code === "PGRST204")) {
  console.log("Colonne manquante — SQL à exécuter dans le Dashboard Supabase > SQL Editor:");
  console.log("ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;");
  process.exit(1);
} else if (error) {
  console.error("Autre erreur:", error.message, error.code);
  process.exit(1);
} else {
  console.log("✓ Colonne is_bestseller OK — elle existe déjà.");
}
