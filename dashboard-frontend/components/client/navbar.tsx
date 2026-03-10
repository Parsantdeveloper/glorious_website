
import {ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import NavbarProfile from './navbar-profile';
import NavbarSearch from './NavbarSearch';

export default function Navbar() {

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-muted shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="flex items-center gap-2">
             
              <span className="font-bold text-xl text-primary hidden sm:inline">Glorious</span>
            </div>
          </Link>

          {/* Search Bar */}
       
           <NavbarSearch></NavbarSearch>
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* PC Builder Button */}
            {/* <Link
              href="/pc-builder"
              className="hidden md:flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Zap className="w-5 h-5" />
              <span>PC Builder</span>
            </Link> */}

            {/* Cart Button */}
          

           <NavbarProfile></NavbarProfile>
          </div>
        </div>
      </div>
    </nav>
  );
}
