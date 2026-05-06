import Navbar from "@/components/Navbar";
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 md:px-8 text-slate-200">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-serif text-white mb-4">Votre Panier</h1>
            <div className="w-24 h-px bg-gold mx-auto"></div>
          </header>

          <div className="bg-luxury-black border border-gold/10 rounded-sm p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-6 bg-gold/5 rounded-full">
                <ShoppingBag className="w-12 h-12 text-gold opacity-20" />
              </div>
            </div>
            <h2 className="text-2xl font-serif text-white mb-2">Votre panier est vide</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Découvrez nos fragrances d'exception et trouvez celle qui révélera votre signature olfactive.
            </p>
            <Link href="/catalogue" className="gold-button inline-flex items-center gap-2 px-8 py-4">
              Explorer le Catalogue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 border-t border-gold/10 pt-12">
            <h3 className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold text-center mb-8">Service Client d'Exception</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-white text-sm font-medium mb-1">Livraison Offerte</p>
                <p className="text-gray-500 text-xs">Pour toute commande en France</p>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium mb-1">Échantillons Gratuits</p>
                <p className="text-gray-500 text-xs">Deux échantillons offerts</p>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium mb-1">Paiement Sécurisé</p>
                <p className="text-gray-500 text-xs">Transactions 100% sécurisées</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
