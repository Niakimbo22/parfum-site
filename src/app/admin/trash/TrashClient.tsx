"use client";

import { RotateCcw, Trash2, Search } from "lucide-react";
import { useState, useTransition } from "react";
import { restoreFromTrash, emptyTrash } from "./actions";

interface TrashItem {
  id: string;
  type: string;
  item_id: string;
  data: any;
  deleted_by: string;
  created_at: string;
}

interface Props {
  items: TrashItem[];
}

export default function TrashClient({ items }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [toConfirm, setToConfirm] = useState<TrashItem | null>(null);
  const [emptyConfirm, setEmptyConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.data.name?.toLowerCase().includes(q) ||
      item.deleted_by.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  const handleRestore = (item: TrashItem) => {
    startTransition(async () => {
      await restoreFromTrash(item.id);
      setToConfirm(null);
    });
  };

  const handleEmptyTrash = () => {
    startTransition(async () => {
      await emptyTrash();
      setEmptyConfirm(false);
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white">Corbeille</h1>
          <p className="text-gray-400">Éléments supprimés (30 jours de rétention).</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => setEmptyConfirm(true)}
            disabled={isPending}
            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-sm text-xs font-medium uppercase tracking-widest"
          >
            Vider corbeille
          </button>
        )}
      </div>

      <div className="bg-luxury-black border border-gold/10 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-gold/10 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-luxury-slate/20 border border-gold/10 text-white pl-10 pr-4 py-2 rounded-sm text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gold/10 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Nom</th>
                <th className="px-6 py-4 font-bold">Supprimé par</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {filtered.map((item) => (
                <tr key={item.id} className="text-sm hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-gray-400 font-medium capitalize">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {item.data.name || item.data.order_number || "—"}
                    {item.data.customer_name && (
                      <span className="text-gray-500 text-xs block">{item.data.customer_name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.deleted_by}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(item.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setToConfirm(item)}
                      disabled={isPending}
                      className="p-2 hover:text-green-400 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 border-t border-gold/10">
            <p className="text-gray-500 italic">Corbeille vide.</p>
          </div>
        )}
      </div>

      {/* Restore confirmation */}
      {toConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-luxury-black border border-gold/30 rounded-sm p-8 max-w-sm mx-4">
            <h2 className="text-xl text-white font-serif mb-2">Restaurer ?</h2>
            <p className="text-gray-400 text-sm mb-4">
              <span className="text-gold font-medium">{toConfirm.data.name}</span> sera restauré.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setToConfirm(null)}
                disabled={isPending}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleRestore(toConfirm)}
                disabled={isPending}
                className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 rounded-sm flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restaurer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty trash confirmation */}
      {emptyConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-luxury-black border border-red-500/30 rounded-sm p-8 max-w-sm mx-4">
            <h2 className="text-xl text-red-400 font-serif mb-2">⚠️ Vider la corbeille ?</h2>
            <p className="text-gray-400 text-sm mb-4">
              Cette action est irréversible. Les {items.length} éléments seront supprimés définitivement.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEmptyConfirm(false)}
                disabled={isPending}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleEmptyTrash}
                disabled={isPending}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Vider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
