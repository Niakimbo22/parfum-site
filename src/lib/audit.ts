import "server-only";
import { supabaseAdmin } from "./supabase-admin";
import { headers } from "next/headers";

export type AuditStatus = "success" | "warning" | "info" | "error";

export interface AuditEntry {
  actor: string;
  action: string;
  details?: any | null;
  status?: AuditStatus;
  permanent?: boolean;
}

async function getIp(): Promise<string | null> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0].trim();
    return h.get("x-real-ip");
  } catch {
    return null;
  }
}

export async function recordAudit(entry: AuditEntry) {
  const ip = await getIp();
  let detailsJson: string | null = null;
  if (entry.details !== null && entry.details !== undefined) {
    try {
      detailsJson = typeof entry.details === "string" ? entry.details : JSON.stringify(entry.details);
    } catch {
      detailsJson = String(entry.details);
    }
  }
  try {
    await supabaseAdmin()
      .from("audit_logs")
      .insert({
        actor: entry.actor,
        action: entry.action,
        details: detailsJson,
        status: entry.status ?? "info",
        ip,
        permanent: entry.permanent ?? false,
      });
  } catch (error) {
    console.error(`[audit] Failed to record "${entry.action}":`, error);
  }
}
