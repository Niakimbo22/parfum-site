import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PerfumesClient from "./PerfumesClient";

export const dynamic = "force-dynamic";

export default async function AdminPerfumesPage() {
  await requireAdmin();
  const { data, error } = await supabaseAdmin()
    .from("perfumes")
    .select("id, name, brand, olfactory_family, price, stock, image_url, is_bestseller")
    .order("name");

  if (error) {
    console.error("[parfums] fetch failed:", error);
  }

  return <PerfumesClient perfumes={data ?? []} />;
}
