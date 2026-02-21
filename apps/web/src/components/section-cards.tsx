'use client';

import { Card, CardContent } from '@/components/ui/card';
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA, formatNumber } from '@/lib/i18n-format';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import { Building2, Eye, Heart, MessageSquare, Search, Wallet } from 'lucide-react';

interface SectionCardsProps {
  role: 'renter' | 'landlord';
  stats?: {
    properties?: number;
    views?: number;
    messages?: number;
    revenue?: number;
    favorites?: number;
    searches?: number;
  };
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          {Icon && (
            <div className="rounded-lg bg-muted p-2.5">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SectionCards({ role, stats = {} }: SectionCardsProps) {
  const t = useTranslations();
  const locale = parseAppLocale(useLocale());

  if (role === 'landlord') {
    return (
      <div className="space-y-4">
        <h2 className="text-section-label">{t('sectionCards.landlordTitle')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t('sectionCards.totalRevenue')}
            value={formatCurrencyFCFA(stats.revenue ?? 0, locale)}
            icon={Wallet}
          />
          <StatCard
            label={t('sectionCards.activeProperties')}
            value={stats.properties ?? 0}
            icon={Building2}
          />
          <StatCard
            label={t('sectionCards.messages')}
            value={stats.messages ?? 0}
            icon={MessageSquare}
          />
          <StatCard
            label={t('sectionCards.totalViews')}
            value={formatNumber(stats.views ?? 0, locale)}
            icon={Eye}
          />
        </div>
      </div>
    );
  }

  // Renter stats
  return (
    <div className="space-y-4">
      <h2 className="text-section-label">{t('sectionCards.renterTitle')}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('sectionCards.favorites')} value={stats.favorites ?? 0} icon={Heart} />
        <StatCard label={t('sectionCards.searches')} value={stats.searches ?? 0} icon={Search} />
        <StatCard
          label={t('sectionCards.messages')}
          value={stats.messages ?? 0}
          icon={MessageSquare}
        />
        <StatCard label={t('sectionCards.propertiesViewed')} value={stats.views ?? 0} icon={Eye} />
      </div>
    </div>
  );
}
