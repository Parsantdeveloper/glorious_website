'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
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

export default function NavbarSearch() {
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
  );
}
