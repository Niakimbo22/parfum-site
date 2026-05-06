"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { recordAudit } from "@/lib/audit";
import { z } from "zod";

const STATUS_VALUES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
const statusSchema = z.enum(STATUS_VALUES);

export async function updateCommandeStatus(id: string, status: string) {
  const session = await requireAdmin();
  const parsed = statusSchema.parse(status);

  const { data: commande } = await supabaseAdmin()
    .from("commandes")
    .select("order_number, customer_name, status")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin()
    .from("commandes")
    .update({ status: parsed })
    .eq("id", id);

  if (error) {
    await recordAudit({
      actor: session.adminName,
      action: "Modification statut commande échouée",
      details: error.message,
      status: "error",
    });
    return { error: error.message };
  }

  await recordAudit({
    actor: session.adminName,
    action: "Statut commande modifié",
    details: `${commande?.order_number} (${commande?.customer_name}): ${commande?.status} → ${parsed}`,
    status: "success",
  });

  revalidatePath("/admin/commandes");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateCommandeNotes(id: string, notes: string) {
  const session = await requireAdmin();

  const { error } = await supabaseAdmin()
    .from("commandes")
    .update({ notes })
    .eq("id", id);

  if (error) return { error: error.message };

  await recordAudit({
    actor: session.adminName,
    action: "Notes commande modifiées",
    details: `Commande ${id}`,
    status: "info",
  });

  revalidatePath("/admin/commandes");
  return { success: true };
}

export async function deleteCommande(id: string) {
  const session = await requireAdmin();

  const { data: commande } = await supabaseAdmin()
    .from("commandes")
    .select("*")
    .eq("id", id)
    .single();

  // Move to trash first
  const { error: trashErr } = await supabaseAdmin()
    .from("trash")
    .insert({
      type: "commande",
      item_id: id,
      data: commande,
      deleted_by: session.adminName,
    });

  if (trashErr) {
    await recordAudit({
      actor: session.adminName,
      action: "Suppression commande échouée",
      details: trashErr.message,
      status: "error",
    });
    return { error: trashErr.message };
  }

  const { error } = await supabaseAdmin()
    .from("commandes")
    .delete()
    .eq("id", id);

  if (error) {
    await recordAudit({
      actor: session.adminName,
      action: "Suppression commande échouée",
      details: error.message,
      status: "error",
    });
    return { error: error.message };
  }

  await recordAudit({
    actor: session.adminName,
    action: "Suppression commande",
    details: `${commande?.order_number} (${commande?.customer_name}) → Corbeille`,
    status: "warning",
  });

  revalidatePath("/admin/commandes");
  revalidatePath("/admin");
  return { success: true };
}
