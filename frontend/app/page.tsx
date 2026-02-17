import Navbar from '@/components/client/navbar';
import {BannerCarousel} from '@/components/client/banner-carousel';
import CategoryCarouselSSR from '@/components/landing/category';

export default async function Home() {

 let banners = []

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banner`, {
      next: { revalidate: 60 * 60 } // 1 hour cache
    })
    const data = await res.json()
    banners = data.data
    console.log('Fetched banners:', banners)
  } catch (err) {
    console.error(err)
  }
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-linear-to-b from-muted/50 to-background">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
          {/* Banner Carousel */}
          <BannerCarousel banners={banners}/>
        </div>
      </section>

      {/* Category Carousel Section */}
      <div className="bg-background">
        <CategoryCarouselSSR />
      </div>

      {/* Featured Section Placeholder */}
      <section className="bg-linaer-to-b from-background to-muted/30 py-16 md:py-24">
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
