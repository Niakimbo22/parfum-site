import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase-server";
import CommandeForm from "./CommandeForm";

export const dynamic = "force-dynamic";

export default async function CommandePage() {
  const supabase = await createClient();

  const { data: perfumes } = await supabase
    .from("perfumes")
    .select("id, name, brand, price, stock")
    .order("name");

  const available = (perfumes ?? []).filter((p) => p.stock > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 md:px-8 text-slate-200">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-3">
              Parfumerie Les 2 As
            </p>
            <h1 className="text-4xl font-serif text-white mb-4">Passer une commande</h1>
            <div className="w-24 h-px bg-gold mx-auto mb-4"></div>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Sélectionnez vos fragrances, renseignez vos coordonnées. Nous vous contacterons pour confirmer et organiser la livraison.
            </p>
          </header>

          {available.length === 0 ? (
            <div className="text-center py-20 bg-luxury-black border border-gold/10 rounded-sm">
              <p className="text-gray-500 italic">Aucun parfum disponible pour le moment.</p>
            </div>
          ) : (
            <CommandeForm perfumes={available} />
          )}
        </div>
      </main>

      <footer className="border-t border-gold/10 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Les 2 As Parfumerie — Tous droits réservés
      </footer>
    </div>
  );
}
