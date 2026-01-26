'use client'

import { useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

export function BannerCarousel() {
  const [api, setApi] = useState<any>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=1200&h=400&fit=crop',
      alt: 'Banner 1',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      alt: 'Banner 2',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop',
      alt: 'Banner 3',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=400&fit=crop',
      alt: 'Banner 4',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=400&fit=crop',
      alt: 'Banner 5',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&h=400&fit=crop',
      alt: 'Banner 6',
    },
  ]

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    api.on('select', onSelect)
    onSelect()

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <div className="w-10/12 mx-auto">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="h-64 md:h-80 lg:h-96">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="basis-1/2 h-64 md:h-80 lg:h-96">
              <div className="w-full h-full">
                <img
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  )
}
