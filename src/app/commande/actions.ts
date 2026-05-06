"use server";

import { createClient } from "@/lib/supabase-server";
import { z } from "zod";

const itemSchema = z.object({
  perfume_id: z.string().uuid(),
  name: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  unit_price: z.number().min(0),
});

const commandeSchema = z.object({
  customer_name: z.string().min(1, "Nom requis").max(200),
  customer_email: z.string().email("Email invalide"),
  customer_phone: z.string().optional(),
  customer_address: z.string().min(5, "Adresse requise").max(500),
  items: z.array(itemSchema).min(1, "Sélectionnez au moins un article"),
  notes: z.string().max(500).optional(),
});

export async function createCommande(data: unknown) {
  const parsed = commandeSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return { error: firstError || "Données invalides" };
  }

  const d = parsed.data;
  const total_amount = d.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  // Use anon client (public, no admin needed)
  const supabase = await createClient();

  const { error } = await supabase.from("commandes").insert({
    customer_name: d.customer_name,
    customer_email: d.customer_email,
    customer_phone: d.customer_phone || null,
    customer_address: d.customer_address,
    items: d.items,
    total_amount,
    notes: d.notes || null,
  });

  if (error) {
    console.error("[commande] insert error:", error);
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  return { success: true };
}
