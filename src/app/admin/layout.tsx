import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <div className="min-h-screen bg-slate-950 text-slate-200">{children}</div>;
  }

  // Check if this admin has already seen the tutorial
  const { data: seen } = await supabaseAdmin()
    .from("admin_tutorial_seen")
    .select("admin_name")
    .eq("admin_name", session.adminName)
    .maybeSingle();

  return (
    <AdminShell adminName={session.adminName} showTutorial={!seen}>
      {children}
    </AdminShell>
  );
}
