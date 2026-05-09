import { getSession } from "@/lib/auth";
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

  return (
    <AdminShell adminName={session.adminName}>
      {children}
    </AdminShell>
  );
}
