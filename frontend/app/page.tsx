import Navbar from '@/components/client/navbar';
import BannerCarousel from '@/components/client/banner-carousel';
import CategoryCarousel from '@/components/client/category-carousel';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
          {/* Banner Carousel */}
          <BannerCarousel />
        </div>
      </section>

      {/* Category Carousel Section */}
      <div className="bg-background">
        <CategoryCarousel />
      </div>

      {/* Featured Section Placeholder */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-balance">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground">
            Premium electronics and gadgets curated just for you.
          </p>
        </div>
      </section>
    </main>
  );
}
