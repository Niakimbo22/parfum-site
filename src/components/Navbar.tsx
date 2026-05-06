import Link from 'next/link'
import { ShoppingBag, User } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="border-b border-gold/20 bg-luxury-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-serif text-2xl gold-text font-bold tracking-widest">
              LES 2 AS
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/catalogue" className="text-gray-300 hover:text-gold px-3 py-2 text-sm font-medium tracking-widest uppercase transition-colors">
                Catalogue
              </Link>
              <Link href="/a-propos" className="text-gray-300 hover:text-gold px-3 py-2 text-sm font-medium tracking-widest uppercase transition-colors">
                La Maison
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-gold px-3 py-2 text-sm font-medium tracking-widest uppercase transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-300 hover:text-gold transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
