'use client';

import { Header } from '@/components/header';
import { PropertyDetailSkeleton } from '@/components/properties/property-detail-skeleton';
import type { PropertyData } from '@/components/properties/variations/types';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useSafeAuth } from '@/hooks/use-safe-auth';
import { parseAppLocale } from '@/i18n/config';
import { formatDate, formatNumber } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocale } from 'gt-next/client';
import { ChevronLeft, ChevronRight, ImageOff, Loader2, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, lazy, use, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Lazy-load property detail variation
const CostCalcA = lazy(() =>
  import('@/components/properties/variations/cost-calc-a').then((m) => ({
    default: m.CostCalcA,
  }))
);

// Placeholder images when no property images exist
const placeholderImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
];

function formatCurrency(amount: number, locale: string): string {
  return formatNumber(amount, locale);
}

function formatListingDate(timestamp: number, locale: string): string {
  return formatDate(timestamp, locale, {
    year: 'numeric',
    month: 'long',
  });
}

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const locale = parseAppLocale(useLocale());
  const router = useRouter();
  const { isSignedIn } = useSafeAuth();

  // ---------------------------------------------------------------------------
  // Page state
  // ---------------------------------------------------------------------------
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [galleryCarouselApi, setGalleryCarouselApi] = useState<CarouselApi>();

  const toggleSaveProperty = useMutation(api.savedProperties.toggleSaveProperty);
  const sendMessage = useMutation(api.messages.sendMessage);

  // Sync gallery carousel with selectedImage
  useEffect(() => {
    galleryCarouselApi?.scrollTo(selectedImage);
  }, [selectedImage, galleryCarouselApi]);

  useEffect(() => {
    const onSelect = () => {
      const snap = galleryCarouselApi?.selectedScrollSnap();
      if (snap !== undefined) setSelectedImage(snap);
    };
    galleryCarouselApi?.on('select', onSelect);
    return () => {
      galleryCarouselApi?.off('select', onSelect);
    };
  }, [galleryCarouselApi]);

  // Saved status
  const savedStatus = useQuery(
    api.savedProperties.isPropertySaved,
    id && id.length > 0 ? { propertyId: id as Id<'properties'> } : 'skip'
  );

  useEffect(() => {
    if (savedStatus !== undefined) {
      setIsSaved(savedStatus);
    }
  }, [savedStatus]);

  // Query property
  const property = useQuery(
    api.properties.getProperty,
    id && id.length > 0 ? { propertyId: id as Id<'properties'> } : 'skip'
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleSendMessage = async () => {
    if (!messageText.trim() || !property?.landlord?._id) return;
    setIsSending(true);
    try {
      await sendMessage({
        recipientId: property.landlord._id,
        propertyId: property._id,
        messageText: messageText.trim(),
      });
      setShowContactDialog(false);
      setMessageText('');
      router.push('/dashboard/messages');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleSave = async () => {
    if (!property?._id) return;
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      await toggleSaveProperty({ propertyId: property._id });
    } catch (error) {
      console.error('Failed to toggle save:', error);
      setIsSaved(!nextSaved);
      toast.error('Impossible de sauvegarder la propriété. Veuillez réessayer.');
    }
  };

  // ---------------------------------------------------------------------------
  // Loading / Not Found
  // ---------------------------------------------------------------------------
  if (property === undefined) {
    return (
      <>
        <Header />
        <PropertyDetailSkeleton />
      </>
    );
  }

  if (property === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Propriété introuvable</h1>
          <p className="text-muted-foreground mb-8">
            Cette propriété n&apos;existe pas ou a été supprimée.
          </p>
          <Link href="/properties">
            <Button>Voir toutes les propriétés</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------
  const images =
    property.imageUrls && property.imageUrls.length > 0
      ? property.imageUrls
          .map((img: { url: string | null }) => img.url)
          .filter((url: string | null): url is string => url !== null)
      : placeholderImages;

  const enabledAmenities = property.amenities
    ? Object.entries(property.amenities)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => key)
    : [];

  const totalEntry = property.rentAmount * (property.cautionMonths + property.upfrontMonths);

  const variationProps = {
    property: property as unknown as PropertyData,
    images,
    enabledAmenities,
    totalEntry,
    isSaved,
    isSignedIn: isSignedIn ?? false,
    locale,
    onToggleSave: handleToggleSave,
    onContactClick: () => setShowContactDialog(true),
    onOpenGallery: (index: number) => {
      setSelectedImage(index);
      setShowGallery(true);
    },
    formatCurrency,
    formatListingDate,
  };

  const headerVariant = 'default' as const;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <Header variant={headerVariant} />

      <Suspense fallback={<PropertyDetailSkeleton />}>
        <CostCalcA {...variationProps} />
      </Suspense>

      {/* ------------------------------------------------------------------- */}
      {/* Full Screen Gallery Modal (shared across all variations)            */}
      {/* ------------------------------------------------------------------- */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4 z-20">
            <button
              type="button"
              onClick={() => setShowGallery(false)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-full flex items-center justify-center">
            <Carousel
              setApi={setGalleryCarouselApi}
              className="w-full h-full"
              opts={{ loop: images.length > 1, startIndex: selectedImage }}
            >
              <CarouselContent className="-ml-0 h-full">
                {images.map((image: string, index: number) => (
                  <CarouselItem
                    key={`gallery-${image}`}
                    className="pl-0 h-full flex items-center justify-center"
                  >
                    <img
                      src={image}
                      alt={`${property.title} - Vue ${index + 1}`}
                      className="max-h-[90vh] max-w-[90vw] object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <button
              type="button"
              onClick={() => galleryCarouselApi?.scrollPrev()}
              className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => galleryCarouselApi?.scrollNext()}
              className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {images.map((image: string, index: number) => (
              <button
                type="button"
                key={`gallery-dot-${image}`}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  index === selectedImage ? 'bg-white' : 'bg-white/40'
                )}
              />
            ))}
          </div>
          <div className="absolute bottom-4 right-4 text-white/80 text-sm z-10">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Contact Dialog (shared across all variations)                       */}
      {/* ------------------------------------------------------------------- */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter le propriétaire</DialogTitle>
            <DialogDescription>
              Envoyez un message à {property.landlord?.firstName || 'le propriétaire'} concernant
              cette propriété.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <img
              src={images[0]}
              alt={property.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{property.title}</p>
              <p className="text-sm text-primary font-medium font-mono tabular-nums">
                {formatCurrency(property.rentAmount, locale)} {property.currency}/mois
              </p>
            </div>
          </div>

          <Textarea
            placeholder="Bonjour, je suis intéressé(e) par cette propriété. Est-elle toujours disponible?"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={4}
            className="resize-none"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isSending}
              className="bg-primary hover:bg-primary-hover text-white"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
