"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { createPerfume } from "../actions";

export default function NewPerfumePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createPerfume({
        name: formData.get("name"),
        brand: formData.get("brand"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string),
        stock: parseInt(formData.get("stock") as string),
        olfactory_family: formData.get("olfactory_family"),
        occasion: formData.get("occasion"),
        season: formData.get("season"),
        top_notes: formData.get("top_notes"),
        heart_notes: formData.get("heart_notes"),
        base_notes: formData.get("base_notes"),
        image_url: formData.get("image_url"),
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/parfums");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/parfums" className="flex items-center gap-2 text-gray-500 hover:text-gold transition-colors mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-white">Nouveau Parfum</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm">
          <h2 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">Informations Générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Nom du parfum</label>
              <input type="text" name="name" required className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50" placeholder="Ex: Bois d'Argent" />
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Marque</label>
              <input type="text" name="brand" defaultValue="Les 2 As" className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Description</label>
              <textarea name="description" rows={4} className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50 resize-none" placeholder="Décrivez l'univers olfactif..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">URL Image</label>
              <input type="text" name="image_url" className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Prix (€)</label>
              <input type="number" name="price" step="0.01" required className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Stock initial</label>
              <input type="number" name="stock" required className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50" placeholder="0" />
            </div>
          </div>
        </div>

        <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm">
          <h2 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">Profil Olfactif & Attributs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Famille Olfactive</label>
              <select name="olfactory_family" className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50 appearance-none">
                <option value="">Sélectionner...</option>
                <option value="Floral">Floral</option>
                <option value="Boisé">Boisé</option>
                <option value="Oriental">Oriental</option>
                <option value="Hespéridé">Hespéridé</option>
                <option value="Fougère">Fougère</option>
                <option value="Chypré">Chypré</option>
                <option value="Cuiré">Cuiré</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Occasion</label>
              <select name="occasion" className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50 appearance-none">
                <option value="">Sélectionner...</option>
                <option value="Quotidien">Quotidien</option>
                <option value="Soirée">Soirée</option>
                <option value="Professionnel">Professionnel</option>
                <option value="Vacances">Vacances</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Saison</label>
              <select name="season" className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50 appearance-none">
                <option value="">Sélectionner...</option>
                <option value="Printemps">Printemps</option>
                <option value="Été">Été</option>
                <option value="Automne">Automne</option>
                <option value="Hiver">Hiver</option>
                <option value="Toutes saisons">Toutes saisons</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm">
          <h2 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">Notes Olfactives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Notes de Tête</label>
              <input type="text" name="top_notes" className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50" placeholder="Séparez par des virgules" />
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Notes de Cœur</label>
              <input type="text" name="heart_notes" className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50" placeholder="Séparez par des virgules" />
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest">Notes de Fond</label>
              <input type="text" name="base_notes" className="w-full bg-luxury-slate border border-gold/10 text-white px-4 py-3 text-base rounded-sm focus:outline-none focus:border-gold/50" placeholder="Séparez par des virgules" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.push("/admin/parfums")} className="px-8 py-3 text-gray-400 hover:text-white transition-colors" disabled={isPending}>
            Annuler
          </button>
          <button type="submit" className="gold-button flex items-center gap-2" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? "Enregistrement..." : "Enregistrer le Parfum"}
          </button>
        </div>
      </form>
    </div>
  );
}
