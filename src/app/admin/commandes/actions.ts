"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

// For now, returning mock data since orders are in MOCK_ORDERS
export async function updateOrderStatus(orderId: string, status: string) {
  const session = await requireAdmin();

  await recordAudit({
    actor: session.adminName,
    action: "Modification statut commande",
    details: `${orderId} → ${status}`,
    status: "success",
  });

  revalidatePath("/admin/commandes");
  return { success: true };
}

export async function fetchOrderDetail(orderId: string) {
  // Will be implemented when real DB is ready
  // For now, this is a placeholder
  return { order: null };
}
