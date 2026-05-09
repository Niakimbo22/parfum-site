import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Mail, MapPin, Send } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-luxury-black">
      <Navbar />

      <main className="flex-1 py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <header className="mb-20">
            <div className="eyebrow mb-5">Contact</div>
            <h1 className="font-serif text-5xl md:text-7xl text-cream tracking-tight leading-none mb-6">
              Parlons<br />
              <em className="not-italic text-gold italic">Ensemble</em>
            </h1>
            <p className="text-cream/40 max-w-md text-sm leading-relaxed">
              Notre équipe d'experts est à votre disposition pour vous accompagner dans votre voyage olfactif.
            </p>
            <div className="mt-10 w-full h-px bg-gold/10"></div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div className="bg-luxury-charcoal border border-gold/8 p-10">
              <h2 className="font-serif text-2xl text-cream mb-10">Envoyez-nous un message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-[0.4em] text-gold/60">Nom Complet</label>
                    <input
                      type="text"
                      placeholder="Jean Dupont"
                      className="w-full bg-luxury-black border border-gold/10 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold/40 placeholder-cream/20 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-[0.4em] text-gold/60">Email</label>
                    <input
                      type="email"
                      placeholder="jean@exemple.com"
                      className="w-full bg-luxury-black border border-gold/10 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold/40 placeholder-cream/20 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] uppercase tracking-[0.4em] text-gold/60">Sujet</label>
                  <input
                    type="text"
                    placeholder="Conseil personnalisé, commande, etc."
                    className="w-full bg-luxury-black border border-gold/10 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold/40 placeholder-cream/20 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] uppercase tracking-[0.4em] text-gold/60">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full bg-luxury-black border border-gold/10 text-cream text-sm px-4 py-3 focus:outline-none focus:border-gold/40 placeholder-cream/20 transition-colors resize-none"
                  ></textarea>
                </div>
                <button type="button" className="gold-button w-full flex items-center justify-center gap-2 py-4">
                  <Send className="w-3.5 h-3.5" />
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-luxury-charcoal border border-gold/8 p-10">
                <h2 className="font-serif text-2xl text-cream mb-10">Informations</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 border border-gold/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-cream text-sm font-medium mb-1.5">Notre Maison</h3>
                      <p className="text-cream/40 text-sm leading-relaxed">
                        123 Avenue des Champs-Élysées<br />
                        75008 Paris, France
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 border border-gold/20 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-cream text-sm font-medium mb-1.5">Email</h3>
                      <a href="mailto:contact@les2as.fr" className="text-cream/40 text-sm hover:text-gold transition-colors">
                        contact@les2as.fr
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-luxury-charcoal border border-gold/8 p-10">
                <h2 className="font-serif text-xl text-cream mb-8">Horaires</h2>
                <div className="space-y-3 text-sm">
                  {[
                    { day: "Lundi — Vendredi", hours: "10h00 – 19h00" },
                    { day: "Samedi", hours: "11h00 – 18h00" },
                    { day: "Dimanche", hours: "Fermé", closed: true },
                  ].map(({ day, hours, closed }) => (
                    <div key={day} className="flex justify-between items-center py-3 border-b border-gold/6 last:border-0">
                      <span className="text-[10px] uppercase tracking-widest text-cream/30">{day}</span>
                      <span className={closed ? "text-gold/50 italic text-sm" : "text-cream text-sm"}>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-luxury-charcoal border-t border-gold/10 pt-20 pb-10 px-6 mt-16">
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
