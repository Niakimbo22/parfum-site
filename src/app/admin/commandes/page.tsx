import Link from "next/link";
import { MOCK_ORDERS } from "@/lib/data";
import { Plus, Search, Eye, Trash2 } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white">Gestion des Commandes</h1>
          <p className="text-gray-400">Suivez et gérez les commandes clients.</p>
        </div>
        <Link href="/admin/commandes/nouvelle" className="gold-button flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle Commande
        </Link>
      </div>

      <div className="bg-luxury-black border border-gold/10 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-gold/10 bg-luxury-slate/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Rechercher une commande (N°, client...)" 
              className="w-full bg-luxury-black border border-gold/10 text-white pl-10 pr-4 py-2 text-sm rounded-sm focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-luxury-black text-gold text-xs uppercase tracking-widest border-b border-gold/10">
            <tr>
              <th className="p-4 font-medium">N° Commande</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Statut</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {MOCK_ORDERS.map((order) => (
              <tr key={order.id} className="text-gray-300 hover:bg-gold/5 transition-colors">
                <td className="p-4 font-mono text-xs text-gold">{order.order_number}</td>
                <td className="p-4">
                  <p className="text-white font-medium">{order.customer_name}</p>
                  <p className="text-gray-500 text-xs">{order.customer_email}</p>
                </td>
                <td className="p-4 text-sm">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                <td className="p-4 text-sm font-medium text-white">{order.total_amount} €</td>
                <td className="p-4">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm border ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-gray-500/10 text-gray-500 border-gray-500/20'
                  }`}>
                    {order.status === 'delivered' ? 'Livré' : order.status === 'pending' ? 'En attente' : order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/commandes/${order.id}`} className="p-2 hover:text-gold transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button className="p-2 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
