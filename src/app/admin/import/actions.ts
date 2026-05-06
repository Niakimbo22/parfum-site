"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { recordAudit } from "@/lib/audit";

const PerfumeImportSchema = z.object({
  name: z.string().trim().min(1).max(200),
  brand: z.string().trim().max(120).optional().nullable(),
  description: z.string().trim().max(2000).optional().nullable(),
  price: z.coerce.number().nonnegative().max(1_000_000),
  stock: z.coerce.number().int().nonnegative().max(1_000_000),
  olfactory_family: z.string().trim().max(120).optional().nullable(),
  occasion: z.string().trim().max(120).optional().nullable(),
  season: z.string().trim().max(120).optional().nullable(),
  top_notes: z.array(z.string().max(120)).max(50).optional().nullable(),
  heart_notes: z.array(z.string().max(120)).max(50).optional().nullable(),
  base_notes: z.array(z.string().max(120)).max(50).optional().nullable(),
  image_url: z.string().url().max(2048).optional().nullable(),
});

const BatchSchema = z.array(PerfumeImportSchema).min(1).max(500);

const FORMULA_PREFIX = /^[=+\-@\t\r]/;

function sanitizeStrings<T>(value: T): T {
  if (typeof value === "string") {
    return (FORMULA_PREFIX.test(value) ? `'${value}` : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => sanitizeStrings(v)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeStrings(v);
    }
    return out as T;
  }
  return value;
}

export async function importPerfumes(rows: unknown) {
  const session = await requireAdmin();

  const parsed = BatchSchema.safeParse(rows);
  if (!parsed.success) {
    return {
      error: "Données invalides.",
      issues: parsed.error.issues.slice(0, 5).map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    };
  }

  const sanitized = sanitizeStrings(parsed.data);

  const { error } = await supabaseAdmin().from("perfumes").insert(sanitized);
  if (error) {
    console.error("[import] insert failed:", error);
    await recordAudit({
      actor: session.adminName,
      action: "Import en masse échoué",
      details: error.message.slice(0, 500),
      status: "warning",
    });
    return { error: `Erreur d'importation : ${error.message}` };
  }

  await recordAudit({
    actor: session.adminName,
    action: "Import en masse",
    details: `${sanitized.length} parfums importés`,
    status: "success",
  });

  return { success: true, count: sanitized.length };
}
