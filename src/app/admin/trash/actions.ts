"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { recordAudit } from "@/lib/audit";

export async function restoreFromTrash(trashId: string) {
  const session = await requireAdmin();

  const { data: trash } = await supabaseAdmin()
    .from("trash")
    .select("*")
    .eq("id", trashId)
    .single();

  if (!trash) return { error: "Élément non trouvé en corbeille" };

  const table = trash.type === "commande" ? "commandes" : "perfumes";

  const { error } = await supabaseAdmin()
    .from(table)
    .insert(trash.data);

  if (error) {
    await recordAudit({
      actor: session.adminName,
      action: "Restauration échouée",
      details: error.message,
      status: "error",
    });
    return { error: error.message };
  }

  await supabaseAdmin().from("trash").delete().eq("id", trashId);

  await recordAudit({
    actor: session.adminName,
    action: `Restauration ${trash.type}`,
    details: `${trash.data?.name || trash.data?.order_number || trashId} depuis corbeille`,
    status: "success",
  });

  revalidatePath("/admin/parfums");
  revalidatePath("/admin/commandes");
  revalidatePath("/admin/trash");
  return { success: true };
}

export async function emptyTrash() {
  const session = await requireAdmin();

  const { error } = await supabaseAdmin()
    .from("trash")
    .delete()
    .gt("id", "");

  if (error) {
    await recordAudit({
      actor: session.adminName,
      action: "Vider corbeille échoué",
      details: error.message,
      status: "error",
    });
    return { error: error.message };
  }

  await recordAudit({
    actor: session.adminName,
    action: "Corbeille vidée",
    status: "warning",
  });

  revalidatePath("/admin/trash");
  return { success: true };
}
