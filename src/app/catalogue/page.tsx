"use client";

import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function CatalogPage() {
  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFamily, setActiveFamily] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  
  const families = ["Tous", "Boisé", "Ambré Floral", "Oriental Boisé", "Floral", "Hespéridé"];

  useEffect(() => {
    async function fetchPerfumes() {
      setLoading(true);
      const supabase = createClient();
      let query = supabase.from("perfumes").select("*");
      
      const { data, error } = await query;
      if (!error && data) {
        setPerfumes(data);
      }
      setLoading(false);
    }
    fetchPerfumes();
  }, []);

  const filteredPerfumes = perfumes.filter(p => {
    const matchesFamily = activeFamily === "Tous" || p.olfactory_family === activeFamily;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFamily && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Notre Collection</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explorez l'art de la haute parfumerie à travers nos créations exclusives. 
              Chaque flacon renferme une histoire, une émotion, un voyage.
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 space-y-8">
              <div>
                <h3 className="text-gold uppercase tracking-widest text-xs font-bold mb-4 flex items-center gap-2">
                  <Filter className="w-3 h-3" /> Familles Olfactives
                </h3>
                <div className="space-y-2">
                  {families.map(f => (
                    <button 
                      key={f}
                      onClick={() => setActiveFamily(f)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-sm transition-colors ${activeFamily === f ? 'bg-gold/10 text-gold border border-gold/20' : 'text-gray-400 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gold uppercase tracking-widest text-xs font-bold mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-3 h-3" /> Occasions
                </h3>
                <div className="space-y-2">
                  {["Tous", "Quotidien", "Soirée", "Professionnel", "Vacances"].map(o => (
                    <button key={o} className="block w-full text-left text-sm px-3 py-2 text-gray-400 hover:text-white transition-colors">
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500 text-sm">
                  {loading ? "Chargement..." : `${filteredPerfumes.length} parfums trouvés`}
                </p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-luxury-black border border-gold/10 text-white pl-10 pr-4 py-2 text-sm rounded-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                </div>
              ) : filteredPerfumes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredPerfumes.map((perfume) => (
                    <Link 
                      href={`/parfum/${perfume.id}`} 
                      key={perfume.id}
                      className="group bg-luxury-black border border-gold/5 hover:border-gold/30 transition-all duration-500 overflow-hidden rounded-sm"
                    >
                      <div className="aspect-[4/5] overflow-hidden relative">
                        <img 
                          src={perfume.image_url || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80"} 
                          alt={perfume.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="p-6">
                        <p className="text-gold text-[10px] uppercase tracking-[0.2em] mb-2">{perfume.olfactory_family || "Fragrance"}</p>
                        <h3 className="text-xl font-serif text-white mb-1 group-hover:text-gold transition-colors">{perfume.name}</h3>
                        <p className="text-gray-500 text-xs mb-4">{perfume.brand || "Les 2 As"}</p>
                        <div className="flex justify-between items-center border-t border-gold/10 pt-4">
                          <span className="text-white font-medium">{perfume.price} €</span>
                          <span className="text-gold text-[10px] uppercase tracking-widest border border-gold/30 px-2 py-1 group-hover:bg-gold group-hover:text-luxury-black transition-all">Découvrir</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 border border-dashed border-gold/10 rounded-sm">
                  <p className="text-gray-500 italic">Aucun parfum ne correspond à votre recherche.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-luxury-black border-t border-gold/10 py-12 px-4 mt-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-2xl gold-text font-bold tracking-widest mb-6 uppercase">Les 2 As</h2>
          <p className="text-gray-600 text-xs tracking-widest">
            © {new Date().getFullYear()} Parfumerie Les 2 As. L'excellence au service de vos sens.
          </p>
        </div>
      </footer>
    </div>
  );
}
