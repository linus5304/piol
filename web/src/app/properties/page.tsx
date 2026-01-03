'use client';

import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Buea', 'Kribi'];
const propertyTypes = [
  { value: 'all', label: 'Tous les types' },
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 Chambre' },
  { value: '2br', label: '2 Chambres' },
  { value: '3br', label: '3 Chambres' },
  { value: '4br', label: '4 Chambres' },
  { value: 'house', label: 'Maison' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'villa', label: 'Villa' },
];

// Mock properties for demo
const allProperties = [
  {
    _id: '1',
    title: 'Bel appartement à Makepe',
    propertyType: '2br' as const,
    rentAmount: 150000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Makepe',
    verificationStatus: 'approved',
    landlord: { _id: 'l1', firstName: 'Jean', lastName: 'Kamga', idVerified: true },
  },
  {
    _id: '2',
    title: 'Studio moderne Bastos',
    propertyType: 'studio' as const,
    rentAmount: 85000,
    currency: 'XAF',
    city: 'Yaoundé',
    neighborhood: 'Bastos',
    verificationStatus: 'approved',
    landlord: { _id: 'l2', firstName: 'Marie', lastName: 'Fotso', idVerified: true },
  },
  {
    _id: '3',
    title: 'Villa 4 chambres avec piscine',
    propertyType: 'villa' as const,
    rentAmount: 500000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonanjo',
    verificationStatus: 'approved',
    landlord: { _id: 'l3', firstName: 'Paul', lastName: 'Mbarga', idVerified: true },
  },
  {
    _id: '4',
    title: 'Appartement 3 chambres Bonapriso',
    propertyType: '3br' as const,
    rentAmount: 250000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonapriso',
    verificationStatus: 'approved',
    landlord: { _id: 'l4', firstName: 'Alice', lastName: 'Ngo', idVerified: true },
  },
  {
    _id: '5',
    title: 'Maison familiale Buea',
    propertyType: 'house' as const,
    rentAmount: 180000,
    currency: 'XAF',
    city: 'Buea',
    neighborhood: 'Mile 17',
    verificationStatus: 'approved',
    landlord: { _id: 'l5', firstName: 'Peter', lastName: 'Tabi', idVerified: true },
  },
  {
    _id: '6',
    title: 'Studio étudiant Ngoa-Ekelle',
    propertyType: 'studio' as const,
    rentAmount: 45000,
    currency: 'XAF',
    city: 'Yaoundé',
    neighborhood: 'Ngoa-Ekelle',
    verificationStatus: 'approved',
    landlord: { _id: 'l6', firstName: 'Sophie', lastName: 'Bella', idVerified: false },
  },
];

export default function PropertiesPage() {
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Filter properties based on selected criteria
  const propertiesResult = useMemo(() => {
    let filtered = allProperties;

    if (selectedCity) {
      filtered = filtered.filter((p) => p.city === selectedCity);
    }
    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter((p) => p.propertyType === selectedType);
    }
    if (minPrice) {
      filtered = filtered.filter((p) => p.rentAmount >= Number.parseInt(minPrice, 10));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.rentAmount <= Number.parseInt(maxPrice, 10));
    }

    return { properties: filtered, total: filtered.length };
  }, [selectedCity, selectedType, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-blue-600">Piol</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-blue-600 font-medium">
              Propriétés
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Propriétés disponibles</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select
              value={selectedCity ?? 'all'}
              onValueChange={(v) => setSelectedCity(v === 'all' ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedType ?? 'all'}
              onValueChange={(v) => setSelectedType(v === 'all' ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Prix min (FCFA)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Prix max (FCFA)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <Button
              variant="outline"
              onClick={() => {
                setSelectedCity(undefined);
                setSelectedType(undefined);
                setMinPrice('');
                setMaxPrice('');
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          {propertiesResult?.total ?? 0} propriété(s) trouvée(s)
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertiesResult?.properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}

          {!propertiesResult && (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
              ))}
            </>
          )}

          {propertiesResult?.properties.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune propriété trouvée</h3>
              <p className="text-gray-600">Essayez de modifier vos filtres ou revenez plus tard.</p>
            </div>
          )}
        </div>

        {/* Load more */}
        {propertiesResult?.nextCursor && (
          <div className="text-center mt-8">
            <Button variant="outline">Voir plus</Button>
          </div>
        )}
      </main>
    </div>
  );
}
