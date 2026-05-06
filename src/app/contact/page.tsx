import Navbar from "@/components/Navbar";
import { Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Contactez-Nous</h1>
            <div className="w-24 h-px bg-gold mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Notre équipe d'experts est à votre disposition pour vous accompagner dans votre voyage olfactif. 
              Une question, un conseil personnalisé ou une demande spécifique ? Nous sommes à votre écoute.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm">
              <h2 className="text-2xl font-serif text-white mb-8">Envoyez-nous un message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Nom Complet</label>
                    <input 
                      type="text" 
                      placeholder="Jean Dupont"
                      className="w-full bg-luxury-slate/20 border border-gold/10 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Email</label>
                    <input 
                      type="email" 
                      placeholder="jean@exemple.com"
                      className="w-full bg-luxury-slate/20 border border-gold/10 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Sujet</label>
                  <input 
                    type="text" 
                    placeholder="Conseil personnalisé, commande, etc."
                    className="w-full bg-luxury-slate/20 border border-gold/10 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full bg-luxury-slate/20 border border-gold/10 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  ></textarea>
                </div>
                <button type="button" className="gold-button w-full flex items-center justify-center gap-2 py-4">
                  <Send className="w-4 h-4" />
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm">
                <h2 className="text-2xl font-serif text-white mb-8">Informations</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gold/10 rounded-full">
                      <MapPin className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Notre Maison</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        123 Avenue des Champs-Élysées<br />
                        75008 Paris, France
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gold/10 rounded-full">
                      <Mail className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Email</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        contact@les2as.fr
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm">
                <h2 className="text-2xl font-serif text-white mb-6">Horaires d'ouverture</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gold/5 pb-2">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">Lundi - Vendredi</span>
                    <span className="text-white">10h00 - 19h00</span>
                  </div>
                  <div className="flex justify-between border-b border-gold/5 pb-2">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">Samedi</span>
                    <span className="text-white">11h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">Dimanche</span>
                    <span className="text-gold italic">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-luxury-black border-t border-gold/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-2xl gold-text font-bold tracking-widest mb-6 uppercase">Les 2 As</h2>
          <p className="text-gray-600 text-xs tracking-widest">
            © {new Date().getFullYear()} Parfumerie Les 2 As. Votre élégance est notre passion.
          </p>
        </div>
      </footer>
    </div>
  );
}
