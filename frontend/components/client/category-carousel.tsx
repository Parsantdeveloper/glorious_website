'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

interface CategoryCarouselProps {
  data: Category[];
}

export default function CategoryCarousel({data}: CategoryCarouselProps) {
      console.log("CategoryCarousel data:", data);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = containerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Shop by Category</h2>

        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--secondary) transparent',
            }}
          >
            {data.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex-shrink-0 group/card w-32 md:w-40 transition-transform hover:scale-105"
              >
                <div className="bg-white border border-border rounded-lg p-4 text-center hover:shadow-lg transition-shadow h-full flex flex-col items-center justify-center gap-3">
                  <div className="text-4xl md:text-5xl">
                 <Image
                   src={category.imageUrl ?? "/placeholder.png"}
                   width={40}
                   height={40}
                   alt={category.name}
                 />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm md:text-base line-clamp-2">
                      {category.name}
                    </h3>
                   
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 z-10 bg-white border border-border shadow-md hover:bg-muted rounded-full p-2 transition-all hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 z-10 bg-white border border-border shadow-md hover:bg-muted rounded-full p-2 transition-all hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          )}

          {/* Gradient Fade Effect */}
          <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-background to-transparent pointer-events-none rounded-lg" />
        </div>
      </div>
    </section>
  );
}
