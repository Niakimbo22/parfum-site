import { getSession } from "@/lib/auth";
import { MOCK_PERFUMES, MOCK_ORDERS } from "@/lib/data";
import { Package, ShoppingBag, AlertTriangle } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getSession();
  
  const totalPerfumes = MOCK_PERFUMES.length;
  const totalOrders = MOCK_ORDERS.length;
  const lowStockCount = MOCK_PERFUMES.filter(p => p.stock < 5).length;

  const adminName = session?.adminName;

  return (
    <div>
      <div className="mb-8">
        {adminName === "Luca" ? (
          <div className="border-l-4 border-green-600 pl-6 py-4 bg-white/5 rounded-r-sm border-r-4 border-r-red-600">
            <h1 className="text-3xl font-serif text-white italic">Benvenuto Luca 🇮🇹</h1>
            <p className="text-gray-400 mt-1 uppercase tracking-widest text-xs">Eccellenza Italiana & Lusso Francese</p>
          </div>
        ) : adminName === "Nico" ? (
          <div className="bg-black border border-white/10 p-8 rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <h1 className="text-3xl font-mono text-white tracking-tighter uppercase font-bold">Bienvenue Nico — NC Mods x Les 2 As</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-luxury-black border border-gold/10 p-6 rounded-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gold/10 rounded-full">
              <Package className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Parfums</p>
              <p className="text-2xl font-serif text-white">{totalPerfumes}</p>
            </div>
          </div>
        </div>

        <div className="bg-luxury-black border border-gold/10 p-6 rounded-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gold/10 rounded-full">
              <ShoppingBag className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Commandes</p>
              <p className="text-2xl font-serif text-white">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-luxury-black border border-gold/10 p-6 rounded-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Stock Faible</p>
              <p className="text-2xl font-serif text-white">{lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-luxury-black border border-gold/10 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-gold/10 flex justify-between items-center">
          <h2 className="text-lg font-serif text-white">Activités récentes</h2>
        </div>
        <div className="divide-y divide-gold/5">
          {[
            { admin: "Nico", action: "Modifié stock 'Bois d'Argent'", time: "Il y a 10 min" },
            { admin: "Luca", action: "Ajouté nouveau parfum 'Soleil Blanc'", time: "Il y a 2h" },
            { admin: "Nico", action: "Validé commande CMD-2AS-001", time: "Hier" }
          ].map((log, i) => (
            <div key={i} className="p-4 flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold">
                  {log.admin[0]}
                </span>
                <div>
                  <p className="text-white font-medium">{log.action}</p>
                  <p className="text-gray-500 text-xs">{log.admin}</p>
                </div>
              </div>
              <span className="text-gray-600 text-xs italic">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
