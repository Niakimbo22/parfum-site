"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Props {
  order: Order;
}

export default function OrderDetailClient({ order }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);

  const handleSave = () => {
    console.log("Statut mis à jour:", status);
    router.push("/admin/commandes");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/commandes" className="flex items-center gap-2 text-gray-500 hover:text-gold transition-colors mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Retour aux commandes
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-white">Commande {order.order_number}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 bg-luxury-black border border-gold/10 p-8 rounded-sm">
          <h2 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">Informations Client</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Nom</p>
              <p className="text-white text-lg font-medium">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Email</p>
              <p className="text-gray-300">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Date</p>
              <p className="text-gray-300">{new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>

        <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm">
          <h2 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">Montant</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Sous-total</span>
              <span className="text-white font-medium">{(order.total_amount * 0.9).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frais</span>
              <span className="text-white font-medium">{(order.total_amount * 0.1).toFixed(2)} €</span>
            </div>
            <div className="border-t border-gold/10 pt-3 flex justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-gold font-bold text-lg">{order.total_amount} €</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm mb-8">
        <h2 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">Statut</h2>
        <div className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-luxury-slate border border-gold/10 text-white px-4 py-2 rounded-sm focus:outline-none focus:border-gold/50 appearance-none"
          >
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="shipped">Expédié</option>
            <option value="delivered">Livré</option>
            <option value="cancelled">Annulé</option>
          </select>
          <button onClick={handleSave} className="gold-button flex items-center gap-2">
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>

      <div className="bg-luxury-black border border-gold/10 rounded-sm overflow-hidden">
        <div className="p-8 border-b border-gold/10">
          <h2 className="text-gold uppercase tracking-widest text-xs font-bold">Articles</h2>
        </div>
        <div className="p-8">
          <p className="text-gray-400 text-sm">Structure à finaliser...</p>
        </div>
      </div>
    </div>
  );
}
