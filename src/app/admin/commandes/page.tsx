import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CommandesClient from "./CommandesClient";

export const dynamic = "force-dynamic";

export default async function CommandesPage() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin()
    .from("commandes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[commandes] fetch failed:", error);
  }

  return <CommandesClient commandes={data ?? []} />;
}
