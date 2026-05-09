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
              L'excellence au service de vos sens depuis 2026
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-28 px-6 md:px-8 bg-luxury-black">
          <div className="max-w-3xl mx-auto">
            <div className="eyebrow justify-center mb-8">Notre Histoire</div>
            <div className="space-y-6 text-cream/60 leading-relaxed text-lg">
              <p>
                Tout a commencé par une obsession partagée : trouver les parfums qui font vraiment la différence.{" "}
                <strong className="text-cream font-normal">Les 2 As</strong>, c'est deux passionnés qui ont
                transformé des années de recherche olfactive en une sélection que vous pouvez enfin explorer
                sans vous perdre.
              </p>
              <p>
                Nous ne créons pas de parfums. Nous les trouvons. Nous les testons, les portons, les vivons —
                et nous ne gardons que ceux qui nous ont convaincus. Dior, Creed, Chanel, MFK : chaque marque
                dans notre catalogue y est pour une raison précise, pas pour faire du volume.
              </p>
              <p>
                Chez Les 2 As, un parfum n'est jamais un simple produit. C'est un choix que vous faites sur
                vous-même — une présence silencieuse, une mémoire que vous laissez derrière vous.
                Notre rôle est de vous aider à trouver le vôtre.
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
                  title: "L'Œil du Connaisseur",
                  desc: "Nous parcourons les maisons de parfumerie les plus prestigieuses pour ne retenir que ce qui mérite vraiment votre attention. Chaque flacon dans notre sélection a passé notre exigence — aucun autre.",
                },
                {
                  Icon: ShieldCheck,
                  title: "Confiance Absolue",
                  desc: "Nos parfums proviennent directement des distributeurs officiels. Pas d'intermédiaire douteux, pas de contrefaçon — ce que vous recevez est exactement ce que vous croyez recevoir.",
                },
                {
                  Icon: Zap,
                  title: "Le Bon Parfum, Pour Vous",
                  desc: "Nous ne vendons pas tout. Nous choisissons. Notre catalogue est volontairement resserré pour que chaque fragrance ait sa raison d'être — et la vôtre.",
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
              <ul className="space-y-3 text-sm text-cream/40">
                {/* email à venir */}
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
