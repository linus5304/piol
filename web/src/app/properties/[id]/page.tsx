'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200',
  ],
  status: 'active',
  verificationStatus: 'approved',
  landlord: {
    _id: 'landlord-1',
    firstName: 'Jean',
    lastName: 'Kamga',
    profileImageUrl: null,
    idVerified: true,
    responseTime: 'Répond généralement en 1h',
    memberSince: 'Membre depuis 2023',
  },
  _creationTime: Date.now() - 1000 * 60 * 60 * 24 * 15,
};

const amenityLabels: Record<string, { label: string; icon: string }> = {
  wifi: { label: 'WiFi', icon: '📶' },
  parking: { label: 'Parking', icon: '🚗' },
  ac: { label: 'Climatisation', icon: '❄️' },
  security: { label: 'Sécurité 24h', icon: '🔐' },
  water247: { label: 'Eau 24/7', icon: '💧' },
  electricity247: { label: 'Électricité 24/7', icon: '⚡' },
  furnished: { label: 'Meublé', icon: '🛋️' },
  balcony: { label: 'Balcon', icon: '🌅' },
  garden: { label: 'Jardin', icon: '🌳' },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { isSignedIn } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const enabledAmenities = Object.entries(mockProperty.amenities)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-gray-900">Piol</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/properties" className="text-gray-600 hover:text-gray-900">
              ← Retour aux propriétés
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden h-[400px]">
          <div className="col-span-2 row-span-2">
            <img
              src={mockProperty.images[selectedImage]}
              alt={mockProperty.title}
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
          {mockProperty.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className={cn(
                'cursor-pointer overflow-hidden',
                index === mockProperty.images.length - 2 && 'relative'
              )}
              onClick={() => setSelectedImage(index + 1)}
            >
              <img
                src={image}
                alt={`Photo ${index + 2}`}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
              {index === mockProperty.images.length - 2 && mockProperty.images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                  +{mockProperty.images.length - 5} photos
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Section */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{mockProperty.title}</h1>
                  <p className="text-gray-600 mt-1">
                    {mockProperty.neighborhood}, {mockProperty.city}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className={cn('text-2xl', isSaved ? 'text-red-500' : 'text-gray-400')}>
                    {isSaved ? '❤️' : '🤍'}
                  </span>
                </button>
              </div>

              {/* Verification Badge */}
              {mockProperty.verificationStatus === 'approved' && (
                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  <span>✓</span>
                  <span>Propriété vérifiée par Piol</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-gray max-w-none">
                {mockProperty.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Équipements et commodités
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {enabledAmenities.map((amenityKey) => {
                  const amenity = amenityLabels[amenityKey];
                  return (
                    <div
                      key={amenityKey}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xl">{amenity?.icon}</span>
                      <span className="text-gray-700">{amenity?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h2>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-4xl block mb-2">📍</span>
                  <p>{mockProperty.neighborhood}, {mockProperty.city}</p>
                  <p className="text-sm">{mockProperty.addressLine1}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#FF385C]">
                    {formatCurrency(mockProperty.rentAmount)}
                    <span className="text-base font-normal text-gray-500">/mois</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Caution</span>
                    <span className="font-medium">
                      {formatCurrency(mockProperty.rentAmount * mockProperty.cautionMonths)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avance ({mockProperty.upfrontMonths} mois)</span>
                    <span className="font-medium">
                      {formatCurrency(mockProperty.rentAmount * mockProperty.upfrontMonths)}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span>Total à l'entrée</span>
                    <span>
                      {formatCurrency(
                        mockProperty.rentAmount * (mockProperty.cautionMonths + mockProperty.upfrontMonths)
                      )}
                    </span>
                  </div>

                  {isSignedIn ? (
                    <Button className="w-full" size="lg">
                      Contacter le propriétaire
                    </Button>
                  ) : (
                    <Link href="/sign-in" className="block">
                      <Button className="w-full" size="lg">
                        Se connecter pour contacter
                      </Button>
                    </Link>
                  )}

                  <p className="text-xs text-center text-gray-500">
                    Vos informations sont protégées
                  </p>
                </CardContent>
              </Card>

              {/* Landlord Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Propriétaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={mockProperty.landlord.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gray-200 text-lg">
                        {mockProperty.landlord.firstName[0]}
                        {mockProperty.landlord.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {mockProperty.landlord.firstName} {mockProperty.landlord.lastName}
                        </span>
                        {mockProperty.landlord.idVerified && (
                          <span className="text-green-500 text-sm">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {mockProperty.landlord.memberSince}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>⏱️ {mockProperty.landlord.responseTime}</p>
                  </div>

                  {mockProperty.landlord.idVerified && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                      <span>✓</span>
                      <span>Identité vérifiée</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <h4 className="font-medium text-blue-900 mb-2">🛡️ Conseils de sécurité</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Visitez toujours la propriété avant de payer</li>
                    <li>• Utilisez Piol pour vos paiements sécurisés</li>
                    <li>• Ne partagez jamais vos informations bancaires</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

