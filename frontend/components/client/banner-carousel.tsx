'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  description: string;
  bgGradient: string;
  icon: string;
}

const BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Latest Gaming GPU',
    description: 'RTX 4090 now available - Unleash extreme performance',
    bgGradient: 'from-primary to-primary/80',
    icon: '🎮',
  },
  {
    id: 2,
    title: 'Premium Smartphones',
    description: 'Experience cutting-edge technology with premium devices',
    bgGradient: 'from-slate-800 to-slate-700',
    icon: '📱',
  },
  {
    id: 3,
    title: 'Ultra Performance Laptops',
    description: 'MacBook Pro 16" with M3 Max - Pure Power',
    bgGradient: 'from-slate-700 to-slate-600',
    icon: '💻',
  },
  {
    id: 4,
    title: 'Audio Excellence',
    description: 'Immersive sound with our premium audio collection',
    bgGradient: 'from-primary to-primary/70',
    icon: '🎧',
  },
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    setIsAutoPlay(false);
  };

  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  const currentBanner = BANNERS[currentIndex];

  return (
    <div
      className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Banner Content */}
      <div
        className={`absolute inset-0 bg-linear-to-r ${currentBanner.bgGradient} flex items-center justify-between px-8 md:px-12 transition-all duration-500`}
      >
        <div className="flex-1 z-10">
          <div className="text-5xl md:text-6xl mb-4">{currentBanner.icon}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-balance">
            {currentBanner.title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 text-balance">
            {currentBanner.description}
          </p>
          <button className="mt-6 bg-secondary hover:bg-secondary/90 text-primary px-8 py-3 rounded-lg font-semibold transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'bg-secondary w-8 h-2'
                : 'bg-white/50 hover:bg-white/70 w-2 h-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
