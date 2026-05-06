"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { recordAudit } from "@/lib/audit";

export interface AuditRow {
  id: string;
  actor: string;
  action: string;
  details: string | null;
  status: "success" | "warning" | "info" | "error";
  ip: string | null;
  permanent: boolean;
  created_at: string;
}

export async function fetchAuditLogs(): Promise<AuditRow[]> {
  await requireAdmin();
  const { data, error } = await supabaseAdmin()
    .from("audit_logs")
    .select("id, actor, action, details, status, ip, permanent, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) {
    console.error("[logs] fetch failed:", error);
    return [];
  }
  return (data ?? []) as AuditRow[];
}

export async function archiveAuditLogs(password: string) {
  const session = await requireAdmin();

  // Verify password
  if (typeof password !== "string" || !password) {
    return { error: "Mot de passe requis." };
  }

  const nicoHash = Buffer.from(process.env.ADMIN_HASH_NICO ?? "", "base64").toString("utf8");
  const lucaHash = Buffer.from(process.env.ADMIN_HASH_LUCA ?? "", "base64").toString("utf8");

  const adminHash = session.adminName === "Nico" ? nicoHash : lucaHash;
  const valid = await bcrypt.compare(password, adminHash).catch(() => false);

  if (!valid) {
    await recordAudit({
      actor: session.adminName,
      action: "Tentative réinitialisation logs",
      details: "Mot de passe incorrect.",
      status: "error",
    });
    return { error: "Mot de passe incorrect." };
  }

  // Insert PERMANENT reset entry BEFORE archiving (so it stays forever)
  await recordAudit({
    actor: session.adminName,
    action: "🔒 Logs réinitialisés",
    details: `Journal vidé le ${new Date().toLocaleString("fr-FR")} par ${session.adminName}. Cette entrée est permanente.`,
    status: "warning",
    permanent: true,
  });

  // Archive (only deletes non-permanent rows)
  const { error: archiveErr } = await supabaseAdmin().rpc("archive_audit_logs");
  if (archiveErr) {
    console.error("[logs] archive RPC failed:", archiveErr);
    return { error: "Erreur d'archivage: " + archiveErr.message };
  }

  revalidatePath("/admin/logs");
  return { success: true };
}
