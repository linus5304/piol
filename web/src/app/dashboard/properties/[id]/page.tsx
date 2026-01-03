'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Appartement 2 chambres - Makepe',
  description: 'Bel appartement de 2 chambres avec salon, cuisine équipée et salle de bain moderne. Situé dans un quartier calme et sécurisé.',
  propertyType: '2br',
  city: 'Douala',
  neighborhood: 'Makepe',
  addressLine1: 'Près du carrefour Ange Raphael',
  rentAmount: 150000,
  cautionMonths: 2,
  upfrontMonths: 6,
  amenities: ['wifi', 'security', 'water247'],
  status: 'active',
  verificationStatus: 'approved',
  views: 45,
  inquiries: 3,
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ],
};

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/properties" className="text-gray-500 hover:text-gray-700">
            ← Retour
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier la propriété</h1>
            <p className="text-gray-600">{mockProperty.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/properties/${params.id}`}>
            <Button variant="outline">Voir l'annonce</Button>
          </Link>
          <Button>Enregistrer</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vues</CardDescription>
            <CardTitle className="text-2xl">{mockProperty.views}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Demandes</CardDescription>
            <CardTitle className="text-2xl">{mockProperty.inquiries}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Statut</CardDescription>
            <CardTitle className="text-2xl text-green-600">Actif</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vérification</CardDescription>
            <CardTitle className="text-2xl text-green-600">✓ Vérifié</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" defaultValue={mockProperty.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              defaultValue={mockProperty.description}
              className="w-full min-h-[120px] px-3 py-2 border rounded-md"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rent">Loyer mensuel (FCFA)</Label>
              <Input
                id="rent"
                type="number"
                defaultValue={mockProperty.rentAmount}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caution">Mois de caution</Label>
              <Input
                id="caution"
                type="number"
                defaultValue={mockProperty.cautionMonths}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upfront">Avance (mois)</Label>
              <Input
                id="upfront"
                type="number"
                defaultValue={mockProperty.upfrontMonths}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>Gérez les photos de votre propriété</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {mockProperty.images.map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group"
              >
                <img
                  src={image}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-2xl">+</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline">
            {mockProperty.status === 'active' ? 'Désactiver' : 'Activer'}
          </Button>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Supprimer l'annonce
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

