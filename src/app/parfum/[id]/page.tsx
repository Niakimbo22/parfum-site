import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase-server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ParfumDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: parfum, error } = await supabase
    .from("perfumes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !parfum) notFound();

  const topNotes: string[] = Array.isArray(parfum.top_notes)
    ? parfum.top_notes
    : typeof parfum.top_notes === "string"
    ? JSON.parse(parfum.top_notes)
    : [];

  const heartNotes: string[] = Array.isArray(parfum.heart_notes)
    ? parfum.heart_notes
    : typeof parfum.heart_notes === "string"
    ? JSON.parse(parfum.heart_notes)
    : [];

  const baseNotes: string[] = Array.isArray(parfum.base_notes)
    ? parfum.base_notes
    : typeof parfum.base_notes === "string"
    ? JSON.parse(parfum.base_notes)
    : [];

  const seasons: string[] = Array.isArray(parfum.season)
    ? parfum.season
    : typeof parfum.season === "string"
    ? JSON.parse(parfum.season)
    : [];

  const occasions: string[] = Array.isArray(parfum.occasion)
    ? parfum.occasion
    : typeof parfum.occasion === "string"
    ? JSON.parse(parfum.occasion)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-luxury-black">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] rounded-full bg-gold/3 blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-gold/2 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">

          {/* Back */}
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-cream/30 hover:text-gold text-[10px] tracking-[0.3em] uppercase transition-colors mb-16 group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Catalogue
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Image */}
            <div className="relative flex justify-center order-first lg:order-last">
              <div className="relative w-[300px] md:w-[400px] h-[420px] md:h-[560px]">
                <div className="absolute inset-0 bg-gold/6 blur-[80px] rounded-full scale-75" />
                <div
                  className="relative w-full h-full"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                  }}
                >
                  <img
                    src={parfum.image_url || "/images/parfums/baccarat.png"}
                    alt={parfum.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                {/* Decorative */}
                <span className="absolute top-4 right-0 font-serif text-[100px] leading-none text-gold/4 pointer-events-none select-none">
                  №
                </span>
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-8">

              {/* Eyebrow */}
              <div className="flex items-center gap-4">
                <span className="eyebrow">{parfum.brand || "Les 2 As"}</span>
                {parfum.gender && parfum.gender !== "Mixte" && (
                  <span className="text-[9px] tracking-[0.3em] uppercase text-cream/30 border border-cream/10 px-3 py-1">
                    {parfum.gender}
                  </span>
                )}
                {parfum.gender === "Mixte" && (
                  <span className="text-[9px] tracking-[0.3em] uppercase text-cream/30 border border-cream/10 px-3 py-1">
                    Unisexe
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream leading-none tracking-tight">
                {parfum.name}
              </h1>

              {/* Family */}
              {parfum.olfactory_family && (
                <p className="text-gold/60 text-xs tracking-[0.3em] uppercase">
                  {parfum.olfactory_family}
                </p>
              )}

              {/* Divider */}
              <div className="w-12 h-px bg-gold/30" />

              {/* Description */}
              {parfum.description && (
                <p className="text-cream/55 text-base leading-relaxed max-w-md font-light">
                  {parfum.description}
                </p>
              )}

              {/* Price + CTA */}
              <div className="flex items-center gap-6 pt-2">
                {parfum.price > 0 && (
                  <span className="font-serif text-4xl text-cream font-oldstyle">
                    {parfum.price}
                    <span className="text-lg text-cream/40 ml-1">€</span>
                  </span>
                )}
                <Link
                  href="/commande"
                  className="gold-button inline-flex items-center gap-3 group"
                >
                  Commander
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Pyramide olfactive ── */}
      {(topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0) && (
        <section className="py-28 px-6 border-t border-gold/8">
          <div className="max-w-5xl mx-auto">

            <div className="mb-16">
              <div className="eyebrow mb-4">Composition</div>
              <h2 className="font-serif text-4xl md:text-5xl text-cream tracking-tight">
                Pyramide <em className="not-italic text-gold italic">Olfactive</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">

              {topNotes.length > 0 && (
                <div className="bg-luxury-charcoal p-8 border-t-2 border-gold/40 group hover:border-gold transition-colors duration-500">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-6 group-hover:text-gold/80 transition-colors">
                    Notes de Tête
                  </p>
                  <ul className="space-y-2.5">
                    {topNotes.map((n) => (
                      <li key={n} className="text-cream/70 text-sm font-light flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {heartNotes.length > 0 && (
                <div className="bg-luxury-charcoal p-8 border-t-2 border-gold/60 group hover:border-gold transition-colors duration-500 md:mt-6">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-6 group-hover:text-gold/80 transition-colors">
                    Notes de Cœur
                  </p>
                  <ul className="space-y-2.5">
                    {heartNotes.map((n) => (
                      <li key={n} className="text-cream/80 text-sm font-light flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gold/60 shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {baseNotes.length > 0 && (
                <div className="bg-luxury-charcoal p-8 border-t-2 border-gold/80 group hover:border-gold transition-colors duration-500 md:mt-12">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gold/70 mb-6 group-hover:text-gold/90 transition-colors">
                    Notes de Fond
                  </p>
                  <ul className="space-y-2.5">
                    {baseNotes.map((n) => (
                      <li key={n} className="text-cream text-sm font-light flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ── Infos ── */}
      {(seasons.length > 0 || occasions.length > 0) && (
        <section className="py-20 px-6 border-t border-gold/8 bg-luxury-charcoal">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12">

            {seasons.length > 0 && (
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-5">Saisons</p>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] tracking-[0.2em] uppercase text-cream/60 border border-gold/15 px-4 py-2"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {occasions.length > 0 && (
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-5">Occasions</p>
                <div className="flex flex-wrap gap-2">
                  {occasions.map((o) => (
                    <span
                      key={o}
                      className="text-[10px] tracking-[0.2em] uppercase text-cream/60 border border-gold/15 px-4 py-2"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ── Quote / CTA ── */}
      <section className="py-24 px-6 border-t border-gold/8 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-cream/25 text-xs tracking-[0.3em] uppercase mb-8">Intéressé par ce parfum ?</p>
          <Link href="/commande" className="gold-button inline-flex items-center gap-3 group">
            Passer commande
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="mt-10">
            <Link
              href="/catalogue"
              className="text-cream/30 hover:text-cream text-[10px] tracking-[0.3em] uppercase transition-colors"
            >
              ← Retour au catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-charcoal border-t border-gold/10 pt-20 pb-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="font-serif text-cream text-lg mb-6 tracking-tight">Les 2 As</h3>
              <p className="text-cream/35 text-sm leading-relaxed">
                Maison de parfumerie fine à Paris. L'excellence olfactive depuis 2010.
              </p>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-6">Boutique</h4>
              <ul className="space-y-3">
                {["Catalogue", "Nouveautés", "Bestsellers", "Coffrets"].map((l) => (
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
