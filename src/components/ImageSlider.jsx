"use client";

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoPlay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    title: "Explore Amazing Destinations",
    subtitle: "Discover the world's most breathtaking locations"
  },
  {
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    title: "Adventure Awaits",
    subtitle: "Experience unforgettable moments"
  },
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    title: "Discover More",
    subtitle: "Your journey begins here"
  },
  {
    url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    title: "Serene Beaches",
    subtitle: "Relax and unwind by the ocean"
  },
  {
    url: "https://images.unsplash.com/photo-1519677100203-a0e668c92439",
    title: "Majestic Mountains",
    subtitle: "Conquer new heights"
  },
  {
    url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
    title: "Vibrant Cities",
    subtitle: "Experience the heartbeat of urban life"
  },  
  {
    url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    title: "Enchanting Forests",
    subtitle: "Step into a magical world"
  }
];


export default function ImageSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    AutoPlay({ delay: 5000, stopOnInteraction: false })
  ]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] min-w-0"
            >
              <div 
                className="relative h-[600px] w-full bg-cover bg-center transition-transform duration-500"
                style={{ backgroundImage: `url(${slide.url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 max-w-4xl px-4">
                    <h2 className="text-5xl font-bold text-white tracking-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xl text-white/90">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
        onClick={scrollNext}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 transition-all duration-300 ${
              index === selectedIndex 
                ? 'w-8 bg-white' 
                : 'w-4 bg-white/50'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}