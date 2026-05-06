import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-luxury-black/70 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h2 className="text-gold uppercase tracking-[0.3em] text-sm mb-4 font-medium animate-fade-in">
            L'Essence du Raffinement
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 text-white leading-tight">
            Parfumerie <span className="gold-text italic">Les 2 As</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Une sélection prestigieuse de fragrances rares. Laissez-vous envoûter par des notes d'exception créées pour marquer les esprits.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/catalogue" 
              className="gold-button flex items-center justify-center gap-2 group"
            >
              Explorer la Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/a-propos" 
              className="border border-white/20 hover:border-gold/50 text-white px-8 py-3 rounded-sm transition-all hover:bg-white/5"
            >
              Notre Histoire
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/50">
          <span className="text-[10px] uppercase tracking-widest">Découvrir</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent"></div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4 bg-luxury-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-gold uppercase tracking-widest text-sm mb-4">Univers</h2>
              <h3 className="text-4xl font-serif text-white">Collections Signature</h3>
            </div>
            <Link href="/catalogue" className="text-gold border-b border-gold/30 pb-1 hover:border-gold transition-all text-sm uppercase tracking-widest">
              Voir tout le catalogue
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Pour Lui", desc: "Puissance & Élégance", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80" },
              { title: "Pour Elle", desc: "Grâce & Mystère", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80" },
              { title: "Unisexe", desc: "Audace & Harmonie", img: "https://images.unsplash.com/photo-1583467875263-d50dee373707?auto=format&fit=crop&q=80" }
            ].map((cat, i) => (
              <div key={i} className="group relative h-[500px] overflow-hidden rounded-sm cursor-pointer">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.img})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h4 className="text-2xl font-serif text-white mb-2">{cat.title}</h4>
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-6">{cat.desc}</p>
                  <div className="w-10 h-px bg-gold group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-luxury-black border-t border-gold/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-2xl gold-text font-bold tracking-widest mb-6">LES 2 AS</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
            L'excellence de la parfumerie fine. Une expérience olfactive inégalée, conçue pour les connaisseurs.
          </p>
          <div className="flex justify-center space-x-6 mb-8 text-gray-400">
            <span className="hover:text-gold cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-gold cursor-pointer transition-colors">TikTok</span>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">
              © {new Date().getFullYear()} Parfumerie Les 2 As. Tous droits réservés.
            </p>
            <Link 
              href="/admin/login" 
              className="text-gray-800 hover:text-gold transition-colors mt-2 text-[8px] uppercase tracking-[0.4em] opacity-50 hover:opacity-100"
            >
              ADMINISTRATEUR ?
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
