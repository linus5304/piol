'use client';

import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Building2,
  Home,
  Hotel,
  Castle,
  Warehouse,
  X,
  Map,
  Grid3X3,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PublicLayout } from '@/components/layouts/public-layout';

const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Buea', 'Kribi', 'Limbé', 'Bamenda', 'Garoua'];

const propertyCategories = [
  { value: 'all', labelKey: 'categories.all', icon: Grid3X3 },
  { value: 'studio', labelKey: 'categories.studios', icon: Hotel },
  { value: 'apartment', labelKey: 'categories.apartments', icon: Building2 },
  { value: 'house', labelKey: 'categories.houses', icon: Home },
  { value: 'villa', labelKey: 'categories.villas', icon: Castle },
  { value: 'commercial', labelKey: 'categories.commercial', icon: Warehouse },
];

const priceRanges = [
  { value: 'all', label: 'Tous les prix' },
  { value: '0-50000', label: 'Moins de 50 000 FCFA' },
  { value: '50000-100000', label: '50 000 - 100 000 FCFA' },
  { value: '100000-200000', label: '100 000 - 200 000 FCFA' },
  { value: '200000-500000', label: '200 000 - 500 000 FCFA' },
  { value: '500000+', label: 'Plus de 500 000 FCFA' },
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
    amenities: { wifi: true, parking: true, ac: true },
    bedrooms: 2,
    bathrooms: 1,
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
    amenities: { wifi: true, security: true },
    bedrooms: 1,
    bathrooms: 1,
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
    amenities: { wifi: true, parking: true, ac: true, pool: true, security: true },
    bedrooms: 4,
    bathrooms: 3,
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
    amenities: { wifi: true, parking: true, balcony: true },
    bedrooms: 3,
    bathrooms: 2,
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
    amenities: { parking: true, garden: true },
    bedrooms: 3,
    bathrooms: 2,
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
    amenities: { wifi: true },
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    _id: '7',
    title: 'Loft spacieux centre-ville',
    propertyType: 'apartment' as const,
    rentAmount: 120000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Akwa',
    verificationStatus: 'approved',
    landlord: { _id: 'l7', firstName: 'Emmanuel', lastName: 'Ndong', idVerified: true },
    amenities: { wifi: true, ac: true },
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    _id: '8',
    title: 'Maison traditionnelle Foumban',
    propertyType: 'house' as const,
    rentAmount: 95000,
    currency: 'XAF',
    city: 'Bafoussam',
    neighborhood: 'Centre',
    verificationStatus: 'approved',
    landlord: { _id: 'l8', firstName: 'Ibrahim', lastName: 'Njoya', idVerified: true },
    amenities: { parking: true, garden: true },
    bedrooms: 4,
    bathrooms: 2,
  },
];

export default function PropertiesPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const propertiesResult = useMemo(() => {
    let filtered = allProperties;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.neighborhood.toLowerCase().includes(query)
      );
    }

    if (selectedCity) {
      filtered = filtered.filter((p) => p.city === selectedCity);
    }

    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'apartment') {
        filtered = filtered.filter(
          (p) =>
            p.propertyType === 'apartment' ||
            p.propertyType === '1br' ||
            p.propertyType === '2br' ||
            p.propertyType === '3br' ||
            p.propertyType === '4br'
        );
      } else {
        filtered = filtered.filter((p) => p.propertyType === selectedCategory);
      }
    }

    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map((v) => (v === '' ? undefined : Number(v)));
      if (priceRange.endsWith('+')) {
        const minValue = Number(priceRange.replace('+', ''));
        filtered = filtered.filter((p) => p.rentAmount >= minValue);
      } else if (min !== undefined && max !== undefined) {
        filtered = filtered.filter((p) => p.rentAmount >= min && p.rentAmount <= max);
      }
    }

    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.rentAmount - b.rentAmount);
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.rentAmount - a.rentAmount);
    }

    return { properties: filtered, total: filtered.length };
  }, [searchQuery, selectedCity, selectedCategory, priceRange, sortBy]);

  const activeFiltersCount = [
    selectedCity,
    selectedCategory !== 'all' ? selectedCategory : null,
    priceRange !== 'all' ? priceRange : null,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCity(undefined);
    setSelectedCategory('all');
    setPriceRange('all');
  };

  return (
    <PublicLayout showFooter={false}>
      {/* Search & Filters */}
      <div className="border-b bg-background sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <Select value={selectedCity ?? 'all'} onValueChange={(v) => setSelectedCity(v === 'all' ? undefined : v)}>
              <SelectTrigger className="w-40 hidden sm:flex rounded-xl">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('search.allCities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('search.allCities')}</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-xl ${activeFiltersCount > 0 ? 'border-foreground' : ''}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">{t('filters.title')}</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 rounded-full">{activeFiltersCount}</Badge>
              )}
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {propertyCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.value;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors touch-target rounded-lg ${
                    isActive
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t(category.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="border-t">
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('filters.priceRange')}</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('filters.sortBy')}</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t('filters.newest')}</SelectItem>
                      <SelectItem value="price-asc">{t('filters.priceAsc')}</SelectItem>
                      <SelectItem value="price-desc">{t('filters.priceDesc')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 flex items-end justify-end gap-2">
                  <Button variant="ghost" onClick={clearAllFilters} className="rounded-xl">
                    {t('filters.clearAll')}
                  </Button>
                  <Button onClick={() => setShowFilters(false)} className="rounded-xl bg-[#FF385C] hover:bg-[#E31C5F]">
                    {t('filters.showResults', { count: propertiesResult.total })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              {selectedCity ? t('properties.inCity', { city: selectedCity }) : t('properties.title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('properties.resultsCount', { count: propertiesResult.total })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <div className="hidden md:flex items-center gap-2">
                {selectedCity && (
                  <Badge variant="secondary" className="gap-1 rounded-full">
                    {selectedCity}
                    <button onClick={() => setSelectedCity(undefined)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="gap-1 rounded-full">
                    {t(propertyCategories.find((c) => c.value === selectedCategory)?.labelKey || '')}
                    <button onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
            <div className="flex rounded-xl border overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 ${viewMode === 'map' ? 'bg-muted' : 'hover:bg-muted'}`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {propertiesResult.properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}

            {propertiesResult.properties.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 mx-auto mb-6 bg-muted flex items-center justify-center rounded-2xl">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('properties.noResults')}</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {t('properties.noResultsDescription')}
                </p>
                <Button variant="outline" onClick={clearAllFilters} className="rounded-xl">
                  {t('filters.clearAll')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
            <div className="overflow-y-auto space-y-4 pr-4">
              {propertiesResult.properties.map((property) => (
                <PropertyCard key={property._id} property={property} variant="horizontal" />
              ))}
            </div>
            <Card className="flex items-center justify-center rounded-xl">
              <CardContent className="text-center">
                <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('properties.mapComingSoon')}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Load More */}
        {propertiesResult.properties.length > 0 && propertiesResult.properties.length < propertiesResult.total && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-xl">
              {t('common.loadMore')}
            </Button>
          </div>
        )}
      </div>

      {/* Floating Map Button - Mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden">
        <Button
          onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
          className="shadow-lg rounded-full bg-[#FF385C] hover:bg-[#E31C5F]"
        >
          {viewMode === 'grid' ? (
            <>
              <Map className="w-4 h-4 mr-2" />
              {t('properties.showMap')}
            </>
          ) : (
            <>
              <Grid3X3 className="w-4 h-4 mr-2" />
              {t('properties.showList')}
            </>
          )}
        </Button>
      </div>
    </PublicLayout>
  );
}
