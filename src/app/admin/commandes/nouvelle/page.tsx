"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MOCK_PERFUMES } from "@/lib/data";

export default function NewOrderPage() {
  const router = useRouter();
  const [items, setItems] = useState([{ perfumeId: "", quantity: 1 }]);

  const addItem = () => setItems([...items, { perfumeId: "", quantity: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Commande créée avec succès (Mock)");
    router.push("/admin/commandes");
  };

  const nextOrderNumber = `CMD-2AS-00${3}`; // Mock logic

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/commandes" className="flex items-center gap-2 text-gray-500 hover:text-gold transition-colors mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-white">Nouvelle Commande</h1>
        <div className="text-right">
          <p className="text-gray-500 text-xs uppercase tracking-widest">N° de commande</p>
          <p className="text-gold font-mono font-bold">{nextOrderNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm">
          <h2 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">Informations Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Nom complet</label>
              <input type="text" required className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-2 rounded-sm focus:outline-none focus:border-gold/50" placeholder="Ex: Jean Dupont" />
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Email</label>
              <input type="email" required className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-2 rounded-sm focus:outline-none focus:border-gold/50" placeholder="jean@example.com" />
            </div>
          </div>
        </div>

        <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gold uppercase tracking-widest text-xs font-bold">Produits</h2>
            <button type="button" onClick={addItem} className="text-gold text-xs uppercase tracking-widest flex items-center gap-1 hover:underline">
              <Plus className="w-3 h-3" /> Ajouter un produit
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-end animate-fade-in">
                <div className="flex-1 space-y-2">
                  <label className="text-gray-500 text-[10px] uppercase tracking-widest">Sélectionner un parfum</label>
                  <select className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-2 rounded-sm focus:outline-none focus:border-gold/50 appearance-none">
                    <option value="">-- Choisir --</option>
                    {MOCK_PERF_LIST}
                  </select>
                </div>
                <div className="w-24 space-y-2">
                  <label className="text-gray-500 text-[10px] uppercase tracking-widest">Quantité</label>
                  <input type="number" min="1" defaultValue="1" className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-2 rounded-sm focus:outline-none focus:border-gold/50" />
                </div>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="p-2 text-gray-600 hover:text-red-500 transition-colors mb-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.push("/admin/commandes")} className="px-8 py-3 text-gray-400 hover:text-white transition-colors">
            Annuler
          </button>
          <button type="submit" className="gold-button flex items-center gap-2">
            <Save className="w-4 h-4" />
            Créer la Commande
          </button>
        </div>
      </form>
    </div>
  );
}

const MOCK_PERF_LIST = MOCK_PERFUMES.map(p => (
  <option key={p.id} value={p.id}>{p.name} - {p.price}€</option>
));
