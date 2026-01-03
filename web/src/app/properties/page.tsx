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

const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Buea', 'Kribi', 'Limbé', 'Bamenda', 'Garoua'];

const propertyCategories = [
  { value: 'all', label: 'Tous', icon: Grid3X3 },
  { value: 'studio', label: 'Studios', icon: Hotel },
  { value: 'apartment', label: 'Appartements', icon: Building2 },
  { value: 'house', label: 'Maisons', icon: Home },
  { value: 'villa', label: 'Villas', icon: Castle },
  { value: 'commercial', label: 'Commerces', icon: Warehouse },
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
    amenities: { wifi: true, ac: true, elevator: true },
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

  // Filter properties based on selected criteria
  const propertiesResult = useMemo(() => {
    let filtered = allProperties;

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.neighborhood.toLowerCase().includes(query)
      );
    }

    // City filter
    if (selectedCity) {
      filtered = filtered.filter((p) => p.city === selectedCity);
    }

    // Category filter
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

    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map((v) => (v === '' ? undefined : Number(v)));
      if (priceRange.endsWith('+')) {
        const minValue = Number(priceRange.replace('+', ''));
        filtered = filtered.filter((p) => p.rentAmount >= minValue);
      } else if (min !== undefined && max !== undefined) {
        filtered = filtered.filter((p) => p.rentAmount >= min && p.rentAmount <= max);
      }
    }

    // Sort
    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.rentAmount - b.rentAmount);
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.rentAmount - a.rentAmount);
    }

    return { properties: filtered, total: filtered.length };
  }, [searchQuery, selectedCity, selectedCategory, priceRange, sortBy]);

  const activeFiltersCount = [selectedCity, selectedCategory !== 'all' ? selectedCategory : null, priceRange !== 'all' ? priceRange : null].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCity(undefined);
    setSelectedCategory('all');
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="text-xl font-bold text-primary">Piol</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/properties"
                className="text-neutral-900 font-medium border-b-2 border-primary pb-1"
              >
                {t('nav.properties')}
              </Link>
              <Link href="/about" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                {t('nav.contact')}
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/properties/new">
                <Button variant="ghost" className="hidden sm:flex text-neutral-700">
                  {t('nav.becomeHost')}
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="border-neutral-300">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary-hover">
                  {t('nav.register')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Search bar - Airbnb style */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="flex items-center bg-white border border-neutral-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 flex items-center px-6 py-3">
                  <Search className="w-5 h-5 text-neutral-500 mr-3" />
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-neutral-900 placeholder:text-neutral-500"
                  />
                </div>
                <div className="hidden sm:flex items-center border-l border-neutral-300 px-4 py-3">
                  <MapPin className="w-4 h-4 text-neutral-500 mr-2" />
                  <Select
                    value={selectedCity ?? 'all'}
                    onValueChange={(v) => setSelectedCity(v === 'all' ? undefined : v)}
                  >
                    <SelectTrigger className="border-none shadow-none p-0 h-auto min-w-[120px]">
                      <SelectValue placeholder={t('search.allCities')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('search.allCities')}</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="m-2 rounded-full bg-primary hover:bg-primary-hover h-12 w-12 p-0"
                  onClick={() => {}}
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="border-t border-neutral-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                {propertyCategories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.value;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-neutral-100 text-neutral-900'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                      <span className="text-xs font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 border-neutral-300 ${
                    activeFiltersCount > 0 ? 'border-primary text-primary' : ''
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('filters.title')}</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>

                <div className="hidden md:flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 ${viewMode === 'map' ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
                  >
                    <Map className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extended filters panel */}
        {showFilters && (
          <div className="border-t border-neutral-200 bg-white">
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('filters.priceRange')}
                  </label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('filters.sortBy')}
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
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
                  <Button variant="ghost" onClick={clearAllFilters} className="text-neutral-600">
                    {t('filters.clearAll')}
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="bg-neutral-900 hover:bg-neutral-800"
                  >
                    {t('filters.showResults', { count: propertiesResult.total })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {selectedCity ? `${t('properties.inCity', { city: selectedCity })}` : t('properties.title')}
            </h1>
            <p className="text-neutral-600 mt-1">
              {t('properties.resultsCount', { count: propertiesResult.total })}
            </p>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {selectedCity && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-sm">
                  {selectedCity}
                  <button onClick={() => setSelectedCity(undefined)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-sm">
                  {propertyCategories.find((c) => c.value === selectedCategory)?.label}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {priceRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-sm">
                  {priceRanges.find((r) => r.value === priceRange)?.label}
                  <button onClick={() => setPriceRange('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Properties grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {propertiesResult?.properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}

            {propertiesResult?.properties.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {t('properties.noResults')}
                </h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  {t('properties.noResultsDescription')}
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  {t('filters.clearAll')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
            {/* Properties list */}
            <div className="overflow-y-auto space-y-4 pr-4">
              {propertiesResult?.properties.map((property) => (
                <PropertyCard key={property._id} property={property} variant="horizontal" />
              ))}
            </div>

            {/* Map placeholder */}
            <div className="bg-neutral-200 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">{t('properties.mapComingSoon')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Load more */}
        {propertiesResult?.properties.length > 0 && propertiesResult?.properties.length < propertiesResult?.total && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              {t('common.loadMore')}
            </Button>
          </div>
        )}
      </main>

      {/* Floating map button - mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden">
        <Button
          onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
          className="bg-neutral-900 hover:bg-neutral-800 rounded-full shadow-lg px-6"
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
    </div>
  );
}
