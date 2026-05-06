import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase-server";
import { ShoppingCart, ArrowLeft, Star, Heart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ParfumDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: parfum, error } = await supabase
    .from("perfumes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !parfum) {
    // If not found in DB, try mock data as fallback for now or just 404
    // Given the user wants "real" connection, let's stick to DB or 404
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 md:px-8 text-slate-200">
        <div className="max-w-7xl mx-auto">
          <Link href="/catalogue" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour au catalogue
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="relative aspect-square bg-luxury-black border border-gold/10 rounded-sm overflow-hidden group">
              <img 
                src={parfum.image_url || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80"} 
                alt={parfum.name}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col">
              <div className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-2 block">{parfum.brand || "Les 2 As"}</span>
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{parfum.name}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex text-gold">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-gold" />)}
                  </div>
                  <span className="text-gray-500 text-sm">| 12 avis</span>
                </div>
                <p className="text-3xl font-serif text-white">{parfum.price}€</p>
              </div>

              <div className="space-y-6 mb-12">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-400 leading-relaxed text-lg border-l-2 border-gold/20 pl-6 py-2">
                    {parfum.description || "Aucune description disponible pour ce parfum d'exception."}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 p-4 rounded-sm border border-gold/5">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px] block mb-1">Famille Olfactive</span>
                    <span className="text-white">{parfum.olfactory_family || "Non spécifiée"}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-sm border border-gold/5">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px] block mb-1">Occasion</span>
                    <span className="text-white">{parfum.occasion || "Toutes occasions"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="gold-button flex-1 flex items-center justify-center gap-3 py-4 text-sm">
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </button>
                <button className="flex items-center justify-center w-14 h-14 border border-gold/20 rounded-sm hover:bg-gold/5 transition-colors">
                  <Heart className="w-6 h-6 text-gold" />
                </button>
              </div>

              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="text-gold text-[10px] uppercase tracking-widest font-bold mb-4">Pyramide Olfactive</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {parfum.top_notes && parfum.top_notes.length > 0 && (
                      <div className="flex gap-4 items-start">
                        <div className="w-24 text-[10px] uppercase tracking-widest text-gray-500 mt-1">Notes de tête</div>
                        <p className="text-gray-300 text-sm flex-1">{Array.isArray(parfum.top_notes) ? parfum.top_notes.join(", ") : parfum.top_notes}</p>
                      </div>
                    )}
                    {parfum.heart_notes && parfum.heart_notes.length > 0 && (
                      <div className="flex gap-4 items-start">
                        <div className="w-24 text-[10px] uppercase tracking-widest text-gray-500 mt-1">Notes de cœur</div>
                        <p className="text-gray-300 text-sm flex-1">{Array.isArray(parfum.heart_notes) ? parfum.heart_notes.join(", ") : parfum.heart_notes}</p>
                      </div>
                    )}
                    {parfum.base_notes && parfum.base_notes.length > 0 && (
                      <div className="flex gap-4 items-start">
                        <div className="w-24 text-[10px] uppercase tracking-widest text-gray-500 mt-1">Notes de fond</div>
                        <p className="text-gray-300 text-sm flex-1">{Array.isArray(parfum.base_notes) ? parfum.base_notes.join(", ") : parfum.base_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
