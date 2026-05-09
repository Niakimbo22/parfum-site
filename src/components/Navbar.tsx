import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
  return (
    <nav className="border-b border-gold/10 bg-luxury-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="font-serif text-xl tracking-[0.25em] text-cream uppercase">LES</span>
              <span className="text-gold text-2xl font-light mx-1">·</span>
              <span className="font-serif text-xl tracking-[0.25em] text-cream uppercase">2</span>
              <span className="text-gold text-2xl font-light mx-1">·</span>
              <span className="font-serif text-xl tracking-[0.25em] text-cream uppercase">AS</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/catalogue" className="nav-link text-cream/60 hover:text-cream text-[10px] font-medium tracking-[0.3em] uppercase transition-colors duration-300 pb-1">
              Catalogue
            </Link>
            <Link href="/catalogue?gender=Homme" className="nav-link text-cream/60 hover:text-cream text-[10px] font-medium tracking-[0.3em] uppercase transition-colors duration-300 pb-1">
              Homme
            </Link>
            <Link href="/catalogue?gender=Femme" className="nav-link text-cream/60 hover:text-cream text-[10px] font-medium tracking-[0.3em] uppercase transition-colors duration-300 pb-1">
              Femme
            </Link>
            <Link href="/a-propos" className="nav-link text-cream/60 hover:text-cream text-[10px] font-medium tracking-[0.3em] uppercase transition-colors duration-300 pb-1">
              À propos
            </Link>
            <Link href="/contact" className="nav-link text-cream/60 hover:text-cream text-[10px] font-medium tracking-[0.3em] uppercase transition-colors duration-300 pb-1">
              Contact
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/commande" className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-cream/60 hover:text-gold transition-colors duration-300">
              Commander
            </Link>
            <Link href="/commande" className="relative text-cream/60 hover:text-gold transition-colors duration-300 group">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}
