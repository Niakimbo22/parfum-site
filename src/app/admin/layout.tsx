import { getSession, logout } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  LogOut,
  FileUp,
  History,
  MessageSquare,
  Globe,
  Trash2
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // DEPLOYMENT MARKER: 2026-05-06 23:52 UTC - Vercel test commit
  const session = await getSession();

  // If there's no session, we render the children (Login page) without the sidebar
  // This layout wrapper is used for all /admin/* routes.
  // The middleware handles redirecting unauthenticated users to /admin/login

  if (!session) {
    return <div className="min-h-screen bg-slate-950 text-slate-200">{children}</div>;
  }

  async function handleLogout() {
    "use server";
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

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar - Only visible when authenticated */}
      <aside className="w-64 border-r border-gold/10 bg-luxury-black flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-gold/10 text-center">
          <Link href="/admin" className="font-serif text-xl gold-text font-bold">
            ADMIN 2 AS
          </Link>
          <div className="mt-2 text-[10px] uppercase tracking-widest text-gray-500">
            Connecté: <span className="text-gold">{session?.adminName}</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-sm border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors text-sm gold-text mb-6">
            <Globe className="w-4 h-4" />
            Retour au site
          </Link>

          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-gold/5 transition-colors text-sm">
            <LayoutDashboard className="w-4 h-4 text-gold" />
            Tableau de bord
          </Link>
          <Link href="/admin/parfums" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-gold/5 transition-colors text-sm">
            <Package className="w-4 h-4 text-gold" />
            Parfums
          </Link>
          <Link href="/admin/import" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-gold/5 transition-colors text-sm">
            <FileUp className="w-4 h-4 text-gold" />
            Import en masse
          </Link>
          <Link href="/admin/logs" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-gold/5 transition-colors text-sm">
            <History className="w-4 h-4 text-gold" />
            Logs d'activité
          </Link>
          <Link href="/admin/chat" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-gold/5 transition-colors text-sm">
            <MessageSquare className="w-4 h-4 text-gold" />
            Chat
          </Link>
          <Link href="/admin/trash" className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-gold/5 transition-colors text-sm">
            <Trash2 className="w-4 h-4 text-gold" />
            Corbeille
          </Link>
        </nav>

        <div className="p-4 border-t border-gold/10">
          <form action={handleLogout}>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-sm hover:bg-red-500/10 text-red-400 transition-colors text-sm">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content - Offset for sidebar */}
      <main className="flex-1 pl-64 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
// Force rebuild: 1778103960
