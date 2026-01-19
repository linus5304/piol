'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useSafeAuth } from '@/hooks/use-safe-auth';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
  Armchair,
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Heart,
  ImageOff,
  Loader2,
  MapPin,
  MessageCircle,
  Share2,
  Shield,
  Star,
  Sun,
  TreePine,
  Wifi,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

const amenityConfig: Record<string, { label: string; icon: React.ElementType }> = {
  wifi: { label: 'WiFi inclus', icon: Wifi },
  parking: { label: 'Parking privé', icon: Car },
  ac: { label: 'Climatisation', icon: Wind },
  security: { label: 'Sécurité 24h/24', icon: Shield },
  water247: { label: 'Eau disponible 24/7', icon: Droplet },
  electricity247: { label: 'Électricité stable', icon: Zap },
  furnished: { label: 'Entièrement meublé', icon: Armchair },
  balcony: { label: 'Balcon avec vue', icon: Sun },
  garden: { label: 'Accès jardin', icon: TreePine },
};

const propertyTypeLabels: Record<string, string> = {
  studio: 'Studio',
  '1br': '1 Chambre',
  '2br': '2 Chambres',
  '3br': '3 Chambres',
  '4br': '4 Chambres',
  house: 'Maison',
  apartment: 'Appartement',
  villa: 'Villa',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  });
}

// Placeholder images when no property images exist
const placeholderImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
];

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params promise (Next.js 15+ / React 19)
  const { id } = use(params);

  const router = useRouter();
  const { isSignedIn } = useSafeAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useMutation(api.messages.sendMessage);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !property?.landlord?._id) return;

    setIsSending(true);
    try {
      await sendMessage({
        recipientId: property.landlord._id,
        propertyId: property._id,
        messageText: messageText.trim(),
      });

      // Generate conversation ID to redirect (same logic as backend)
      // Since we don't have the current user's ID here, we'll redirect to messages list
      setShowContactDialog(false);
      setMessageText('');
      router.push('/dashboard/messages');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Query property from Convex
  const property = useQuery(
    api.properties.getProperty,
    // Only query if id looks like a valid Convex ID (starts with valid prefix)
    id && id.length > 0 ? { propertyId: id as Id<'properties'> } : 'skip'
  );

  // Loading state
  if (property === undefined) {
    return <PropertyDetailSkeleton />;
  }

  // Not found state
  if (property === null) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Propriété introuvable</h1>
          <p className="text-neutral-600 mb-8">Cette propriété n'existe pas ou a été supprimée.</p>
          <Link href="/properties">
            <Button>Voir toutes les propriétés</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Use property images or placeholder
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Image Gallery */}
      <div className="relative">
        {/* Desktop Grid Gallery */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 max-w-7xl mx-auto px-4 py-4 h-[480px]">
          <button
            type="button"
            className="col-span-2 row-span-2 relative rounded-l-2xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setSelectedImage(0);
              setShowGallery(true);
            }}
          >
            <img
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
          {images.slice(1, 5).map((image: string, index: number) => (
            <button
              type="button"
              key={image}
              className={cn(
                'relative cursor-pointer group overflow-hidden',
                index === 1 && 'rounded-tr-2xl',
                index === 3 && 'rounded-br-2xl'
              )}
              onClick={() => {
                setSelectedImage(index + 1);
                setShowGallery(true);
              }}
            >
              <img
                src={image}
                alt={`Property view ${index + 2}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}

          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setShowGallery(true)}
              className="absolute bottom-8 right-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform text-sm font-medium"
            >
              <span>📷</span>
              Voir les {images.length} photos
            </button>
          )}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative h-[300px]">
          <img
            src={images[selectedImage] || images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {images.map((image: string, index: number) => (
                  <button
                    type="button"
                    key={image}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === selectedImage ? 'bg-white w-3' : 'bg-white/60'
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={() => setShowGallery(false)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-full flex items-center justify-center p-4">
            <button
              type="button"
              onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
              className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={images[selectedImage]}
              alt={`Gallery view ${selectedImage + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
              className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {images.map((image: string, index: number) => (
              <button
                type="button"
                key={image}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  index === selectedImage ? 'bg-white' : 'bg-white/40'
                )}
              />
            ))}
          </div>
          <div className="absolute bottom-4 right-4 text-white/80 text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-neutral-600">
              {property.reviews.averageRating && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-neutral-900">
                    {property.reviews.averageRating.toFixed(1)}
                  </span>
                  <span>({property.reviews.count} avis)</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {property.neighborhood ? `${property.neighborhood}, ` : ''}
                {property.city}
              </span>
              {property.verificationStatus === 'approved' && (
                <span className="flex items-center gap-1 text-verified">
                  <BadgeCheck className="w-4 h-4" />
                  Vérifié
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-neutral-300"
            >
              <Share2 className="w-4 h-4" />
              <span>Partager</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className={cn(
                'flex items-center gap-2 border-neutral-300',
                isSaved && 'text-primary border-primary'
              )}
            >
              <Heart className={cn('w-4 h-4', isSaved && 'fill-primary')} />
              <span>{isSaved ? 'Enregistré' : 'Enregistrer'}</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Property Stats */}
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-neutral-200">
              <div className="text-center">
                <div className="text-2xl font-semibold text-neutral-900">
                  {propertyTypeLabels[property.propertyType] || property.propertyType}
                </div>
                <div className="text-sm text-neutral-600">Type</div>
              </div>
              <div className="w-px h-10 bg-neutral-200" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-neutral-900">
                  {property.cautionMonths}
                </div>
                <div className="text-sm text-neutral-600">Mois de caution</div>
              </div>
              <div className="w-px h-10 bg-neutral-200" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-neutral-900">
                  {property.upfrontMonths}
                </div>
                <div className="text-sm text-neutral-600">Mois d'avance</div>
              </div>
            </div>

            {/* Landlord Preview */}
            {property.landlord && (
              <div className="flex items-center justify-between py-6 border-b border-neutral-200">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                    <AvatarImage src={property.landlord.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white text-lg">
                      {property.landlord.firstName?.[0] || '?'}
                      {property.landlord.lastName?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">
                        Proposé par {property.landlord.firstName || 'Propriétaire'}
                      </span>
                      {property.landlord.idVerified && (
                        <BadgeCheck className="w-5 h-5 text-verified" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">
                      Publié le {formatDate(property._creationTime)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  À propos de ce logement
                </h2>
                <div className="prose prose-neutral max-w-none">
                  {property.description.split('\n\n').map((paragraph: string) => (
                    <p
                      key={paragraph.slice(0, 50)}
                      className="text-neutral-600 mb-4 whitespace-pre-line leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {enabledAmenities.length > 0 && (
              <div className="pt-6 border-t border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                  Ce que propose ce logement
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {enabledAmenities.map((amenityKey) => {
                    const amenity = amenityConfig[amenityKey];
                    if (!amenity) return null;
                    const Icon = amenity.icon;
                    return (
                      <div key={amenityKey} className="flex items-center gap-4 py-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-neutral-700" />
                        </div>
                        <span className="text-neutral-700">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Où vous serez</h2>
              <p className="text-neutral-600 mb-4">
                {property.neighborhood ? `${property.neighborhood}, ` : ''}
                {property.city}
                {property.addressLine1 && <> — {property.addressLine1}</>}
              </p>
              <div className="bg-neutral-100 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center text-neutral-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
                  <p className="font-medium">Carte interactive</p>
                  <p className="text-sm">Bientôt disponible</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card */}
              <Card className="shadow-xl border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold text-neutral-900">
                        {formatCurrency(property.rentAmount)}
                      </span>
                      <span className="text-neutral-500">{property.currency}</span>
                    </div>
                    <span className="text-neutral-500">/mois</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        Caution ({property.cautionMonths} mois)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(property.rentAmount * property.cautionMonths)}{' '}
                        {property.currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        Avance ({property.upfrontMonths} mois)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(property.rentAmount * property.upfrontMonths)}{' '}
                        {property.currency}
                      </span>
                    </div>
                    <div className="h-px bg-neutral-200 my-3" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total à l'entrée</span>
                      <span>
                        {formatCurrency(totalEntry)} {property.currency}
                      </span>
                    </div>
                  </div>

                  {isSignedIn ? (
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-primary hover:bg-primary-hover text-white"
                        size="lg"
                        onClick={() => setShowContactDialog(true)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contacter le propriétaire
                      </Button>
                      <Button variant="outline" className="w-full border-neutral-300" size="lg">
                        <Calendar className="w-4 h-4 mr-2" />
                        Planifier une visite
                      </Button>
                    </div>
                  ) : (
                    <Link href="/sign-in" className="block">
                      <Button
                        className="w-full bg-primary hover:bg-primary-hover text-white"
                        size="lg"
                      >
                        Se connecter pour contacter
                      </Button>
                    </Link>
                  )}

                  <p className="text-xs text-center text-neutral-500 mt-4">
                    🔒 Vos informations sont protégées
                  </p>
                </CardContent>
              </Card>

              {/* Landlord Card */}
              {property.landlord && (
                <Card className="border-neutral-200 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                        <AvatarImage src={property.landlord.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white text-xl">
                          {property.landlord.firstName?.[0] || '?'}
                          {property.landlord.lastName?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {property.landlord.firstName} {property.landlord.lastName}
                          </span>
                          {property.landlord.idVerified && (
                            <BadgeCheck className="w-5 h-5 text-verified" />
                          )}
                        </div>
                        {property.reviews.count > 0 && (
                          <div className="flex items-center gap-1 text-sm text-neutral-500">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-neutral-900">
                              {property.reviews.averageRating?.toFixed(1)}
                            </span>
                            <span>• {property.reviews.count} avis</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {property.landlord.idVerified && (
                        <div className="flex items-center gap-2 text-sm text-verified">
                          <BadgeCheck className="w-4 h-4" />
                          <span>Identité vérifiée</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Safety Tips */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Conseils de sécurité</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Visitez toujours la propriété avant de payer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Utilisez Piol pour vos paiements sécurisés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Ne partagez jamais vos informations bancaires</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-40">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-neutral-900">
                {formatCurrency(property.rentAmount)}
              </span>
              <span className="text-neutral-500 text-sm">{property.currency}/mois</span>
            </div>
            {property.reviews.count > 0 && (
              <div className="flex items-center gap-1 text-sm text-neutral-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{property.reviews.averageRating?.toFixed(1)}</span>
                <span>({property.reviews.count})</span>
              </div>
            )}
          </div>
          {isSignedIn ? (
            <Button
              className="bg-primary hover:bg-primary-hover text-white"
              size="lg"
              onClick={() => setShowContactDialog(true)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contacter
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-primary hover:bg-primary-hover text-white" size="lg">
                Se connecter
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter le propriétaire</DialogTitle>
            <DialogDescription>
              Envoyez un message à {property.landlord?.firstName || 'le propriétaire'} concernant
              cette propriété.
            </DialogDescription>
          </DialogHeader>

          {/* Property Preview */}
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
            <img
              src={images[0]}
              alt={property.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 truncate">{property.title}</p>
              <p className="text-sm text-primary font-medium">
                {formatCurrency(property.rentAmount)} {property.currency}/mois
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

function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-bold text-primary">Piol</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/properties"
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour aux propriétés</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Image Gallery Skeleton */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 max-w-7xl mx-auto px-4 py-4 h-[480px]">
        <Skeleton className="col-span-2 row-span-2 rounded-l-2xl" />
        <Skeleton className="rounded-tr-2xl" />
        <Skeleton />
        <Skeleton />
        <Skeleton className="rounded-br-2xl" />
      </div>

      {/* Mobile Image Skeleton */}
      <div className="md:hidden">
        <Skeleton className="h-[300px] w-full" />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Stats Skeleton */}
            <div className="flex gap-6 pb-6 border-b border-neutral-200">
              <div className="text-center">
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="text-center">
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="text-center">
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Landlord Skeleton */}
            <div className="flex items-center gap-4 py-6 border-b border-neutral-200">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Description Skeleton */}
            <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Amenities Skeleton */}
            <div className="pt-6 border-t border-neutral-200">
              <Skeleton className="h-6 w-64 mb-6" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-neutral-200 rounded-2xl">
              <CardContent className="p-6">
                <Skeleton className="h-10 w-40 mb-2" />
                <Skeleton className="h-4 w-20 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-12 w-full mb-3" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
