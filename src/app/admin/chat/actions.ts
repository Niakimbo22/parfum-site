"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { recordAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";

const MessageSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export async function sendChatMessage(input: { content: string }) {
  const session = await requireAdmin();

  const limit = rateLimit(`chat:${session.adminName}`, {
    windowMs: 10 * 1000,
    max: 10,
    blockMs: 30 * 1000,
  });
  if (!limit.ok) {
    return { error: "Vous envoyez trop de messages. Patientez un instant." };
  }

  const parsed = MessageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Message invalide." };
  }

  const { error } = await supabaseAdmin().from("chat_messages").insert({
    sender_name: session.adminName,
    content: parsed.data.content,
  });

  if (error) {
    console.error("[chat] insert failed:", error);
    return { error: "Erreur lors de l'envoi du message." };
  }

  await recordAudit({
    actor: session.adminName,
    action: "Message envoyé (chat)",
    status: "info",
  });

  return { success: true };
}

export async function fetchInitialMessages() {
  await requireAdmin();
  const { data, error } = await supabaseAdmin()
    .from("chat_messages")
    .select("id, sender_name, content, created_at")
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) {
    console.error("[chat] fetch failed:", error);
    return [];
  }
  return data ?? [];
}
