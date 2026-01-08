'use client';

import { Badge } from '@/components/ui/badge';
import {
  BadgeCheck,
  Bed,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Navigation,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useRef, useState } from 'react';

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  images: string[];
  verified: boolean;
  rating: number;
  distance: string;
}

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
}

function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function PropertyCard({ property, onFavoriteToggle }: PropertyCardProps) {
  const { id, title, price, location, bedrooms, images, verified, rating, distance } = property;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
      setCurrentSlide(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      const newSlide = Math.round(scrollRef.current.scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSlide = currentSlide > 0 ? currentSlide - 1 : images.length - 1;
    scrollToSlide(newSlide);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSlide = currentSlide < images.length - 1 ? currentSlide + 1 : 0;
    scrollToSlide(newSlide);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onFavoriteToggle?.(id, newFavoriteState);
  };

  return (
    <Link href={`/properties/${id}`}>
      <article className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg sm:rounded-xl">
          {/* Image Carousel */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((image) => (
              <div key={image} className="relative h-full w-full flex-shrink-0 snap-center">
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>

          {/* Verified Badge */}
          {verified && (
            <Badge className="absolute left-2 top-2 gap-1 bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground shadow-md">
              <BadgeCheck className="h-3 w-3" />
              Vérifié
            </Badge>
          )}

          {/* Favorite Button */}
          <button
            type="button"
            onClick={handleFavorite}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
              }`}
            />
          </button>

          {/* Navigation Arrows (Desktop only) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 sm:flex"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 sm:flex"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-4 w-4 text-foreground" />
              </button>
            </>
          )}

          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scrollToSlide(index);
                  }}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'scale-110 bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="mt-2 space-y-0.5">
          {/* Location + Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-medium text-foreground sm:text-sm">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-0.5 text-xs font-medium text-foreground sm:text-sm">
              <Star className="h-3 w-3 fill-current sm:h-4 sm:w-4" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <p className="line-clamp-1 text-xs font-medium text-muted-foreground sm:text-base">
            {title}
          </p>

          {/* Desktop: Distance + Bedrooms */}
          <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex sm:text-sm">
            <div className="flex items-center gap-1">
              <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>
                {bedrooms} {bedrooms > 1 ? 'chambres' : 'chambre'}
              </span>
            </div>
          </div>

          {/* Price */}
          <p className="text-sm font-semibold text-foreground sm:text-base">
            {formatPrice(price)} FCFA
            <span className="font-normal text-muted-foreground">/mois</span>
          </p>
        </div>
      </article>
    </Link>
  );
}
