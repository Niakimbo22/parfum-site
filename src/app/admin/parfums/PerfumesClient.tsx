"use client";

import Link from "next/link";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deletePerfume } from "./actions";

interface Perfume {
  id: string;
  name: string;
  brand: string | null;
  olfactory_family: string | null;
  price: number;
  stock: number;
  image_url: string | null;
}

interface Props {
  perfumes: Perfume[];
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80";

export default function PerfumesClient({ perfumes }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [toDelete, setToDelete] = useState<Perfume | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = perfumes.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (perfume: Perfume) => {
    setToDelete(perfume);
  };

  const confirmDelete = () => {
    if (!toDelete) return;

    startTransition(async () => {
      await deletePerfume(toDelete.id);
      setToDelete(null);
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white">Gestion des Parfums</h1>
          <p className="text-gray-400">Gérez votre catalogue de fragrances.</p>
        </div>
        <Link href="/admin/parfums/nouveau" className="gold-button flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Parfum
        </Link>
      </div>

      <div className="bg-luxury-black border border-gold/10 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-gold/10 bg-luxury-slate/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un parfum..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-luxury-black border border-gold/10 text-white pl-10 pr-4 py-2 text-sm rounded-sm focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-luxury-black text-gold text-xs uppercase tracking-widest border-b border-gold/10">
            <tr>
              <th className="p-4 font-medium">Parfum</th>
              <th className="p-4 font-medium">Famille</th>
              <th className="p-4 font-medium">Prix</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {filtered.map((perfume) => (
              <tr key={perfume.id} className="text-gray-300 hover:bg-gold/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-luxury-slate border border-gold/10 overflow-hidden">
                      <img
                        src={perfume.image_url || FALLBACK_IMG}
                        alt={perfume.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{perfume.name}</p>
                      <p className="text-gray-500 text-xs">{perfume.brand || "Les 2 As"}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm">{perfume.olfactory_family || "Fragrance"}</td>
                <td className="p-4 text-sm">{perfume.price} €</td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      perfume.stock < 5
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "bg-green-500/10 text-green-500 border border-green-500/20"
                    }`}
                  >
                    {perfume.stock} en stock
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/parfums/${perfume.id}`} className="p-2 hover:text-gold transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(perfume)} className="p-2 hover:text-red-500 transition-colors" disabled={isPending}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-20 border-t border-gold/10">
            <p className="text-gray-500 italic">Aucun parfum trouvé.</p>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {toDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-luxury-black border border-gold/30 rounded-sm p-8 max-w-sm mx-4">
            <h2 className="text-xl text-white font-serif mb-2">Supprimer ce parfum ?</h2>
            <p className="text-gray-400 text-sm mb-4">
              <span className="text-gold font-medium">{toDelete.name}</span> sera déplacé à la corbeille.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={isPending}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={isPending}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-sm flex items-center gap-2"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
