"use server";

import { getSession, logout } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { redirect } from "next/navigation";

export async function handleLogout() {
  const s = await getSession();
  if (s) {
    await recordAudit({
      actor: s.adminName,
      action: "Déconnexion",
      status: "info",
    });
  }
  await logout();
  redirect("/admin/login");
}
