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

  // Show all perfumes (stock check not required at order time — admin manages availability)
  const available = perfumes ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-16">
            <div className="eyebrow mb-5">Commande</div>
            <h1 className="font-serif text-5xl md:text-6xl text-cream tracking-tight leading-none mb-4">
              Votre <em className="not-italic text-gold italic">Sélection</em>
            </h1>
            <div className="w-full h-px bg-gold/10 mt-8 mb-0"></div>
            <p className="text-cream/40 max-w-md text-sm mt-6 leading-relaxed">
              Sélectionnez vos fragrances, renseignez vos coordonnées. Nous vous contacterons pour confirmer et organiser la livraison.
            </p>
          </header>

          {available.length === 0 ? (
            <div className="text-center py-20 bg-luxury-charcoal border border-gold/8">
              <p className="text-cream/30 italic text-sm">Aucun parfum disponible pour le moment.</p>
            </div>
          ) : (
            <CommandeForm perfumes={available} />
          )}
        </div>
      </main>

      <footer className="border-t border-gold/10 py-8 text-center text-[10px] text-cream/20 tracking-widest uppercase">
        © {new Date().getFullYear()} Les 2 As Parfumerie — Tous droits réservés
      </footer>
    </div>
  );
}
