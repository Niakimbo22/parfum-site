"use client";

import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, SlidersHorizontal, ArrowRight, User2 } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import { useState, useEffect, Suspense } from "react";

const GENDERS = ["Tous", "Homme", "Femme", "Mixte"] as const;
type Gender = typeof GENDERS[number];

const GENDER_META: Record<Gender, { title: string; eyebrow: string; tag: string }> = {
  Tous:  { title: "Catalogue", eyebrow: "Collection",         tag: "Tous nos parfums" },
  Homme: { title: "Homme",     eyebrow: "Pour Lui",           tag: "Puissance & Élégance" },
  Femme: { title: "Femme",     eyebrow: "Pour Elle",          tag: "Grâce & Mystère" },
  Mixte: { title: "Unisexe",   eyebrow: "Audace & Harmonie",  tag: "Fragrances mixtes" },
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlGender = searchParams.get("gender");
  const initialGender: Gender = (GENDERS as readonly string[]).includes(urlGender ?? "")
    ? (urlGender as Gender)
    : "Tous";

  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFamily, setActiveFamily] = useState("Tous");
  const [activeGender, setActiveGender] = useState<Gender>(initialGender);
  const [activeOccasion, setActiveOccasion] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  const families = ["Tous", "Boisé", "Ambré Floral", "Oriental Boisé", "Floral", "Hespéridé"];

  // Sync state when URL changes (e.g. clicking nav links)
  useEffect(() => {
    const g = searchParams.get("gender");
    setActiveGender((GENDERS as readonly string[]).includes(g ?? "") ? (g as Gender) : "Tous");
  }, [searchParams]);

  // Scroll to top when gender filter changes for clear visual feedback
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeGender]);

  const updateGender = (g: Gender) => {
    setActiveGender(g);
    const params = new URLSearchParams(searchParams.toString());
    if (g === "Tous") params.delete("gender");
    else params.set("gender", g);
    const qs = params.toString();
    router.replace(qs ? `/catalogue?${qs}` : "/catalogue", { scroll: false });
  };

  useEffect(() => {
    async function fetchPerfumes() {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.from("perfumes").select("*");
      if (!error && data) setPerfumes(data);
      setLoading(false);
    }
    fetchPerfumes();
  }, []);

  const filteredPerfumes = perfumes.filter(p => {
    const matchesFamily = activeFamily === "Tous" || p.olfactory_family === activeFamily;
    const matchesGender = activeGender === "Tous" || p.gender === activeGender;
    const matchesOccasion = activeOccasion === "Tous" || (
      Array.isArray(p.occasion) ? p.occasion.includes(activeOccasion) : p.occasion === activeOccasion
    );
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFamily && matchesGender && matchesOccasion && matchesSearch;
  });

  const meta = GENDER_META[activeGender];

  return (
    <div className="min-h-screen flex flex-col bg-luxury-black">
      <Navbar />

      <main className="flex-1 py-16 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Editorial header */}
          <header className="mb-20">
            <div className="eyebrow mb-5">{meta.eyebrow}</div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h1 className="font-serif text-5xl md:text-6xl text-cream tracking-tight leading-none">
                {activeGender === "Tous" ? (
                  <>Notre <em className="not-italic text-gold italic">Catalogue</em></>
                ) : (
                  <>Collection <em className="not-italic text-gold italic">{meta.title}</em></>
                )}
              </h1>
              <p className="text-cream/40 max-w-xs text-sm leading-relaxed">
                {activeGender === "Tous"
                  ? "L'art de la haute parfumerie à travers nos créations exclusives. Chaque flacon renferme une histoire, une émotion, un voyage."
                  : `${meta.tag}. Une sélection de fragrances choisies pour sublimer votre présence.`}
              </p>
            </div>
            <div className="mt-8 w-full h-px bg-gold/10"></div>
          </header>

          <div className="flex flex-col lg:flex-row gap-12">

            {/* Sidebar Filters */}
            <aside className="lg:w-56 shrink-0">
              <div className="sticky top-32 space-y-10">

                {/* Search */}
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-4">Recherche</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream/20" />
                    <input
                      type="text"
                      placeholder="Nom, marque…"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-luxury-charcoal border border-gold/10 text-cream text-xs pl-9 pr-4 py-2.5 focus:outline-none focus:border-gold/30 placeholder-cream/20 transition-colors"
                    />
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-4 flex items-center gap-2">
                    <User2 className="w-3 h-3" /> Genre
                  </p>
                  <div className="space-y-1">
                    {GENDERS.map(g => (
                      <button
                        key={g}
                        onClick={() => updateGender(g)}
                        className={`relative block w-full text-left text-xs px-4 py-2.5 transition-all duration-200 ${
                          activeGender === g
                            ? "text-gold bg-gold/5"
                            : "text-cream/40 hover:text-cream"
                        }`}
                      >
                        {activeGender === g && (
                          <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold"></span>
                        )}
                        {g === "Mixte" ? "Unisexe" : g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Famille */}
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-4 flex items-center gap-2">
                    <Filter className="w-3 h-3" /> Familles
                  </p>
                  <div className="space-y-1">
                    {families.map(f => (
                      <button
                        key={f}
                        onClick={() => setActiveFamily(f)}
                        className={`relative block w-full text-left text-xs px-4 py-2.5 transition-all duration-200 ${
                          activeFamily === f
                            ? "text-gold bg-gold/5"
                            : "text-cream/40 hover:text-cream"
                        }`}
                      >
                        {activeFamily === f && (
                          <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold"></span>
                        )}
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occasions */}
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="w-3 h-3" /> Occasions
                  </p>
                  <div className="space-y-1">
                    {["Tous", "Quotidien", "Soirée", "Professionnel", "Vacances"].map(o => (
                      <button
                        key={o}
                        onClick={() => setActiveOccasion(o)}
                        className={`relative block w-full text-left text-xs px-4 py-2.5 transition-all duration-200 ${
                          activeOccasion === o
                            ? "text-gold bg-gold/5"
                            : "text-cream/40 hover:text-cream"
                        }`}
                      >
                        {activeOccasion === o && (
                          <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold"></span>
                        )}
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <p className="text-cream/30 text-xs tracking-widest uppercase">
                  {loading ? "Chargement…" : `${filteredPerfumes.length} parfum${filteredPerfumes.length > 1 ? "s" : ""}`}
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="dot-loader flex items-center gap-2">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ) : filteredPerfumes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredPerfumes.map((perfume, idx) => (
                    <Link
                      href={`/parfum/${perfume.id}`}
                      key={perfume.id}
                      className="group bg-luxury-charcoal hover:shadow-[0_8px_32px_0_rgba(201,169,97,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 active:scale-[0.98] active:shadow-none block overflow-hidden stagger-item"
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      {/* N° badge */}
                      <div className="px-5 pt-4 flex justify-between items-center">
                        <span className="text-[9px] tracking-[0.35em] text-cream/20 font-light font-oldstyle">
                          N°{String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] tracking-[0.2em] uppercase text-gold/40">
                          {perfume.olfactory_family || "Fragrance"}
                        </span>
                      </div>

                      {/* Image */}
                      <div
                        className="aspect-[4/5] overflow-hidden relative mt-2 mx-2 bg-[#F7F5F0]"
                        style={{ viewTransitionName: `perfume-img-${perfume.id}` }}
                      >
                        {perfume.is_bestseller && (
                          <div className="absolute top-3 left-3 z-10 text-[8px] tracking-[0.3em] uppercase bg-gold text-luxury-black px-2 py-1 font-medium">
                            Bestseller
                          </div>
                        )}
                        {perfume.image_url ? (
                          <img
                            src={perfume.image_url}
                            alt={perfume.name}
                            className="w-full h-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
                            <span className="font-serif text-5xl text-luxury-black/10">№</span>
                            <span className="text-luxury-black/20 text-[9px] tracking-[0.3em] uppercase text-center">{perfume.name}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Info */}
                      <div className="p-5 pb-6">
                        <h3 className="font-serif text-lg text-cream group-hover:text-gold transition-colors duration-300 mb-0.5 leading-snug">
                          {perfume.name}
                        </h3>
                        <p className="text-cream/30 text-xs mb-4 tracking-wide">
                          {perfume.brand || "Les 2 As"}
                        </p>
                        <div className="flex justify-between items-center pt-4 border-t border-gold/8">
                          <span className="font-serif text-xl text-cream font-oldstyle">
                            {perfume.price}<span className="text-xs text-cream/40 ml-1">€</span>
                          </span>
                          <span className="text-[9px] tracking-[0.3em] uppercase text-gold/50 group-hover:text-gold transition-colors flex items-center gap-1.5">
                            Découvrir <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-28 border border-dashed border-gold/8">
                  <p className="text-cream/25 italic text-sm">Aucun parfum ne correspond à votre recherche.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-luxury-charcoal border-t border-gold/10 pt-20 pb-10 px-6 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="font-serif text-cream text-lg mb-6 tracking-tight">Les 2 As</h3>
              <p className="text-cream/35 text-sm leading-relaxed">
                Maison de parfumerie fine à Paris. L'excellence olfactive depuis 2026.
              </p>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-6">Boutique</h4>
              <ul className="space-y-3">
                {["Catalogue", "Nouveautés", "Bestsellers", "Coffrets"].map(l => (
                  <li key={l}>
                    <Link href="/catalogue" className="text-cream/40 hover:text-cream text-sm transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-6">Contact</h4>
              <ul className="space-y-3 text-sm text-cream/40">
                {/* email à venir */}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-6">Newsletter</h4>
              <p className="text-cream/35 text-xs mb-4 leading-relaxed">Recevez nos nouvelles parutions et offres exclusives.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="votre@email.fr"
                  className="flex-1 bg-luxury-black border border-gold/15 text-cream text-xs px-4 py-2.5 focus:outline-none focus:border-gold/40 placeholder-cream/20 min-w-0"
                />
                <button className="bg-gold text-luxury-black text-[9px] tracking-widest uppercase px-4 py-2.5 hover:bg-gold-light transition-colors shrink-0">
                  OK
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gold/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-cream/20 text-[10px] tracking-widest uppercase">
              © {new Date().getFullYear()} Parfumerie Les 2 As. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" aria-label="Instagram" className="text-cream/30 hover:text-gold transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="text-cream/30 hover:text-gold transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
            <Link href="/admin/login" className="text-cream/10 hover:text-gold/40 text-[9px] uppercase tracking-[0.4em] transition-colors">
              Espace Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-black flex items-center justify-center">
          <div className="dot-loader flex items-center gap-2">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
