import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import { createClient } from "@/lib/supabase-server";

const BRANDS = [
  "Dior", "Chanel", "Creed", "Bvlgari", "YSL",
  "Paco Rabanne", "Versace", "Armani", "JPG", "Mont Blanc", "MFK"
];

const FEATURED = [
  {
    num: "01",
    title: "Pour Lui",
    desc: "Puissance & Élégance",
    img: "/images/parfums/dior-sauvage.png",
    href: "/catalogue?gender=Homme",
  },
  {
    num: "02",
    title: "Pour Elle",
    desc: "Grâce & Mystère",
    img: "/images/parfums/chanel-n5.png",
    href: "/catalogue?gender=Femme",
  },
  {
    num: "03",
    title: "Unisexe",
    desc: "Audace & Harmonie",
    img: "/images/parfums/baccarat.png",
    href: "/catalogue?gender=Mixte",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: bestsellers } = await supabase
    .from("perfumes")
    .select("id, name, brand, image_url, price")
    .eq("is_bestseller", true)
    .limit(4);

  return (
    <main className="flex flex-col min-h-screen noise-overlay">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-luxury-black">

        {/* Ambient background glow — breathing */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-gold/4 blur-[120px] animate-pulse-glow"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px] animate-pulse-glow" style={{ animationDelay: "3s" }}></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: editorial text */}
            <div className="flex flex-col gap-8">
              <div className="eyebrow stagger-item animate-delay-100">Depuis 2026</div>

              <h1 className="stagger-item animate-delay-200 leading-none">
                <span className="block font-serif text-7xl md:text-8xl lg:text-9xl text-cream tracking-tight">L'Art</span>
                <span className="block font-serif text-7xl md:text-8xl lg:text-9xl text-cream tracking-tight">du</span>
                <span className="block font-serif italic text-7xl md:text-8xl lg:text-9xl shimmer-gold tracking-tight">Parfum</span>
              </h1>

              <p className="stagger-item animate-delay-300 text-cream/50 text-base md:text-lg font-light leading-relaxed max-w-sm">
                Une sélection de fragrances d'exception — choisies pour sublimer votre présence et marquer les esprits.
              </p>

              <div className="stagger-item animate-delay-400 flex flex-col sm:flex-row gap-4 items-start">
                <Link href="/catalogue" className="gold-button inline-flex items-center gap-3 group">
                  Explorer la Collection
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/a-propos"
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-cream/50 hover:text-cream border border-cream/10 hover:border-cream/30 px-8 py-3 transition-all duration-300"
                >
                  Notre Histoire
                </Link>
              </div>

              {/* Brands — marquee animé */}
              <div className="stagger-item animate-delay-500 pt-8 border-t border-gold/10">
                <p className="text-[9px] tracking-[0.4em] uppercase text-cream/30 mb-4">Marques distribuées</p>
                <div className="overflow-hidden">
                  <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {[...BRANDS, ...BRANDS].map((b, i) => (
                      <span key={i} className="text-[10px] tracking-widest text-cream/40 hover:text-gold transition-colors cursor-default shrink-0">
                        {b} <span className="text-gold/30">·</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: perfume image — floating */}
            <div className="stagger-item animate-delay-300 relative flex justify-center lg:justify-end">
              <div className="relative w-[340px] md:w-[440px] h-[500px] md:h-[640px]">
                <div className="absolute inset-0 bg-gold/8 blur-[60px] rounded-full scale-90 animate-pulse-glow"></div>
                <div
                  className="relative w-full h-full animate-float"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                  }}
                >
                  <img
                    src="/images/parfums/creed-aventus.png"
                    alt="Creed Aventus"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                <span className="absolute top-6 right-6 font-serif text-[80px] leading-none text-gold/5 pointer-events-none select-none">N°1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-cream/30 z-10">
          <span className="text-[9px] uppercase tracking-[0.4em]">Découvrir</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ── Featured Collections ──────────────────── */}
      <section className="py-32 px-6 bg-luxury-charcoal">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 reveal">
            <div>
              <div className="eyebrow mb-4">Univers</div>
              <h2 className="font-serif text-4xl md:text-5xl text-cream tracking-tight">
                Collections <em className="not-italic text-gold">Signature</em>
              </h2>
            </div>
            <Link href="/catalogue" className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold/60 hover:text-gold transition-colors">
              Voir tout le catalogue <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED.map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="reveal group relative h-[600px] overflow-hidden cursor-pointer block"
                data-reveal-delay={String(i * 120)}
              >
                <span className="absolute top-6 left-6 z-20 font-serif text-xs text-cream/30 tracking-widest">{cat.num}</span>
                <div className="absolute inset-0 bg-luxury-charcoal">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 p-8"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/30 to-transparent"></div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gold/3"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <p className="text-[9px] uppercase tracking-[0.35em] text-gold/70 mb-2">{cat.desc}</p>
                  <h3 className="font-serif text-2xl text-cream mb-6 group-hover:text-gold transition-colors duration-300">{cat.title}</h3>
                  <div className="w-8 h-px bg-gold group-hover:w-16 transition-all duration-500 ease-out"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial quote ───────────────────────── */}
      <section className="py-28 px-6 bg-luxury-black text-center border-y border-gold/8">
        <div className="max-w-3xl mx-auto reveal-scale">
          <blockquote
            className="font-display italic text-3xl md:text-5xl text-cream/80 leading-tight mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            "Le parfum est l'ombre de l'âme,<br />une promesse silencieuse de beauté."
          </blockquote>
          <div className="eyebrow justify-center text-gold/50">Maison Les 2 As</div>
        </div>
      </section>

      {/* ── Bestsellers ──────────────────────────── */}
      {bestsellers && bestsellers.length > 0 && (
        <section className="py-28 px-6 bg-luxury-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16 gap-8 reveal">
              <div>
                <div className="eyebrow mb-4">Sélection</div>
                <h2 className="font-serif text-4xl md:text-5xl text-cream">
                  Nos <em className="not-italic text-gold italic">Bestsellers</em>
                </h2>
              </div>
              <Link href="/catalogue" className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold/60 hover:text-gold transition-colors shrink-0">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestsellers.map((p, i) => (
                <Link
                  href={`/parfum/${p.id}`}
                  key={p.id}
                  className="reveal group block bg-luxury-charcoal overflow-hidden hover:shadow-[0_8px_32px_0_rgba(201,169,97,0.08)] transition-all duration-500 hover:-translate-y-1"
                  data-reveal-delay={String(i * 80)}
                >
                  <div className="aspect-[3/4] bg-[#F7F5F0] overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-4xl text-luxury-black/10">№</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-sm text-cream group-hover:text-gold transition-colors leading-snug mb-0.5">{p.name}</h3>
                    <p className="text-cream/30 text-[10px] tracking-wide">{p.brand || "Les 2 As"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────── */}
      <footer className="bg-luxury-charcoal border-t border-gold/10 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="font-serif text-cream text-lg mb-6 tracking-tight">Les 2 As</h3>
              <p className="text-cream/35 text-sm leading-relaxed">Maison de parfumerie fine à Paris. L'excellence olfactive depuis 2026.</p>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-6">Boutique</h4>
              <ul className="space-y-3">
                {["Catalogue", "Nouveautés", "Bestsellers", "Coffrets"].map(l => (
                  <li key={l}><Link href="/catalogue" className="text-cream/40 hover:text-cream text-sm transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-6">Contact</h4>
              <ul className="space-y-3 text-sm text-cream/40">{/* email à venir */}</ul>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-6">Newsletter</h4>
              <p className="text-cream/35 text-xs mb-4 leading-relaxed">Recevez nos nouvelles parutions et offres exclusives.</p>
              <div className="flex">
                <input type="email" placeholder="votre@email.fr" className="flex-1 bg-luxury-black border border-gold/15 text-cream text-xs px-4 py-2.5 focus:outline-none focus:border-gold/40 placeholder-cream/20 min-w-0" />
                <button className="bg-gold text-luxury-black text-[9px] tracking-widest uppercase px-4 py-2.5 hover:bg-gold-light transition-colors shrink-0">OK</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gold/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-cream/20 text-[10px] tracking-widest uppercase">© {new Date().getFullYear()} Parfumerie Les 2 As. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
              <a href="#" aria-label="Instagram" className="text-cream/30 hover:text-gold transition-colors"><InstagramIcon className="w-4 h-4" /></a>
              <a href="#" aria-label="Facebook" className="text-cream/30 hover:text-gold transition-colors"><FacebookIcon className="w-4 h-4" /></a>
            </div>
            <Link href="/admin/login" className="text-cream/10 hover:text-gold/40 text-[9px] uppercase tracking-[0.4em] transition-colors">Espace Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
