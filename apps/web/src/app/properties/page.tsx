'use client';

import { PublicLayout } from '@/components/layouts/public-layout';
import { PropertyCard, PropertyMap } from '@/components/properties';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useEnsureUser } from '@/hooks/use-ensure-user';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
  ArrowRight,
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
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const cities = [
  'Douala',
  'Yaound\u00e9',
  'Bafoussam',
  'Buea',
  'Kribi',
  'Limb\u00e9',
  'Bamenda',
  'Garoua',
];

const propertyCategories = [
  { value: 'all', labelKey: 'categories.all', icon: Grid3X3 },
  { value: 'studio', labelKey: 'categories.studios', icon: Hotel },
  { value: 'apartment', labelKey: 'categories.apartments', icon: Building2 },
  { value: 'house', labelKey: 'categories.houses', icon: Home },
  { value: 'villa', labelKey: 'categories.villas', icon: Castle },
  { value: 'commercial', labelKey: 'categories.commercial', icon: Warehouse },
];

const priceRanges = [
  { value: 'all', labelKey: 'filters.allPrices' },
  { value: '0-50000', labelKey: 'filters.under50k' },
  { value: '50000-100000', labelKey: 'filters.range50to100k' },
  { value: '100000-200000', labelKey: 'filters.range100to200k' },
  { value: '200000-500000', labelKey: 'filters.range200to500k' },
  { value: '500000+', labelKey: 'filters.above500k' },
];

const sortByMap: Record<string, 'price_asc' | 'price_desc' | 'newest' | 'oldest'> = {
  newest: 'newest',
  'price-asc': 'price_asc',
  'price-desc': 'price_desc',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parsePriceRange(range: string): { minPrice?: number; maxPrice?: number } {
  if (range === 'all') return {};
  if (range.endsWith('+')) {
    return { minPrice: Number(range.replace('+', '')) };
  }
  const [min, max] = range.split('-').map(Number);
  return { minPrice: min, maxPrice: max };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  location?: { latitude: number; longitude: number };
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

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function PropertyCardSkeleton() {
  return (
    <div className="dusk-card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <div className="pt-2.5 border-t border-border/50">
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Content
// ---------------------------------------------------------------------------

function PropertiesPageContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read filter state from URL params
  const searchQuery = searchParams.get('q') ?? '';
  const selectedCity = searchParams.get('city') ?? undefined;
  const selectedCategory = searchParams.get('type') ?? 'all';
  const priceRange = searchParams.get('price') ?? 'all';
  const sortBy = searchParams.get('sort') ?? 'newest';
  const viewMode = (searchParams.get('view') as 'grid' | 'map') ?? 'grid';

  // Local UI state
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // URL param helper
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const setSearchQuery = useCallback(
    (value: string) => updateParams({ q: value || null }),
    [updateParams]
  );
  const setSelectedCity = useCallback(
    (value: string | undefined) => updateParams({ city: value ?? null }),
    [updateParams]
  );
  const setSelectedCategory = useCallback(
    (value: string) => updateParams({ type: value }),
    [updateParams]
  );
  const setPriceRange = useCallback(
    (value: string) => updateParams({ price: value }),
    [updateParams]
  );
  const setSortBy = useCallback((value: string) => updateParams({ sort: value }), [updateParams]);
  const setViewMode = useCallback(
    (value: 'grid' | 'map') => updateParams({ view: value === 'grid' ? null : value }),
    [updateParams]
  );

  useEnsureUser();

  // Build query args
  const { minPrice, maxPrice } = parsePriceRange(priceRange);
  const convexSortBy = sortByMap[sortBy] || 'newest';

  const propertyTypeArg = useMemo(() => {
    if (selectedCategory === 'all' || selectedCategory === 'apartment') return undefined;
    if (['studio', 'house', 'villa'].includes(selectedCategory)) {
      return selectedCategory as 'studio' | 'house' | 'villa';
    }
    return undefined;
  }, [selectedCategory]);

  // Queries
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

  // Saved properties
  const savedPropertyIds = useQuery(api.savedProperties.getSavedPropertyIds);
  const toggleSaveProperty = useMutation(api.savedProperties.toggleSaveProperty);

  const savedPropertyIdSet = useMemo(() => new Set(savedPropertyIds ?? []), [savedPropertyIds]);

  const handleToggleSave = useCallback(
    async (propertyId: string) => {
      try {
        await toggleSaveProperty({ propertyId: propertyId as Id<'properties'> });
      } catch {
        toast.error(t('common.error'));
      }
    },
    [toggleSaveProperty, t]
  );

  // Combine results
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
      let properties = searchResults as PropertyWithLandlord[];
      if (minPrice !== undefined) {
        properties = properties.filter((p) => p.rentAmount >= minPrice);
      }
      if (maxPrice !== undefined) {
        properties = properties.filter((p) => p.rentAmount <= maxPrice);
      }
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

    return { properties, total: properties.length, isLoading: false };
  }, [searchQuery, searchResults, listResults, minPrice, maxPrice, selectedCategory]);

  const activeFiltersCount = [
    selectedCity,
    selectedCategory !== 'all' ? selectedCategory : null,
    priceRange !== 'all' ? priceRange : null,
  ].filter(Boolean).length;

  const clearAllFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return (
    <PublicLayout showFooter={viewMode === 'grid'}>
      {/* ================================================================= */}
      {/* SEARCH & FILTERS — sticky below header                           */}
      {/* ================================================================= */}
      <div className="border-b border-border dusk-surface-blur sticky top-14 z-40">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="flex gap-2 sm:gap-3 pt-4 pb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl border-border bg-card"
              />
            </div>
            <Select
              value={selectedCity ?? 'all'}
              onValueChange={(v) => setSelectedCity(v === 'all' ? undefined : v)}
            >
              <SelectTrigger className="h-11 w-44 hidden sm:flex rounded-xl border-border">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
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
              className={`h-11 rounded-xl border-border gap-2 ${
                activeFiltersCount > 0 ? 'border-primary text-primary' : ''
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">{t('filters.title')}</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Category Tabs — horizontal scrollable pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {propertyCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.value;
              return (
                <button
                  type="button"
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all touch-target rounded-full ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t(category.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Expanded Filter Panel */}
        {showFilters && (
          <div className="border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* City — visible on mobile only (desktop has it in search bar) */}
                <div className="sm:hidden">
                  <span className="block text-sm font-medium mb-2">{t('filters.city')}</span>
                  <Select
                    value={selectedCity ?? 'all'}
                    onValueChange={(v) => setSelectedCity(v === 'all' ? undefined : v)}
                  >
                    <SelectTrigger
                      className="rounded-xl border-border"
                      aria-label={t('filters.city')}
                    >
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

                {/* Price Range */}
                <div>
                  <span className="block text-sm font-medium mb-2">{t('filters.priceRange')}</span>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger
                      className="rounded-xl border-border"
                      aria-label={t('filters.priceRange')}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {t(range.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <span className="block text-sm font-medium mb-2">{t('filters.sortBy')}</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger
                      className="rounded-xl border-border"
                      aria-label={t('filters.sortBy')}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t('filters.newest')}</SelectItem>
                      <SelectItem value="price-asc">{t('filters.priceAsc')}</SelectItem>
                      <SelectItem value="price-desc">{t('filters.priceDesc')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex items-end justify-end gap-2 sm:col-span-2 lg:col-span-1">
                  <Button variant="ghost" onClick={clearAllFilters} className="rounded-xl">
                    {t('filters.clearAll')}
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    {t('filters.showResults', { count: propertiesResult.total })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* RESULTS                                                          */}
      {/* ================================================================= */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Toolbar */}
        <div className="flex items-start sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {selectedCity
                ? t('properties.inCity', { city: selectedCity })
                : t('properties.title')}
              <span className="text-primary">.</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {t('properties.resultsCount', { count: propertiesResult.total })}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View Toggle */}
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-accent text-foreground'
                    : 'hover:bg-accent/50 text-muted-foreground'
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'map'
                    ? 'bg-accent text-foreground'
                    : 'hover:bg-accent/50 text-muted-foreground'
                }`}
                aria-label="Map view"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {selectedCity && (
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-3 py-1 text-sm font-normal"
              >
                <MapPin className="w-3 h-3" />
                {selectedCity}
                <button
                  type="button"
                  onClick={() => setSelectedCity(undefined)}
                  className="ml-0.5 hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-3 py-1 text-sm font-normal"
              >
                {t(propertyCategories.find((c) => c.value === selectedCategory)?.labelKey || '')}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="ml-0.5 hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {priceRange !== 'all' && (
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-3 py-1 text-sm font-normal"
              >
                {t(priceRanges.find((r) => r.value === priceRange)?.labelKey || '')}
                <button
                  type="button"
                  onClick={() => setPriceRange('all')}
                  className="ml-0.5 hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm text-primary font-medium hover:underline underline-offset-4"
            >
              {t('filters.clearAll')}
            </button>
          </div>
        )}

        {/* ─── Grid View ─────────────────────────────────────────── */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {/* Loading */}
            {propertiesResult.isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                <PropertyCardSkeleton key={`skeleton-${i}`} />
              ))}

            {/* Cards */}
            {!propertiesResult.isLoading &&
              propertiesResult.properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isSaved={savedPropertyIdSet.has(property._id as Id<'properties'>)}
                  onToggleSave={handleToggleSave}
                />
              ))}

            {/* Empty State */}
            {!propertiesResult.isLoading && propertiesResult.properties.length === 0 && (
              <div className="col-span-full text-center py-20">
                <div className="w-16 h-16 mx-auto mb-6 dusk-accent-badge flex items-center justify-center rounded-2xl">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">{t('properties.noResults')}</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {t('properties.noResultsDescription')}
                </p>
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="rounded-xl border-border"
                >
                  {t('filters.clearAll')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* ─── Map View ────────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
            {/* List Panel */}
            <div className="overflow-y-auto space-y-4 pr-2 lg:pr-4">
              {propertiesResult.isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <Skeleton key={`h-skeleton-${i}`} className="h-32 w-full rounded-xl" />
                ))}

              {!propertiesResult.isLoading &&
                propertiesResult.properties.map((property) => (
                  <div
                    key={property._id}
                    onMouseEnter={() => setHoveredPropertyId(property._id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                    className={`transition-all rounded-xl ${
                      hoveredPropertyId === property._id ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <PropertyCard
                      property={property}
                      variant="horizontal"
                      isSaved={savedPropertyIdSet.has(property._id as Id<'properties'>)}
                      onToggleSave={handleToggleSave}
                    />
                  </div>
                ))}

              {!propertiesResult.isLoading && propertiesResult.properties.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t('properties.noResults')}</p>
                </div>
              )}
            </div>

            {/* Map Panel */}
            <PropertyMap
              properties={propertiesResult.properties}
              hoveredPropertyId={hoveredPropertyId}
              onPropertyHover={setHoveredPropertyId}
              className="h-full min-h-[400px] lg:min-h-0"
            />
          </div>
        )}

        {/* TODO: Add pagination/load more when backend supports cursor-based pagination */}
      </div>

      {/* ================================================================= */}
      {/* BROWSE BY CITY                                                    */}
      {/* ================================================================= */}
      {viewMode === 'grid' && (
        <section className="border-t border-border py-12 md:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t('properties.browseByCity')}
              <span className="text-primary">.</span>
            </h2>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cities.map((city) => (
                <Link
                  key={city}
                  href={`/properties?city=${city}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div>
                    <div className="font-semibold">{city}</div>
                    <div className="font-mono mt-0.5 text-xs text-muted-foreground">
                      {t('nav.properties')}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* CTA                                                               */}
      {/* ================================================================= */}
      {viewMode === 'grid' && (
        <section className="py-12 md:py-16 bg-gradient-to-b from-accent/50 via-background to-background">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              {t('properties.cantFind')}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t('properties.cantFindDesc')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="dusk-btn-amber font-mono text-sm justify-center">
                {t('properties.contactUs')}
              </Link>
              <Link
                href="/sign-up?role=landlord"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
              >
                {t('properties.listYourProperty')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Mobile Map Toggle */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50">
        <Button
          onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
          className="shadow-lg rounded-full bg-primary text-primary-foreground hover:bg-primary-hover px-6"
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

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function PropertiesPageSkeleton() {
  return (
    <PublicLayout showFooter={false}>
      <div className="border-b bg-background sticky top-14 z-40">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Skeleton className="h-11 w-full mb-3 rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <Skeleton key={`cat-${i}`} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <PropertyCardSkeleton key={`prop-${i}`} />
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertiesPageSkeleton />}>
      <PropertiesPageContent />
    </Suspense>
  );
}
