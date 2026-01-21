'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, LogIn, Zap } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

const DUMMY_PRODUCTS: Product[] = [
  { id: 1, name: 'iPhone 15 Pro', category: 'Smartphones', price: 999, image: '📱' },
  { id: 2, name: 'MacBook Pro 16"', category: 'Laptops', price: 2499, image: '💻' },
  { id: 3, name: 'AirPods Pro', category: 'Audio', price: 249, image: '🎧' },
  { id: 4, name: 'iPad Air', category: 'Tablets', price: 599, image: '📱' },
  { id: 5, name: 'Apple Watch Ultra', category: 'Wearables', price: 799, image: '⌚' },
  { id: 6, name: 'Sony 65" 4K TV', category: 'TVs', price: 1799, image: '📺' },
  { id: 7, name: 'GoPro Hero 12', category: 'Cameras', price: 499, image: '📷' },
  { id: 8, name: 'RTX 4090', category: 'GPU', price: 1599, image: '🎮' },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = DUMMY_PRODUCTS.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowDropdown(true);
    } else {
      setFilteredProducts([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartCount(cartCount + 1);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-muted shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-secondary text-xl font-bold">⚡</span>
              </div>
              <span className="font-bold text-xl text-primary hidden sm:inline">GadgetHub</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 mx-4 md:mx-8 max-w-2xl" ref={searchRef}>
            <div className="relative">
              <div className="flex items-center bg-muted border border-input rounded-lg px-4 py-2.5 focus-within:ring-2 focus-within:ring-secondary focus-within:border-secondary transition-all">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search gadgets, electronics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-1 text-foreground placeholder-muted-foreground outline-none"
                />
              </div>

              {/* Search Dropdown */}
              {showDropdown && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddToCart(product)}
                      className="w-full px-4 py-3 hover:bg-muted flex items-center justify-between border-b border-muted last:border-0 transition-colors text-left"
                    >
                      <div>
                        <div className="font-medium text-primary">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.category}</div>
                      </div>
                      <div className="font-semibold text-secondary">${product.price}</div>
                    </button>
                  ))}
                </div>
              )}

              {showDropdown && searchQuery && filteredProducts.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg p-4 text-center text-muted-foreground">
                  No products found
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* PC Builder Button */}
            <Link
              href="/pc-builder"
              className="hidden md:flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Zap className="w-5 h-5" />
              <span>PC Builder</span>
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-primary" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-destructive text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <span className=" sm:inline">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
