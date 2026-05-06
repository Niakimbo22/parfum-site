"use client";

import { useState, useTransition } from "react";
import { Plus, Minus, Trash2, ShoppingBag, CheckCircle, Loader2 } from "lucide-react";
import { createCommande } from "./actions";

interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
}

interface OrderItem {
  perfume_id: string;
  name: string;
  quantity: number;
  unit_price: number;
}

interface Props {
  perfumes: Perfume[];
}

export default function CommandeForm({ perfumes }: Props) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedPerfumeId, setSelectedPerfumeId] = useState(perfumes[0]?.id ?? "");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const addItem = () => {
    const perfume = perfumes.find((p) => p.id === selectedPerfumeId);
    if (!perfume) return;

    const existing = items.find((i) => i.perfume_id === perfume.id);
    if (existing) {
      setItems((prev) =>
        prev.map((i) =>
          i.perfume_id === perfume.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          perfume_id: perfume.id,
          name: perfume.name,
          quantity: 1,
          unit_price: perfume.price,
        },
      ]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.perfume_id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.perfume_id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const res = await createCommande({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || undefined,
        customer_address: customerAddress,
        items,
        notes: notes || undefined,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    });
  };

  if (success) {
    return (
      <div className="text-center py-20">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-green-500/10 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-serif text-white mb-3">Commande envoyée !</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Merci pour votre commande. Nous vous contacterons à{" "}
          <span className="text-gold">{customerEmail}</span> pour confirmer et organiser la livraison.
        </p>
        <a href="/catalogue" className="gold-button inline-flex items-center gap-2 px-8 py-4">
          Retour au catalogue
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Articles */}
      <div className="space-y-6">
        <div className="bg-luxury-black border border-gold/10 rounded-sm p-6">
          <h2 className="text-lg font-serif text-white mb-4">Vos articles</h2>

          {/* Add item */}
          <div className="flex gap-2 mb-6">
            <select
              value={selectedPerfumeId}
              onChange={(e) => setSelectedPerfumeId(e.target.value)}
              className="flex-1 bg-slate-900 border border-gold/20 text-white px-3 py-2 rounded-sm text-sm focus:outline-none focus:border-gold/50"
            >
              {perfumes.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock === 0}>
                  {p.name} — {p.price}€{p.stock === 0 ? " (épuisé)" : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addItem}
              disabled={!selectedPerfumeId || perfumes.find((p) => p.id === selectedPerfumeId)?.stock === 0}
              className="px-4 py-2 bg-gold/10 text-gold border border-gold/20 rounded-sm text-sm hover:bg-gold/20 transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          {/* Items list */}
          {items.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gold/10 rounded-sm">
              <ShoppingBag className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Aucun article ajouté</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.perfume_id}
                  className="flex items-center justify-between p-3 bg-white/5 border border-gold/5 rounded-sm"
                >
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.unit_price}€ / unité</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.perfume_id, -1)}
                      className="w-7 h-7 flex items-center justify-center border border-gold/20 rounded-sm text-gold hover:bg-gold/10 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.perfume_id, 1)}
                      className="w-7 h-7 flex items-center justify-center border border-gold/20 rounded-sm text-gold hover:bg-gold/10 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="text-gold font-medium text-sm ml-2 w-16 text-right">
                      {(item.unit_price * item.quantity).toFixed(2)}€
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.perfume_id)}
                      className="ml-1 p-1 text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-between items-center pt-3 border-t border-gold/10">
                <span className="text-gray-400 text-sm font-medium uppercase tracking-widest text-xs">Total</span>
                <span className="text-2xl font-serif text-gold">{total.toFixed(2)}€</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-luxury-black border border-gold/10 rounded-sm p-6">
          <h2 className="text-lg font-serif text-white mb-4">Notes (optionnel)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instructions spéciales, message cadeau..."
            rows={3}
            maxLength={500}
            className="w-full bg-slate-900 border border-gold/20 text-white px-3 py-2 rounded-sm text-sm focus:outline-none focus:border-gold/50 resize-none placeholder-gray-600"
          />
        </div>
      </div>

      {/* Right: Customer info + Submit */}
      <div className="space-y-6">
        <div className="bg-luxury-black border border-gold/10 rounded-sm p-6">
          <h2 className="text-lg font-serif text-white mb-4">Vos coordonnées</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full bg-slate-900 border border-gold/20 text-white px-3 py-2.5 rounded-sm text-sm focus:outline-none focus:border-gold/50 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="jean@example.com"
                className="w-full bg-slate-900 border border-gold/20 text-white px-3 py-2.5 rounded-sm text-sm focus:outline-none focus:border-gold/50 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                Téléphone
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+33 6 00 00 00 00"
                className="w-full bg-slate-900 border border-gold/20 text-white px-3 py-2.5 rounded-sm text-sm focus:outline-none focus:border-gold/50 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                Adresse de livraison *
              </label>
              <textarea
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder={"12 rue de la Paix\n75001 Paris\nFrance"}
                rows={3}
                className="w-full bg-slate-900 border border-gold/20 text-white px-3 py-2.5 rounded-sm text-sm focus:outline-none focus:border-gold/50 resize-none placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Order summary + submit */}
        <div className="bg-luxury-black border border-gold/10 rounded-sm p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">
              {items.length} article{items.length > 1 ? "s" : ""}
            </span>
            <span className="text-2xl font-serif text-gold">{total.toFixed(2)}€</span>
          </div>
          <p className="text-gray-600 text-xs mb-6">
            Livraison gratuite en France. Nous vous contacterons pour confirmer.
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || items.length === 0}
            className="gold-button w-full flex items-center justify-center gap-3 py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
            {isPending ? "Envoi en cours..." : "Passer la commande"}
          </button>
        </div>
      </div>
    </form>
  );
}
