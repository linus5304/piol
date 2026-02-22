'use client';

import { Button } from '@/components/ui/button';
import { InlineStats } from '@/components/ui/inline-stats';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import {
  StatusDot,
  propertyStatusConfig,
  verificationStatusConfig,
} from '@/components/ui/status-dot';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA, formatDate } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import { usePaginatedQuery } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import { Building2, Calendar, CheckCircle, ImageIcon, Loader2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

function formatPropertyCurrency(amount: number, locale: string): string {
  return formatCurrencyFCFA(amount, locale);
}

function formatPropertyDate(timestamp: number, locale: string): string {
  return formatDate(timestamp, locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const statusFilterOptions = [
  'all',
  'active',
  'draft',
  'pending_verification',
  'rented',
  'archived',
] as const;

type StatusFilterValue = (typeof statusFilterOptions)[number];

export default function PropertiesPage() {
  const t = useTranslations();
  const locale = parseAppLocale(useLocale());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');

  const {
    results: properties,
    status: paginationStatus,
    loadMore,
  } = usePaginatedQuery(api.properties.getMyProperties, {}, { initialNumItems: 25 });

  const statusFilterLabels = useMemo<Record<StatusFilterValue, string>>(
    () => ({
      all: t('myProperties.filterAll'),
      active: t('myProperties.filterActive'),
      draft: t('myProperties.filterDraft'),
      pending_verification: t('myProperties.filterPendingVerification'),
      rented: t('myProperties.filterRented'),
      archived: t('myProperties.filterArchived'),
    }),
    [t]
  );

  const translatedPropertyStatusConfig = useMemo<Record<string, { dot: string; label: string }>>(
    () => ({
      active: { ...propertyStatusConfig.active, label: t('myProperties.statusActive') },
      draft: { ...propertyStatusConfig.draft, label: t('myProperties.statusDraft') },
      pending_verification: {
        ...propertyStatusConfig.pending_verification,
        label: t('myProperties.statusPendingVerification'),
      },
      verified: { ...propertyStatusConfig.verified, label: t('myProperties.statusVerified') },
      rented: { ...propertyStatusConfig.rented, label: t('myProperties.statusRented') },
      archived: { ...propertyStatusConfig.archived, label: t('myProperties.statusArchived') },
    }),
    [t]
  );

  const translatedVerificationConfig = useMemo<Record<string, { dot: string; label: string }>>(
    () => ({
      approved: {
        ...verificationStatusConfig.approved,
        label: t('myProperties.verificationApproved'),
      },
      pending: {
        ...verificationStatusConfig.pending,
        label: t('myProperties.verificationPending'),
      },
      in_progress: {
        ...verificationStatusConfig.in_progress,
        label: t('myProperties.verificationInProgress'),
      },
      rejected: {
        ...verificationStatusConfig.rejected,
        label: t('myProperties.verificationRejected'),
      },
    }),
    [t]
  );

  const propertyTypeLabels = useMemo<Record<string, string>>(
    () => ({
      studio: t('propertyTypes.studio'),
      '1br': t('propertyTypes.1br'),
      '2br': t('propertyTypes.2br'),
      '3br': t('propertyTypes.3br'),
      '4br': t('propertyTypes.4br'),
      house: t('propertyTypes.house'),
      apartment: t('propertyTypes.apartment'),
      villa: t('propertyTypes.villa'),
    }),
    [t]
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      active: properties.filter((p) => p.status === 'active').length,
      draft: properties.filter((p) => p.status === 'draft').length,
      pending_verification: properties.filter((p) => p.status === 'pending_verification').length,
    };
  }, [properties]);

  const isLoading = paginationStatus === 'LoadingFirstPage';

  return (
    <div className="space-y-6">
      {/* Header area — tighter grouping */}
      <div className="space-y-3">
        <PageHeader
          title={t('myProperties.title')}
          count={isLoading ? undefined : properties.length}
          action={{
            label: t('myProperties.addProperty'),
            icon: Plus,
            href: '/dashboard/properties/new',
          }}
        />

        {!isLoading && (
          <InlineStats
            items={[
              {
                count: statusCounts.active,
                label: t('myProperties.statusActive'),
                dotColor: 'bg-success',
              },
              {
                count: statusCounts.draft,
                label: t('myProperties.statusDraft'),
                dotColor: 'bg-muted-foreground',
              },
              {
                count: statusCounts.pending_verification,
                label: t('myProperties.statusPendingVerification'),
                dotColor: 'bg-warning',
              },
            ]}
          />
        )}

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('myProperties.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {statusFilterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatusFilter(option)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  statusFilter === option
                    ? 'bg-foreground text-background'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                {statusFilterLabels[option]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-background rounded-lg border">
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProperties.length === 0 && (
        <div className="text-center py-16 bg-background rounded-lg border">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t('myProperties.noProperties')}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? t('myProperties.noFilterResults')
              : t('myProperties.emptyStateDesc')}
          </p>
          <Link href="/dashboard/properties/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('myProperties.addProperty')}
            </Button>
          </Link>
        </div>
      )}

      {/* Desktop Table View */}
      {!isLoading && filteredProperties.length > 0 && (
        <>
          {/* Desktop: Table */}
          <div className="hidden md:block bg-background rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12" />
                  <TableHead>{t('myProperties.property')}</TableHead>
                  <TableHead>{t('myProperties.type')}</TableHead>
                  <TableHead className="text-right">{t('myProperties.rent')}</TableHead>
                  <TableHead>{t('myProperties.status')}</TableHead>
                  <TableHead>{t('myProperties.verification')}</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => {
                  const imageUrl = property.placeholderImages?.[0] ?? null;
                  return (
                    <TableRow key={property._id} className="hover:bg-muted/50 cursor-pointer">
                      <TableCell className="w-12 p-2">
                        <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/properties/${property._id}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {property.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {property.neighborhood ? `${property.neighborhood}, ` : ''}
                          {property.city}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {propertyTypeLabels[property.propertyType] || property.propertyType}
                      </TableCell>
                      <TableCell className="text-right font-medium font-mono tabular-nums text-sm">
                        {formatPropertyCurrency(property.rentAmount, locale)}
                        {t('myProperties.perMonth')}
                      </TableCell>
                      <TableCell>
                        <StatusDot
                          status={property.status}
                          config={translatedPropertyStatusConfig}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusDot
                          status={property.verificationStatus}
                          config={translatedVerificationConfig}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link href={`/dashboard/properties/${property._id}`}>
                            <Button variant="outline" size="sm">
                              {t('myProperties.edit')}
                            </Button>
                          </Link>
                          {property.status === 'active' && (
                            <Link href={`/properties/${property._id}`}>
                              <Button variant="ghost" size="sm">
                                {t('myProperties.view')}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile: Card List */}
          <div className="md:hidden bg-background rounded-lg border divide-y">
            {filteredProperties.map((property) => {
              const imageUrl = property.placeholderImages?.[0] ?? null;

              return (
                <div key={property._id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/dashboard/properties/${property._id}`}
                          className="font-medium text-foreground hover:text-primary truncate"
                        >
                          {property.title}
                        </Link>
                        <StatusDot
                          status={property.status}
                          config={translatedPropertyStatusConfig}
                          size="sm"
                          className="shrink-0"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {property.neighborhood ? `${property.neighborhood}, ` : ''}
                        {property.city} &bull;{' '}
                        {propertyTypeLabels[property.propertyType] || property.propertyType}
                      </p>
                      <p className="text-sm font-medium text-foreground mt-1 font-mono tabular-nums">
                        {formatPropertyCurrency(property.rentAmount, locale)}
                        {t('myProperties.perMonth')}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {t('myProperties.createdOn')}{' '}
                          {formatPropertyDate(property._creationTime, locale)}
                        </span>
                        {property.publishedAt && (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {t('myProperties.published')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More */}
          {paginationStatus === 'CanLoadMore' && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={() => loadMore(25)}>
                {t('common.loadMore')}
              </Button>
            </div>
          )}
          {paginationStatus === 'LoadingMore' && (
            <div className="flex justify-center pt-4">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
