import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Award, ShieldCheck, Zap } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-luxury-black">
      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-luxury-charcoal px-6 pb-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/4 blur-[100px] rounded-full"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="eyebrow mb-6">Maison</div>
            <h1 className="font-serif text-6xl md:text-8xl text-cream tracking-tight leading-none mb-4">
              L'Héritage<br />
              <em className="not-italic text-gold italic">Les 2 As</em>
            </h1>
            <p className="text-[10px] tracking-[0.4em] uppercase text-gold/50">
              L'excellence au service de vos sens depuis 2010
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-28 px-6 md:px-8 bg-luxury-black">
          <div className="max-w-3xl mx-auto">
            <div className="eyebrow justify-center mb-8">Notre Histoire</div>
            <div className="space-y-6 text-cream/60 leading-relaxed text-lg">
              <p>
                Née d'une passion commune pour les fragrances d'exception, la Maison{" "}
                <strong className="text-cream font-normal">Les 2 As</strong> a vu le jour au cœur de Paris.
                Notre ambition était simple mais audacieuse : démocratiser l'accès à la haute parfumerie
                tout en préservant son aura de luxe et d'exclusivité.
              </p>
              <p>
                Chaque parfum de notre collection est sélectionné avec une rigueur absolue. Nous collaborons
                avec les plus grands nez et les maisons de composition les plus prestigieuses pour vous offrir
                des sillages uniques, capables de sublimer votre personnalité.
              </p>
              <p>
                Chez Les 2 As, nous croyons que le parfum est bien plus qu'une simple senteur — c'est un
                accessoire invisible, une signature émotionnelle qui raconte votre histoire sans prononcer
                un seul mot.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 px-6 md:px-8 bg-luxury-charcoal border-y border-gold/10">
          <div className="max-w-7xl mx-auto">
            <div className="eyebrow justify-center mb-16">Nos Valeurs</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                {
                  Icon: Award,
                  title: "Qualité Suprême",
                  desc: "Nous ne sélectionnons que les ingrédients les plus nobles et les compositions les plus raffinées pour garantir une tenue et une projection exceptionnelles.",
                },
                {
                  Icon: ShieldCheck,
                  title: "Authenticité",
                  desc: "L'authenticité est au cœur de notre démarche. Chaque produit est certifié et provient directement des sources de production les plus respectées.",
                },
                {
                  Icon: Zap,
                  title: "Innovation",
                  desc: "Tout en respectant les traditions séculaires, nous explorons sans cesse de nouveaux territoires olfactifs pour vous surprendre et vous émerveiller.",
                },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="group text-center space-y-6">
                  <div className="w-14 h-14 border border-gold/20 flex items-center justify-center mx-auto group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-300">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl text-cream tracking-wide">{title}</h3>
                  <p className="text-cream/40 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="py-32 px-6 text-center bg-luxury-black">
          <div className="max-w-3xl mx-auto">
            <blockquote
              className="italic text-3xl md:text-5xl text-cream/80 leading-tight mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              "Le parfum est l'ombre de l'âme, une promesse silencieuse de beauté et d'élégance."
            </blockquote>
            <div className="eyebrow justify-center text-gold/50">Les 2 As</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-luxury-charcoal border-t border-gold/10 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="font-serif text-cream text-lg mb-6 tracking-tight">Les 2 As</h3>
              <p className="text-cream/35 text-sm leading-relaxed">Maison de parfumerie fine à Paris. L'excellence olfactive depuis 2010.</p>
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
              <ul className="space-y-3 text-sm text-cream/40">
                <li>123 Avenue des Champs-Élysées</li>
                <li>75008 Paris, France</li>
                <li><a href="mailto:contact@les2as.fr" className="hover:text-cream transition-colors">contact@les2as.fr</a></li>
              </ul>
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
            <p className="text-cream/20 text-[10px] tracking-widest uppercase">© {new Date().getFullYear()} Parfumerie Les 2 As.</p>
            <div className="flex items-center gap-6">
              <a href="#" aria-label="Instagram" className="text-cream/30 hover:text-gold transition-colors"><InstagramIcon className="w-4 h-4" /></a>
              <a href="#" aria-label="Facebook" className="text-cream/30 hover:text-gold transition-colors"><FacebookIcon className="w-4 h-4" /></a>
            </div>
            <Link href="/admin/login" className="text-cream/10 hover:text-gold/40 text-[9px] uppercase tracking-[0.4em] transition-colors">Espace Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
