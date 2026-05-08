"use client";

import {
  ShoppingBag,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader2,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  StickyNote,
} from "lucide-react";
import { useState, useTransition } from "react";
import { updateCommandeStatus, updateCommandeNotes, deleteCommande } from "./actions";

interface CommandeItem {
  perfume_id: string;
  name: string;
  quantity: number;
  unit_price: number;
}

interface Commande {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  items: CommandeItem[];
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG = {
  pending: {
    label: "En attente",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: Clock,
    dot: "bg-yellow-400",
  },
  confirmed: {
    label: "Confirmée",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: CheckCircle,
    dot: "bg-blue-400",
  },
  shipped: {
    label: "Expédiée",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: Truck,
    dot: "bg-purple-400",
  },
  delivered: {
    label: "Livrée",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle,
    dot: "bg-green-400",
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: XCircle,
    dot: "bg-red-400",
  },
};

const ALL_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

interface Props {
  commandes: Commande[];
}

export default function CommandesClient({ commandes: initialCommandes }: Props) {
  const [commandes, setCommandes] = useState<Commande[]>(initialCommandes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = commandes.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.order_number.toLowerCase().includes(q) ||
      c.customer_name.toLowerCase().includes(q) ||
      c.customer_email.toLowerCase().includes(q);
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: commandes.length,
    pending: commandes.filter((c) => c.status === "pending").length,
    confirmed: commandes.filter((c) => c.status === "confirmed").length,
    shipped: commandes.filter((c) => c.status === "shipped").length,
    delivered: commandes.filter((c) => c.status === "delivered").length,
    cancelled: commandes.filter((c) => c.status === "cancelled").length,
  };

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateCommandeStatus(id, status);
      if (!res?.error) {
        setCommandes((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: status as Commande["status"] } : c))
        );
      }
    });
  };

  const handleSaveNotes = (id: string) => {
    startTransition(async () => {
      const res = await updateCommandeNotes(id, notesValue);
      if (!res?.error) {
        setCommandes((prev) =>
          prev.map((c) => (c.id === id ? { ...c, notes: notesValue } : c))
        );
        setEditingNotesId(null);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteCommande(id);
      if (!res?.error) {
        setCommandes((prev) => prev.filter((c) => c.id !== id));
        setDeletingId(null);
        if (expandedId === id) setExpandedId(null);
      }
    });
  };

  const totalRevenue = commandes
    .filter((c) => c.status !== "cancelled")
    .reduce((sum, c) => sum + Number(c.total_amount), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-serif text-white">Commandes</h1>
          <p className="text-gray-400">Gestion des commandes clients.</p>
        </div>
        <a
          href="/commande"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 border border-gold/20 bg-gold/5 rounded-sm text-xs text-gold hover:bg-gold/10 transition-colors"
        >
          <ShoppingBag className="w-3 h-3" />
          Voir formulaire client
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-luxury-black border border-gold/10 p-4 rounded-sm">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-serif text-white">{commandes.length}</p>
        </div>
        <div className="bg-luxury-black border border-yellow-500/10 p-4 rounded-sm">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">En attente</p>
          <p className="text-2xl font-serif text-yellow-400">{counts.pending}</p>
        </div>
        <div className="bg-luxury-black border border-purple-500/10 p-4 rounded-sm">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Expédiées</p>
          <p className="text-2xl font-serif text-purple-400">{counts.shipped}</p>
        </div>
        <div className="bg-luxury-black border border-gold/10 p-4 rounded-sm">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">CA (hors annulées)</p>
          <p className="text-2xl font-serif text-gold">{totalRevenue.toFixed(2)}€</p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="bg-luxury-black border border-gold/10 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-gold/10 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-luxury-slate/20 border border-gold/10 text-white pl-10 pr-4 py-2 rounded-sm text-sm focus:outline-none focus:border-gold/50 w-64"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-gold/20 text-gold border border-gold/30"
                  : "text-gray-500 hover:text-white border border-transparent"
              }`}
            >
              Toutes ({counts.all})
            </button>
            {ALL_STATUSES.map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                    filterStatus === s
                      ? `${cfg.color} border`
                      : "text-gray-500 hover:text-white border border-transparent"
                  }`}
                >
                  {cfg.label} ({counts[s]})
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gold/10 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4 font-bold">N° Commande</th>
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Articles</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Statut</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {filtered.map((commande) => {
                const cfg = STATUS_CONFIG[commande.status];
                const isExpanded = expandedId === commande.id;
                const items: CommandeItem[] = Array.isArray(commande.items) ? commande.items : [];

                return (
                  <>
                    <tr
                      key={commande.id}
                      className="text-sm hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : commande.id)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-gold text-xs">{commande.order_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{commande.customer_name}</p>
                        <p className="text-gray-500 text-xs">{commande.customer_email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {items.length} article{items.length > 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {Number(commande.total_amount).toFixed(2)}€
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 w-fit px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs italic">
                        {new Date(commande.created_at).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : commande.id)}
                            className="p-2 hover:text-gold transition-colors"
                            title="Détails"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setDeletingId(commande.id)}
                            disabled={isPending}
                            className="p-2 hover:text-red-400 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr key={`${commande.id}-detail`} className="bg-white/2">
                        <td colSpan={7} className="px-6 py-6 border-t border-gold/5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Customer info */}
                            <div>
                              <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Informations client</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                  <User className="w-3.5 h-3.5 text-gold shrink-0" />
                                  {commande.customer_name}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                  <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                                  <a href={`mailto:${commande.customer_email}`} className="hover:text-gold transition-colors">
                                    {commande.customer_email}
                                  </a>
                                </div>
                                {commande.customer_phone && (
                                  <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                                    {commande.customer_phone}
                                  </div>
                                )}
                                {commande.customer_address && (
                                  <div className="flex items-start gap-2 text-sm text-gray-300">
                                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                                    <span className="whitespace-pre-line">{commande.customer_address}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Items */}
                            <div>
                              <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Articles commandés</h4>
                              <div className="space-y-2">
                                {items.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center text-sm">
                                    <div>
                                      <span className="text-white">{item.name}</span>
                                      <span className="text-gray-500 ml-2">×{item.quantity}</span>
                                    </div>
                                    <span className="text-gold font-medium">
                                      {(item.unit_price * item.quantity).toFixed(2)}€
                                    </span>
                                  </div>
                                ))}
                                <div className="pt-2 border-t border-gold/10 flex justify-between text-sm font-medium">
                                  <span className="text-gray-400">Total</span>
                                  <span className="text-white">{Number(commande.total_amount).toFixed(2)}€</span>
                                </div>
                              </div>
                            </div>

                            {/* Status change + Notes */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Modifier le statut</h4>
                                <select
                                  value={commande.status}
                                  onChange={(e) => handleStatusChange(commande.id, e.target.value)}
                                  disabled={isPending}
                                  className="w-full bg-slate-900 border border-gold/20 text-white px-3 py-2 rounded-sm text-sm focus:outline-none focus:border-gold/50 disabled:opacity-50"
                                >
                                  {ALL_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                      {STATUS_CONFIG[s].label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1">
                                  <StickyNote className="w-3 h-3" /> Notes internes
                                </h4>
                                {editingNotesId === commande.id ? (
                                  <div className="space-y-2">
                                    <textarea
                                      value={notesValue}
                                      onChange={(e) => setNotesValue(e.target.value)}
                                      rows={3}
                                      className="w-full bg-slate-900 border border-gold/20 text-white px-3 py-2 rounded-sm text-sm focus:outline-none focus:border-gold/50 resize-none"
                                      placeholder="Ajouter une note..."
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleSaveNotes(commande.id)}
                                        disabled={isPending}
                                        className="px-3 py-1.5 bg-gold/20 text-gold border border-gold/30 rounded-sm text-xs hover:bg-gold/30 transition-colors disabled:opacity-50 flex items-center gap-1"
                                      >
                                        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                        Sauvegarder
                                      </button>
                                      <button
                                        onClick={() => setEditingNotesId(null)}
                                        className="px-3 py-1.5 text-gray-500 text-xs hover:text-white transition-colors"
                                      >
                                        Annuler
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    onClick={() => {
                                      setEditingNotesId(commande.id);
                                      setNotesValue(commande.notes ?? "");
                                    }}
                                    className="min-h-[60px] px-3 py-2 border border-dashed border-gold/10 rounded-sm text-sm text-gray-500 hover:border-gold/30 hover:text-gray-300 cursor-pointer transition-colors"
                                  >
                                    {commande.notes || "Cliquer pour ajouter une note..."}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-20 border-t border-gold/10">
              <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 italic">Aucune commande trouvée.</p>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 italic">Aucune commande trouvée.</p>
            </div>
          ) : (
            <div className="divide-y divide-gold/5">
              {filtered.map((commande) => {
                const cfg = STATUS_CONFIG[commande.status];
                const isExpanded = expandedId === commande.id;
                const items: CommandeItem[] = Array.isArray(commande.items) ? commande.items : [];

                return (
                  <div key={commande.id} className="p-4">
                    <div
                      className="cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : commande.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-gold text-xs">{commande.order_number}</span>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-white font-medium">{commande.customer_name}</p>
                      <p className="text-gray-500 text-xs">{commande.customer_email}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400 text-xs">{items.length} article{items.length > 1 ? "s" : ""}</span>
                        <span className="text-white font-medium text-sm">{Number(commande.total_amount).toFixed(2)}€</span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1 italic">{new Date(commande.created_at).toLocaleString("fr-FR")}</p>
                    </div>

                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : commande.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gold/20 rounded-sm text-xs text-gray-400 hover:text-gold hover:border-gold/40 transition-colors min-h-[44px]"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {isExpanded ? "Fermer" : "Détails"}
                      </button>
                      <button
                        onClick={() => setDeletingId(commande.id)}
                        disabled={isPending}
                        className="p-2 hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gold/10 space-y-4">
                        {/* Customer info */}
                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Informations client</h4>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <User className="w-3.5 h-3.5 text-gold shrink-0" />
                              {commande.customer_name}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                              <a href={`mailto:${commande.customer_email}`} className="hover:text-gold transition-colors truncate">
                                {commande.customer_email}
                              </a>
                            </div>
                            {commande.customer_phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                                {commande.customer_phone}
                              </div>
                            )}
                            {commande.customer_address && (
                              <div className="flex items-start gap-2 text-sm text-gray-300">
                                <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                                <span className="whitespace-pre-line">{commande.customer_address}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Articles</h4>
                          <div className="space-y-1.5">
                            {items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-white">{item.name} <span className="text-gray-500">×{item.quantity}</span></span>
                                <span className="text-gold font-medium">{(item.unit_price * item.quantity).toFixed(2)}€</span>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-gold/10 flex justify-between text-sm font-medium">
                              <span className="text-gray-400">Total</span>
                              <span className="text-white">{Number(commande.total_amount).toFixed(2)}€</span>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Modifier le statut</h4>
                          <select
                            value={commande.status}
                            onChange={(e) => handleStatusChange(commande.id, e.target.value)}
                            disabled={isPending}
                            className="w-full bg-slate-900 border border-gold/20 text-white px-3 py-3 rounded-sm text-base focus:outline-none focus:border-gold/50 disabled:opacity-50"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Notes */}
                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1">
                            <StickyNote className="w-3 h-3" /> Notes internes
                          </h4>
                          {editingNotesId === commande.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={notesValue}
                                onChange={(e) => setNotesValue(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-900 border border-gold/20 text-white px-3 py-3 rounded-sm text-base focus:outline-none focus:border-gold/50 resize-none"
                                placeholder="Ajouter une note..."
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveNotes(commande.id)}
                                  disabled={isPending}
                                  className="flex-1 py-2.5 bg-gold/20 text-gold border border-gold/30 rounded-sm text-xs hover:bg-gold/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1 min-h-[44px]"
                                >
                                  {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                  Sauvegarder
                                </button>
                                <button
                                  onClick={() => setEditingNotesId(null)}
                                  className="px-4 py-2.5 text-gray-500 text-xs hover:text-white transition-colors min-h-[44px]"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setEditingNotesId(commande.id);
                                setNotesValue(commande.notes ?? "");
                              }}
                              className="min-h-[60px] px-3 py-3 border border-dashed border-gold/10 rounded-sm text-sm text-gray-500 hover:border-gold/30 hover:text-gray-300 cursor-pointer transition-colors"
                            >
                              {commande.notes || "Toucher pour ajouter une note..."}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-luxury-black border border-red-500/30 rounded-sm p-8 max-w-sm mx-4">
            <h2 className="text-xl text-red-400 font-serif mb-2">Supprimer la commande ?</h2>
            <p className="text-gray-400 text-sm mb-1">
              <span className="text-white font-medium">
                {commandes.find((c) => c.id === deletingId)?.order_number}
              </span>{" "}
              sera déplacée dans la corbeille.
            </p>
            <p className="text-gray-600 text-xs mb-6">Elle pourra être restaurée depuis la corbeille.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isPending}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={isPending}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-sm flex items-center gap-2 text-sm"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
