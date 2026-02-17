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

interface Banner{
  id:number;
  imageUrl:string;
  imageId:string;
  linkUrl:string; 
}

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [api, setApi] = useState<any>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)



  useEffect(() => {
    console.log("carousel banner",banners)
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
          {banners.length>0?banners.map((banner: Banner) => (
            <CarouselItem key={banner.id} className="basis-1/2 cursor-pointer h-64 md:h-80 lg:h-96">
              <div className="w-full h-full">
                <img
                  src={banner.imageUrl || "/placeholder.svg"}
                  alt={banner.imageId}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          )):(
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">No banners available</p>
            </div>
          )}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  )
}
