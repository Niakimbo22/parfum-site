import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import TrashClient from "./TrashClient";

export const dynamic = "force-dynamic";

export default async function AdminTrashPage() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin()
    .from("trash")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[trash] fetch failed:", error);
  }

  return <TrashClient items={data ?? []} />;
}
