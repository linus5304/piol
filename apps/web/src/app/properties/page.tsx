'use client';

import { PublicLayout } from '@/components/layouts/public-layout';
import { PropertyCard } from '@/components/property-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
  Building2,
  Castle,
  Grid3X3,
  Home,
  Hotel,
  Map as MapIcon,
  MapPin,
  Search,
  SlidersHorizontal,
  Warehouse,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

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

// Map UI sort values to Convex format
const sortByMap: Record<string, 'price_asc' | 'price_desc' | 'newest' | 'oldest'> = {
  newest: 'newest',
  'price-asc': 'price_asc',
  'price-desc': 'price_desc',
};

// Parse price range string into min/max values
function parsePriceRange(range: string): { minPrice?: number; maxPrice?: number } {
  if (range === 'all') return {};
  if (range.endsWith('+')) {
    return { minPrice: Number(range.replace('+', '')) };
  }
  const [min, max] = range.split('-').map(Number);
  return { minPrice: min, maxPrice: max };
}

// Type for property data (matches PropertyCard props)
type PropertyWithLandlord = {
  _id: string;
  _creationTime?: number;
  title: string;
  propertyType: string;
  rentAmount: number;
  currency: string;
  city: string;
  neighborhood?: string;
  verificationStatus?: string;
  status?: string;
  images?: { url?: string; storageId?: string }[];
  amenities?: {
    wifi?: boolean;
    parking?: boolean;
    ac?: boolean;
    security?: boolean;
    pool?: boolean;
    balcony?: boolean;
    garden?: boolean;
  };
  bedrooms?: number;
  bathrooms?: number;
  landlordId?: string;
  landlordName?: string;
  landlordVerified?: boolean;
  landlord?: {
    _id: string;
    firstName: string;
    lastName: string;
    idVerified: boolean;
  } | null;
};

// Property card skeleton for loading state
function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  // Build query args from filter state
  const { minPrice, maxPrice } = parsePriceRange(priceRange);
  const convexSortBy = sortByMap[sortBy] || 'newest';

  // Map category to propertyType (null means no filter)
  // Note: 'apartment' category includes apartment, 1br, 2br, 3br, 4br but Convex
  // filters by exact type, so we only pass specific types to the query
  const propertyTypeArg = useMemo(() => {
    if (selectedCategory === 'all' || selectedCategory === 'apartment') return undefined;
    if (['studio', 'house', 'villa'].includes(selectedCategory)) {
      return selectedCategory as 'studio' | 'house' | 'villa';
    }
    return undefined;
  }, [selectedCategory]);

  // Use search query when user types, otherwise use listProperties
  const searchResults = useQuery(
    api.properties.searchProperties,
    searchQuery.trim().length >= 2
      ? {
          searchQuery: searchQuery.trim(),
          city: selectedCity,
          propertyType: propertyTypeArg,
          limit: 50,
        }
      : 'skip'
  );

  const listResults = useQuery(
    api.properties.listProperties,
    searchQuery.trim().length < 2
      ? {
          city: selectedCity,
          propertyType: propertyTypeArg,
          minPrice,
          maxPrice,
          sortBy: convexSortBy,
          limit: 50,
        }
      : 'skip'
  );

  // Saved properties functionality
  const savedPropertyIds = useQuery(api.savedProperties.getSavedPropertyIds);
  const toggleSaveProperty = useMutation(api.savedProperties.toggleSaveProperty);

  const savedPropertyIdSet = useMemo(() => {
    return new Set(savedPropertyIds ?? []);
  }, [savedPropertyIds]);

  const handleToggleSave = useCallback(
    (propertyId: string) => {
      toggleSaveProperty({ propertyId: propertyId as Id<'properties'> });
    },
    [toggleSaveProperty]
  );

  // Combine results based on which query is active
  const propertiesResult = useMemo((): {
    properties: PropertyWithLandlord[];
    total: number;
    isLoading: boolean;
  } => {
    const isSearching = searchQuery.trim().length >= 2;

    if (isSearching) {
      if (searchResults === undefined) {
        return { properties: [], total: 0, isLoading: true };
      }
      // Filter search results by price range client-side (search query doesn't support it)
      let properties = searchResults as PropertyWithLandlord[];
      if (minPrice !== undefined) {
        properties = properties.filter((p) => p.rentAmount >= minPrice);
      }
      if (maxPrice !== undefined) {
        properties = properties.filter((p) => p.rentAmount <= maxPrice);
      }
      // Apply apartment category filter client-side (includes 1br, 2br, etc)
      if (selectedCategory === 'apartment') {
        properties = properties.filter(
          (p) =>
            p.propertyType === 'apartment' ||
            p.propertyType === '1br' ||
            p.propertyType === '2br' ||
            p.propertyType === '3br' ||
            p.propertyType === '4br'
        );
      }
      return { properties, total: properties.length, isLoading: false };
    }

    if (listResults === undefined) {
      return { properties: [], total: 0, isLoading: true };
    }

    // Apply apartment category filter client-side
    let properties = listResults.properties as PropertyWithLandlord[];
    if (selectedCategory === 'apartment') {
      properties = properties.filter(
        (p) =>
          p.propertyType === 'apartment' ||
          p.propertyType === '1br' ||
          p.propertyType === '2br' ||
          p.propertyType === '3br' ||
          p.propertyType === '4br'
      );
    }

    return {
      properties,
      total: properties.length,
      isLoading: false,
    };
  }, [searchQuery, searchResults, listResults, minPrice, maxPrice, selectedCategory]);

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
            <Select
              value={selectedCity ?? 'all'}
              onValueChange={(v) => setSelectedCity(v === 'all' ? undefined : v)}
            >
              <SelectTrigger className="w-40 hidden sm:flex rounded-xl">
                <MapPin className="h-4 w-4 mr-2" />
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
                  type="button"
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
                  <span className="block text-sm font-medium mb-2">{t('filters.priceRange')}</span>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="rounded-xl" aria-label={t('filters.priceRange')}>
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
                  <span className="block text-sm font-medium mb-2">{t('filters.sortBy')}</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="rounded-xl" aria-label={t('filters.sortBy')}>
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
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="rounded-xl bg-[#FF385C] hover:bg-[#E31C5F]"
                  >
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
              {selectedCity
                ? t('properties.inCity', { city: selectedCity })
                : t('properties.title')}
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
                    <button type="button" onClick={() => setSelectedCity(undefined)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="gap-1 rounded-full">
                    {t(
                      propertyCategories.find((c) => c.value === selectedCategory)?.labelKey || ''
                    )}
                    <button type="button" onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
            <div className="flex rounded-xl border overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`p-2 ${viewMode === 'map' ? 'bg-muted' : 'hover:bg-muted'}`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Loading skeletons */}
            {propertiesResult.isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                <PropertyCardSkeleton key={`skeleton-${i}`} />
              ))}

            {/* Property cards */}
            {!propertiesResult.isLoading &&
              propertiesResult.properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isSaved={savedPropertyIdSet.has(property._id as Id<'properties'>)}
                  onToggleSave={handleToggleSave}
                />
              ))}

            {/* Empty state */}
            {!propertiesResult.isLoading && propertiesResult.properties.length === 0 && (
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
              {/* Loading skeletons for horizontal view */}
              {propertiesResult.isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                  <Skeleton key={`h-skeleton-${i}`} className="h-32 w-full rounded-xl" />
                ))}

              {/* Property cards */}
              {!propertiesResult.isLoading &&
                propertiesResult.properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    variant="horizontal"
                    isSaved={savedPropertyIdSet.has(property._id as Id<'properties'>)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
            </div>
            <Card className="flex items-center justify-center rounded-xl">
              <CardContent className="text-center">
                <MapIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('properties.mapComingSoon')}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Load More */}
        {propertiesResult.properties.length > 0 &&
          propertiesResult.properties.length < propertiesResult.total && (
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
              <MapIcon className="w-4 h-4 mr-2" />
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
