'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Eye,
  Heart,
  MessageSquare,
  Search,
  Wallet,
} from 'lucide-react';

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
  change?: number;
  changeLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function StatCard({
  label,
  value,
  change,
  changeLabel = 'vs dernière semaine',
  icon: Icon,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const changeText = change !== undefined ? `${isPositive ? '+' : ''}${change}%` : null;

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

        {changeText && (
          <div className="mt-3 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold',
                isPositive ? 'stat-change-positive' : 'stat-change-negative'
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {changeText}
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SectionCards({ role, stats = {} }: SectionCardsProps) {
  if (role === 'landlord') {
    return (
      <div className="space-y-4">
        <h2 className="text-section-label">Aperçu de votre activité</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Revenus total"
            value={`${(stats.revenue ?? 0).toLocaleString('fr-FR')} FCFA`}
            change={4.5}
            icon={Wallet}
          />
          <StatCard
            label="Propriétés actives"
            value={stats.properties ?? 0}
            change={8.1}
            icon={Building2}
          />
          <StatCard
            label="Messages"
            value={stats.messages ?? 0}
            change={-2.0}
            icon={MessageSquare}
          />
          <StatCard
            label="Vues totales"
            value={(stats.views ?? 0).toLocaleString('fr-FR')}
            change={21.2}
            icon={Eye}
          />
        </div>
      </div>
    );
  }

  // Renter stats
  return (
    <div className="space-y-4">
      <h2 className="text-section-label">Votre activité</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Favoris" value={stats.favorites ?? 0} change={12.5} icon={Heart} />
        <StatCard label="Recherches" value={stats.searches ?? 0} change={-5.2} icon={Search} />
        <StatCard label="Messages" value={stats.messages ?? 0} change={8.1} icon={MessageSquare} />
        <StatCard label="Propriétés vues" value={stats.views ?? 0} change={15.3} icon={Eye} />
      </div>
    </div>
  );
}
