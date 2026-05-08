import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Package, AlertTriangle, ShoppingBag, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();

  // Fetch real stats from Supabase
  const [{ count: totalPerfumes }, { count: lowStockCount }, { count: totalCommandes }, { count: pendingCommandes }] =
    await Promise.all([
      supabaseAdmin().from("perfumes").select("*", { count: "exact", head: true }),
      supabaseAdmin().from("perfumes").select("*", { count: "exact", head: true }).lt("stock", 5),
      supabaseAdmin().from("commandes").select("*", { count: "exact", head: true }),
      supabaseAdmin().from("commandes").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);

  const adminName = session?.adminName;

  return (
    <div>
      <div className="mb-8">
        {adminName === "Luca" ? (
          <div className="border-l-4 border-green-600 pl-4 lg:pl-6 py-4 bg-white/5 rounded-r-sm border-r-4 border-r-red-600">
            <h1 className="text-2xl lg:text-3xl font-serif text-white italic">Benvenuto Luca 🇮🇹</h1>
            <p className="text-gray-400 mt-1 uppercase tracking-widest text-xs">Eccellenza Italiana & Lusso Francese</p>
          </div>
        ) : adminName === "Nico" ? (
          <div className="bg-black border border-white/10 p-4 lg:p-8 rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <h1 className="text-2xl lg:text-3xl font-mono text-white tracking-tighter uppercase font-bold">Bienvenue Nico — NC Mods x Les 2 As</h1>
            <p className="text-slate-500 font-mono text-[10px] mt-3 flex items-center gap-2 tracking-[0.3em]">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              SYSTEM READY // V.2.0.4_LUXURY_ENGINE
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-serif text-white">Tableau de bord</h1>
            <p className="text-gray-400">Bienvenue, {adminName || 'Admin'}. Voici un aperçu de l'activité.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-luxury-black border border-gold/10 p-4 lg:p-6 rounded-sm">
          <div className="flex items-center gap-3 lg:gap-4 mb-4">
            <div className="p-2 lg:p-3 bg-gold/10 rounded-full shrink-0">
              <Package className="w-5 h-5 lg:w-6 lg:h-6 text-gold" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Parfums</p>
              <p className="text-xl lg:text-2xl font-serif text-white">{totalPerfumes ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-luxury-black border border-gold/10 p-4 lg:p-6 rounded-sm">
          <div className="flex items-center gap-3 lg:gap-4 mb-4">
            <div className="p-2 lg:p-3 bg-red-500/10 rounded-full shrink-0">
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Stock Faible</p>
              <p className="text-xl lg:text-2xl font-serif text-white">{lowStockCount ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-luxury-black border border-gold/10 p-4 lg:p-6 rounded-sm">
          <div className="flex items-center gap-3 lg:gap-4 mb-4">
            <div className="p-2 lg:p-3 bg-blue-500/10 rounded-full shrink-0">
              <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Commandes</p>
              <p className="text-xl lg:text-2xl font-serif text-white">{totalCommandes ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className="bg-luxury-black border border-yellow-500/10 p-4 lg:p-6 rounded-sm">
          <div className="flex items-center gap-3 lg:gap-4 mb-4">
            <div className="p-2 lg:p-3 bg-yellow-500/10 rounded-full shrink-0">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">En attente</p>
              <p className="text-xl lg:text-2xl font-serif text-yellow-400">{pendingCommandes ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-luxury-black border border-gold/10 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-gold/10 flex justify-between items-center">
          <h2 className="text-lg font-serif text-white">Liens rapides</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gold/5">
          {[
            { href: "/admin/parfums", label: "Gérer les parfums", icon: "📦" },
            { href: "/admin/commandes", label: "Voir les commandes", icon: "🛍️" },
            { href: "/commande", label: "Formulaire client", icon: "🌐", target: "_blank" },
            { href: "/admin/logs", label: "Logs d'activité", icon: "📋" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.target}
              className="p-6 hover:bg-gold/5 transition-colors text-center group"
            >
              <div className="text-2xl mb-2">{link.icon}</div>
              <p className="text-gray-400 text-xs group-hover:text-gold transition-colors">{link.label}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
