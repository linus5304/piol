'use client';

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

interface StatItemProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

function StatItem({
  label,
  value,
  change,
  changeLabel = 'depuis la semaine dernière',
}: StatItemProps) {
  const isPositive = change !== undefined && change >= 0;
  const changeText = change !== undefined ? `${isPositive ? '+' : ''}${change}%` : null;

  return (
    <div className="border-r border-border last:border-r-0 pr-8 last:pr-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</dd>
      {changeText && (
        <dd className="mt-2 flex items-center gap-2 text-sm">
          <span
            className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
              isPositive ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
            }`}
          >
            {changeText}
          </span>
          <span className="text-muted-foreground">{changeLabel}</span>
        </dd>
      )}
    </div>
  );
}

export function SectionCards({ role, stats = {} }: SectionCardsProps) {
  if (role === 'landlord') {
    return (
      <div className="px-4 lg:px-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">Aperçu</h2>
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatItem
            label="Revenus total"
            value={`${(stats.revenue ?? 0).toLocaleString()} FCFA`}
            change={4.5}
          />
          <StatItem label="Propriétés actives" value={stats.properties ?? 0} change={8.1} />
          <StatItem label="Messages" value={stats.messages ?? 0} change={-2.0} />
          <StatItem label="Vues" value={(stats.views ?? 0).toLocaleString()} change={21.2} />
        </dl>
      </div>
    );
  }

  // Renter stats
  return (
    <div className="px-4 lg:px-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-4">Aperçu</h2>
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem label="Favoris" value={stats.favorites ?? 0} change={12.5} />
        <StatItem label="Recherches" value={stats.searches ?? 0} change={-5.2} />
        <StatItem label="Messages" value={stats.messages ?? 0} change={8.1} />
        <StatItem label="Propriétés vues" value={stats.views ?? 0} change={15.3} />
      </dl>
    </div>
  );
}
