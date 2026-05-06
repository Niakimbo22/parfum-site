import Navbar from "@/components/Navbar";
import { Award, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547633045-303e6963212f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-luxury-black/70 backdrop-blur-[2px]"></div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">L'Héritage Les 2 As</h1>
            <p className="text-gold uppercase tracking-[0.4em] text-sm md:text-base">L'excellence au service de vos sens depuis 2010</p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-4 md:px-8 bg-luxury-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-white mb-8">Notre Histoire</h2>
            <div className="w-16 h-px bg-gold mx-auto mb-10"></div>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                Née d'une passion commune pour les fragrances d'exception, la Maison <strong>Les 2 As</strong> a vu le jour au cœur de Paris. 
                Notre ambition était simple mais audacieuse : démocratiser l'accès à la haute parfumerie tout en préservant son aura de luxe et d'exclusivité.
              </p>
              <p>
                Chaque parfum de notre collection est sélectionné avec une rigueur absolue. Nous collaborons avec les plus grands nez 
                et les maisons de composition les plus prestigieuses pour vous offrir des sillages uniques, capables de sublimer 
                votre personnalité et de marquer les esprits.
              </p>
              <p>
                Chez Les 2 As, nous croyons que le parfum est bien plus qu'une simple senteur ; c'est un accessoire invisible, 
                une signature émotionnelle qui raconte votre histoire sans prononcer un seul mot.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-4 md:px-8 bg-luxury-slate/10 border-y border-gold/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-serif text-white uppercase tracking-widest">Qualité Suprême</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Nous ne sélectionnons que les ingrédients les plus nobles et les compositions les plus raffinées pour garantir une tenue et une projection exceptionnelles.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-serif text-white uppercase tracking-widest">Authenticité</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  L'authenticité est au cœur de notre démarche. Chaque produit est certifié et provient directement des sources de production les plus respectées.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-serif text-white uppercase tracking-widest">Innovation</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tout en respectant les traditions séculaires, nous explorons sans cesse de nouveaux territoires olfactifs pour vous surprendre et vous émerveiller.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-32 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-3xl md:text-4xl font-serif text-white italic leading-tight">
              "Le parfum est l'ombre de l'âme, une promesse silencieuse de beauté et d'élégance."
            </blockquote>
            <div className="mt-8 text-gold uppercase tracking-[0.3em] text-sm">— Les 2 As</div>
          </div>
        </section>
      </main>

      <footer className="bg-luxury-black border-t border-gold/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-2xl gold-text font-bold tracking-widest mb-6 uppercase">Les 2 As</h2>
          <p className="text-gray-600 text-xs tracking-widest">
            © {new Date().getFullYear()} Parfumerie Les 2 As. L'excellence est notre héritage.
          </p>
        </div>
      </footer>
    </div>
  );
}
