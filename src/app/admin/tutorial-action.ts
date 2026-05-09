"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function markTutorialSeen() {
  const session = await requireAdmin();
  await supabaseAdmin()
    .from("admin_tutorial_seen")
    .upsert({ admin_name: session.adminName }, { onConflict: "admin_name" });
  return { ok: true };
}
