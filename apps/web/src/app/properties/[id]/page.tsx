'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSafeAuth } from '@/hooks/use-safe-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Share2,
  Heart,
  MapPin,
  Star,
  Shield,
  Wifi,
  Car,
  Wind,
  Droplet,
  Zap,
  Armchair,
  Sun,
  TreePine,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  BadgeCheck,
  MessageCircle,
  Phone,
  Calendar,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

// Mock property data
const mockProperty = {
  _id: 'prop-1',
  title: 'Appartement moderne 2 chambres à Makepe',
  description: `Découvrez ce magnifique appartement de 2 chambres situé dans le quartier calme de Makepe, Douala.

L'appartement comprend:
- Un salon spacieux et lumineux
- Une cuisine moderne entièrement équipée
- 2 chambres confortables avec placards intégrés
- Une salle de bain moderne avec douche
- Un balcon avec vue sur le quartier

L'immeuble dispose d'un gardien 24h/24 et d'un parking sécurisé. Le quartier est proche de toutes les commodités: supermarchés, écoles, pharmacies et transports.

Idéal pour un couple ou une petite famille recherchant le confort et la sécurité.`,
  propertyType: '2br',
  rentAmount: 150000,
  currency: 'XAF',
  cautionMonths: 2,
  upfrontMonths: 6,
  city: 'Douala',
  neighborhood: 'Makepe',
  addressLine1: 'Près du carrefour Ange Raphael',
  bedrooms: 2,
  bathrooms: 1,
  size: 75,
  amenities: {
    wifi: true,
    parking: true,
    security: true,
    water247: true,
    electricity247: false,
    furnished: false,
    ac: true,
    balcony: true,
    garden: false,
  },
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
  ],
  status: 'active',
  verificationStatus: 'approved',
  landlord: {
    _id: 'landlord-1',
    firstName: 'Jean',
    lastName: 'Kamga',
    profileImageUrl: null,
    idVerified: true,
    responseTime: 'En quelques heures',
    memberSince: '2023',
    properties: 5,
    rating: 4.9,
    reviews: 23,
  },
  _creationTime: Date.now() - 1000 * 60 * 60 * 24 * 15,
};

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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const { isSignedIn } = useSafeAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const enabledAmenities = Object.entries(mockProperty.amenities)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  const totalEntry =
    mockProperty.rentAmount * (mockProperty.cautionMonths + mockProperty.upfrontMonths);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Image Gallery */}
      <div className="relative">
        {/* Desktop Grid Gallery */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 max-w-7xl mx-auto px-4 py-4 h-[480px]">
          <div
            className="col-span-2 row-span-2 relative rounded-l-2xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setSelectedImage(0);
              setShowGallery(true);
            }}
          >
            <img
              src={mockProperty.images[0]}
              alt={mockProperty.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          {mockProperty.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
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
                alt={`Photo ${index + 2}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}

          {/* Show all photos button */}
          <button
            onClick={() => setShowGallery(true)}
            className="absolute bottom-8 right-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform text-sm font-medium"
          >
            <span>📷</span>
            Voir les {mockProperty.images.length} photos
          </button>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative h-[300px]">
          <img
            src={mockProperty.images[selectedImage]}
            alt={mockProperty.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {mockProperty.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === selectedImage ? 'bg-white w-3' : 'bg-white/60'
                )}
              />
            ))}
          </div>
          <button
            onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setSelectedImage(Math.min(mockProperty.images.length - 1, selectedImage + 1))
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setShowGallery(false)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-full flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
              className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={mockProperty.images[selectedImage]}
              alt={`Photo ${selectedImage + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={() =>
                setSelectedImage(Math.min(mockProperty.images.length - 1, selectedImage + 1))
              }
              className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {mockProperty.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  index === selectedImage ? 'bg-white' : 'bg-white/40'
                )}
              />
            ))}
          </div>
          <div className="absolute bottom-4 right-4 text-white/80 text-sm">
            {selectedImage + 1} / {mockProperty.images.length}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              {mockProperty.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-neutral-600">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-neutral-900">{mockProperty.landlord.rating}</span>
                <span>({mockProperty.landlord.reviews} avis)</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {mockProperty.neighborhood}, {mockProperty.city}
              </span>
              {mockProperty.verificationStatus === 'approved' && (
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
                  {mockProperty.bedrooms}
                </div>
                <div className="text-sm text-neutral-600">Chambres</div>
              </div>
              <div className="w-px h-10 bg-neutral-200" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-neutral-900">
                  {mockProperty.bathrooms}
                </div>
                <div className="text-sm text-neutral-600">Salle de bain</div>
              </div>
              <div className="w-px h-10 bg-neutral-200" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-neutral-900">{mockProperty.size}m²</div>
                <div className="text-sm text-neutral-600">Surface</div>
              </div>
            </div>

            {/* Landlord Preview */}
            <div className="flex items-center justify-between py-6 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                  <AvatarImage src={mockProperty.landlord.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white text-lg">
                    {mockProperty.landlord.firstName[0]}
                    {mockProperty.landlord.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-900">
                      Proposé par {mockProperty.landlord.firstName}
                    </span>
                    {mockProperty.landlord.idVerified && (
                      <BadgeCheck className="w-5 h-5 text-verified" />
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    {mockProperty.landlord.properties} propriétés • Membre depuis{' '}
                    {mockProperty.landlord.memberSince}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-600">
                <Clock className="w-4 h-4" />
                Répond {mockProperty.landlord.responseTime.toLowerCase()}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">À propos de ce logement</h2>
              <div className="prose prose-neutral max-w-none">
                {mockProperty.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-neutral-600 mb-4 whitespace-pre-line leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Amenities */}
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

            {/* Location */}
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Où vous serez</h2>
              <p className="text-neutral-600 mb-4">
                {mockProperty.neighborhood}, {mockProperty.city}
                {mockProperty.addressLine1 && <> — {mockProperty.addressLine1}</>}
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
                        {formatCurrency(mockProperty.rentAmount)}
                      </span>
                      <span className="text-neutral-500">FCFA</span>
                    </div>
                    <span className="text-neutral-500">/mois</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        Caution ({mockProperty.cautionMonths} mois)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(mockProperty.rentAmount * mockProperty.cautionMonths)} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        Avance ({mockProperty.upfrontMonths} mois)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(mockProperty.rentAmount * mockProperty.upfrontMonths)} FCFA
                      </span>
                    </div>
                    <div className="h-px bg-neutral-200 my-3" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total à l'entrée</span>
                      <span>{formatCurrency(totalEntry)} FCFA</span>
                    </div>
                  </div>

                  {isSignedIn ? (
                    <div className="space-y-3">
                      <Button className="w-full bg-primary hover:bg-primary-hover text-white" size="lg">
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
                      <Button className="w-full bg-primary hover:bg-primary-hover text-white" size="lg">
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
              <Card className="border-neutral-200 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                      <AvatarImage src={mockProperty.landlord.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white text-xl">
                        {mockProperty.landlord.firstName[0]}
                        {mockProperty.landlord.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          {mockProperty.landlord.firstName} {mockProperty.landlord.lastName}
                        </span>
                        {mockProperty.landlord.idVerified && (
                          <BadgeCheck className="w-5 h-5 text-verified" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-neutral-500">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-neutral-900">
                          {mockProperty.landlord.rating}
                        </span>
                        <span>• {mockProperty.landlord.reviews} avis</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-100">
                    <div className="text-center">
                      <div className="font-semibold text-neutral-900">
                        {mockProperty.landlord.properties}
                      </div>
                      <div className="text-xs text-neutral-500">Propriétés</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-neutral-900">
                        {mockProperty.landlord.memberSince}
                      </div>
                      <div className="text-xs text-neutral-500">Membre depuis</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock className="w-4 h-4" />
                      <span>Répond {mockProperty.landlord.responseTime.toLowerCase()}</span>
                    </div>
                    {mockProperty.landlord.idVerified && (
                      <div className="flex items-center gap-2 text-sm text-verified">
                        <BadgeCheck className="w-4 h-4" />
                        <span>Identité vérifiée</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

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
                {formatCurrency(mockProperty.rentAmount)}
              </span>
              <span className="text-neutral-500 text-sm">FCFA/mois</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-neutral-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{mockProperty.landlord.rating}</span>
              <span>({mockProperty.landlord.reviews})</span>
            </div>
          </div>
          {isSignedIn ? (
            <Button className="bg-primary hover:bg-primary-hover text-white" size="lg">
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
    </div>
  );
}
