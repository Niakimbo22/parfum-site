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

  const hasNotes = topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-luxury-black">
      <Navbar />

      {/* ── HERO: split full-screen ── */}
      <section className="relative flex flex-col lg:flex-row min-h-[calc(100vh-96px)] overflow-hidden">

        {/* ── LEFT: editorial text ── */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-14 xl:px-20 py-20 w-full lg:w-[48%] order-2 lg:order-1">

          {/* Vertical gold accent line */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />

          {/* Back */}
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-cream/30 hover:text-gold text-[9px] tracking-[0.35em] uppercase transition-colors mb-14 group w-fit"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Catalogue
          </Link>

          {/* Brand + Gender */}
          <div className="flex items-center gap-4 mb-5 animate-fade-up animate-delay-100">
            <div className="eyebrow">{parfum.brand || "Les 2 As"}</div>
            {parfum.gender && (
              <span className="text-[9px] tracking-[0.25em] uppercase text-cream/30 border border-cream/10 px-3 py-1">
                {parfum.gender === "Mixte" ? "Unisexe" : parfum.gender}
              </span>
            )}
          </div>

          {/* Name */}
          <h1
            className="font-serif text-5xl md:text-6xl xl:text-[5.5rem] text-cream leading-[0.92] tracking-tight mb-5 animate-fade-up animate-delay-200"
            style={{ viewTransitionName: `perfume-name-${parfum.id}` }}
          >
            {parfum.name}
          </h1>

          {/* Olfactory family */}
          {parfum.olfactory_family && (
            <p className="text-gold/60 text-[10px] tracking-[0.35em] uppercase mb-7 animate-fade-up animate-delay-300">
              {parfum.olfactory_family}
            </p>
          )}

          {/* Animated divider */}
          <div className="w-10 h-px bg-gold mb-7 animate-draw-line animate-delay-300" />

          {/* Description */}
          {parfum.description && (
            <p className="text-cream/55 text-[15px] leading-[1.8] max-w-[380px] font-light mb-8 animate-fade-up animate-delay-400">
              {parfum.description}
            </p>
          )}

          {/* Top notes preview */}
          {topNotes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 animate-fade-up animate-delay-400">
              {topNotes.slice(0, 5).map((n) => (
                <span
                  key={n}
                  className="text-[9px] tracking-widest uppercase text-gold/50 border border-gold/15 px-3 py-1.5 hover:border-gold/40 hover:text-gold/80 transition-colors"
                >
                  {n}
                </span>
              ))}
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-center gap-8 animate-fade-up animate-delay-500">
            {parfum.price > 0 && (
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-cream/25 mb-1">Prix</p>
                <span className="font-serif text-4xl text-cream font-oldstyle leading-none">
                  {parfum.price}
                  <span className="text-xl text-gold/60 ml-1.5">€</span>
                </span>
              </div>
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

        {/* ── RIGHT: full image panel ── */}
        <div className="relative w-full lg:w-[52%] min-h-[55vw] lg:min-h-0 overflow-hidden order-1 lg:order-2">

          {/* Left-to-right gradient (only on desktop, connects left panel) */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-luxury-black to-transparent z-20 hidden lg:block pointer-events-none" />

          {/* Ambient glow behind bottle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[60%] h-[60%] rounded-full bg-gold/10 blur-[90px] animate-pulse-glow" />
          </div>

          {/* Decorative huge number */}
          <span className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 font-serif text-[120px] md:text-[180px] leading-none text-gold/5 select-none pointer-events-none z-10">
            №
          </span>

          {/* Bestseller badge */}
          {parfum.is_bestseller && (
            <div className="absolute top-8 right-8 z-30 flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[7px] tracking-[0.3em] uppercase text-gold leading-tight">Best</p>
                  <p className="text-[7px] tracking-[0.3em] uppercase text-gold leading-tight">Seller</p>
                </div>
              </div>
            </div>
          )}

          {/* Image */}
          <div
            className="absolute inset-0 flex items-center justify-center p-12 lg:p-16 z-10"
            style={{ viewTransitionName: `perfume-img-${parfum.id}` }}
          >
            {parfum.image_url ? (
              <img
                src={parfum.image_url}
                alt={parfum.name}
                className="perfume-img max-w-full max-h-full object-contain animate-float drop-shadow-2xl"
              />
            ) : (
              <span className="font-serif text-[160px] leading-none text-gold/8 select-none">№</span>
            )}
          </div>
        </div>
      </section>

      {/* ── PYRAMIDE OLFACTIVE ── */}
      {hasNotes && (
        <section className="py-28 px-6 border-t border-gold/8 bg-luxury-charcoal">
          <div className="max-w-5xl mx-auto">

            <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal">
              <div>
                <div className="eyebrow mb-4">Composition</div>
                <h2 className="font-serif text-4xl md:text-5xl text-cream tracking-tight">
                  Pyramide <em className="not-italic text-gold italic">Olfactive</em>
                </h2>
              </div>
              <p className="text-cream/25 text-xs tracking-widest uppercase mt-4 md:mt-0">
                {[topNotes, heartNotes, baseNotes].flat().length} matières
              </p>
            </div>

            {/* Pyramid — staggered heights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/5 overflow-hidden rounded-sm">

              {topNotes.length > 0 && (
                <div className="reveal bg-luxury-black p-8 md:p-10 group hover:bg-luxury-charcoal transition-colors duration-500" data-reveal-delay="0">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-5 h-5 rounded-full border border-gold/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                    </div>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 group-hover:text-gold/80 transition-colors">
                      Notes de Tête
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {topNotes.map((n) => (
                      <li key={n} className="text-cream/60 text-sm font-light flex items-baseline gap-3">
                        <span className="text-gold/20 text-[8px] shrink-0">◆</span>
                        {n}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 text-[9px] tracking-widest text-cream/15 uppercase">Volatiles</div>
                </div>
              )}

              {heartNotes.length > 0 && (
                <div className="reveal bg-luxury-black p-8 md:p-10 md:pt-14 group hover:bg-luxury-charcoal transition-colors duration-500 border-y md:border-y-0 md:border-x border-gold/5" data-reveal-delay="120">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-5 h-5 rounded-full border border-gold/50 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                    </div>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-gold/60 group-hover:text-gold transition-colors">
                      Notes de Cœur
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {heartNotes.map((n) => (
                      <li key={n} className="text-cream/75 text-sm font-light flex items-baseline gap-3">
                        <span className="text-gold/40 text-[8px] shrink-0">◆</span>
                        {n}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 text-[9px] tracking-widest text-cream/15 uppercase">Signature</div>
                </div>
              )}

              {baseNotes.length > 0 && (
                <div className="reveal bg-luxury-black p-8 md:p-10 md:pt-20 group hover:bg-luxury-charcoal transition-colors duration-500" data-reveal-delay="240">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-5 h-5 rounded-full border border-gold flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                    </div>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-gold/80 group-hover:text-gold transition-colors">
                      Notes de Fond
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {baseNotes.map((n) => (
                      <li key={n} className="text-cream text-sm font-light flex items-baseline gap-3">
                        <span className="text-gold text-[8px] shrink-0">◆</span>
                        {n}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 text-[9px] tracking-widest text-cream/15 uppercase">Sillage</div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ── SAISONS & OCCASIONS ── */}
      {(seasons.length > 0 || occasions.length > 0) && (
        <section className="py-20 px-6 border-t border-gold/8 bg-luxury-black">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 reveal">

            {seasons.length > 0 && (
              <div>
                <p className="text-[9px] tracking-[0.45em] uppercase text-gold/50 mb-6">Saisons idéales</p>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] tracking-[0.2em] uppercase text-cream/60 border border-gold/15 px-4 py-2 hover:border-gold/40 hover:text-cream transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {occasions.length > 0 && (
              <div>
                <p className="text-[9px] tracking-[0.45em] uppercase text-gold/50 mb-6">Occasions</p>
                <div className="flex flex-wrap gap-2">
                  {occasions.map((o) => (
                    <span
                      key={o}
                      className="text-[10px] tracking-[0.2em] uppercase text-cream/60 border border-gold/15 px-4 py-2 hover:border-gold/40 hover:text-cream transition-colors"
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

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-6 border-t border-gold/8 bg-luxury-charcoal text-center reveal-scale">
        <div className="max-w-xl mx-auto">
          <div className="eyebrow justify-center mb-6">Votre prochaine fragrance</div>
          <h3 className="font-serif text-3xl md:text-4xl text-cream mb-10 leading-snug">
            Prêt à porter<br />
            <em className="text-gold italic">{parfum.name} ?</em>
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/commande" className="gold-button inline-flex items-center gap-3 group">
              Passer commande
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-cream/40 hover:text-cream border border-cream/10 hover:border-cream/30 px-8 py-3 transition-all duration-300"
            >
              Explorer le catalogue
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
                Maison de parfumerie fine. L'excellence olfactive depuis 2026.
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
