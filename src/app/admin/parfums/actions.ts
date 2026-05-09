"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { recordAudit } from "@/lib/audit";
import { z } from "zod";

const perfumeSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  brand: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Prix invalide"),
  stock: z.number().min(0, "Stock invalide"),
  olfactory_family: z.string().optional(),
  occasion: z.string().optional(),
  season: z.string().optional(),
  top_notes: z.string().optional(),
  heart_notes: z.string().optional(),
  base_notes: z.string().optional(),
  image_url: z.string().optional().nullable(),
});

export async function createPerfume(data: unknown) {
  const session = await requireAdmin();
  const parsed = perfumeSchema.parse(data);

  const { error } = await supabaseAdmin()
    .from("perfumes")
    .insert({
      name: parsed.name,
      brand: parsed.brand || "Les 2 As",
      description: parsed.description,
      price: parsed.price,
      stock: parsed.stock,
      olfactory_family: parsed.olfactory_family,
      occasion: parsed.occasion,
      season: parsed.season,
      top_notes: parsed.top_notes,
      heart_notes: parsed.heart_notes,
      base_notes: parsed.base_notes,
      image_url: parsed.image_url,
    });

  if (error) {
    await recordAudit({
      actor: session.adminName,
      action: "Création parfum échouée",
      details: error.message,
      status: "error",
    });
    return { error: error.message };
  }

  await recordAudit({
    actor: session.adminName,
    action: "Création parfum",
    details: `${parsed.name} - ${parsed.brand}`,
    status: "success",
  });

  revalidatePath("/admin/parfums");
  return { success: true };
}

export async function updatePerfume(id: string, data: unknown) {
  const session = await requireAdmin();
  const parsed = perfumeSchema.parse(data);

  const { error } = await supabaseAdmin()
    .from("perfumes")
    .update({
      name: parsed.name,
      brand: parsed.brand || "Les 2 As",
      description: parsed.description,
      price: parsed.price,
      stock: parsed.stock,
      olfactory_family: parsed.olfactory_family,
      occasion: parsed.occasion,
      season: parsed.season,
      top_notes: parsed.top_notes,
      heart_notes: parsed.heart_notes,
      base_notes: parsed.base_notes,
      image_url: parsed.image_url,
    })
    .eq("id", id);

  if (error) {
    await recordAudit({
      actor: session.adminName,
      action: "Modification parfum échouée",
      details: `${id}: ${error.message}`,
      status: "error",
    });
    return { error: error.message };
  }

  await recordAudit({
    actor: session.adminName,
    action: "Modification parfum",
    details: `${parsed.name} (${id})`,
    status: "success",
  });

  revalidatePath("/admin/parfums");
  return { success: true };
}

export async function deletePerfume(id: string) {
  const session = await requireAdmin();

  // Fetch parfum first
  const { data: perfume } = await supabaseAdmin()
    .from("perfumes")
    .select("name, brand")
    .eq("id", id)
    .single();

  // Move to trash instead of permanent delete
  const { error: trashErr } = await supabaseAdmin()
    .from("trash")
    .insert({
      type: "perfume",
      item_id: id,
      data: perfume,
      deleted_by: session.adminName,
    });

  if (trashErr) {
    await recordAudit({
      actor: session.adminName,
      action: "Suppression parfum échouée",
      details: trashErr.message,
      status: "error",
    });
    return { error: trashErr.message };
  }

  // Delete from main table
  const { error } = await supabaseAdmin()
    .from("perfumes")
    .delete()
    .eq("id", id);

  if (error) {
    await recordAudit({
      actor: session.adminName,
      action: "Suppression parfum échouée",
      details: error.message,
      status: "error",
    });
    return { error: error.message };
  }

  await recordAudit({
    actor: session.adminName,
    action: "Suppression parfum",
    details: `${perfume?.name} (${id}) → Corbeille`,
    status: "warning",
  });

  revalidatePath("/admin/parfums");
  return { success: true };
}

export async function restoreFromTrash(trashId: string) {
  const session = await requireAdmin();

  const { data: trash } = await supabaseAdmin()
    .from("trash")
    .select("*")
    .eq("id", trashId)
    .single();

  if (!trash) return { error: "Élément non trouvé en corbeille" };

  // Restore parfum
  const { error } = await supabaseAdmin()
    .from("perfumes")
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

  // Remove from trash
  await supabaseAdmin().from("trash").delete().eq("id", trashId);

  await recordAudit({
    actor: session.adminName,
    action: "Restauration parfum",
    details: `${trash.data.name} depuis corbeille`,
    status: "success",
  });

  revalidatePath("/admin/parfums");
  revalidatePath("/admin/trash");
  return { success: true };
}

export async function toggleBestseller(id: string, value: boolean) {
  await requireAdmin();
  const { error } = await supabaseAdmin()
    .from("perfumes")
    .update({ is_bestseller: value })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/parfums");
  revalidatePath("/catalogue");
  revalidatePath("/");
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
