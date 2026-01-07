'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  CreditCard,
  Eye,
  Heart,
  MessageSquare,
  Search,
  TrendingDown,
  TrendingUp,
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

export function SectionCards({ role, stats = {} }: SectionCardsProps) {
  if (role === 'landlord') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl">
          <CardHeader className="pb-2">
            <CardDescription>Propriétés actives</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stats.properties ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="p-1.5 bg-muted rounded-md">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <span>Publiées sur Piol</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-2">
            <CardDescription>Vues ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stats.views ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="gap-1 rounded-md">
                <TrendingUp className="h-3 w-3" />
                +0%
              </Badge>
              <span className="text-muted-foreground">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-2">
            <CardDescription>Messages non lus</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stats.messages ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="p-1.5 bg-muted rounded-md">
                <MessageSquare className="h-3.5 w-3.5" />
              </div>
              <span>De locataires potentiels</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-2">
            <CardDescription>Revenus ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stats.revenue ?? 0} FCFA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
              </div>
              <span>Total perçu</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renter stats
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardDescription>Favoris</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.favorites ?? 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Heart className="h-3.5 w-3.5 text-primary" />
            </div>
            <span>Propriétés sauvegardées</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardDescription>Recherches</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.searches ?? 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 bg-muted rounded-md">
              <Search className="h-3.5 w-3.5" />
            </div>
            <span>Ces 7 derniers jours</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardDescription>Messages</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.messages ?? 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 bg-muted rounded-md">
              <MessageSquare className="h-3.5 w-3.5" />
            </div>
            <span>Conversations actives</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardDescription>Vues récentes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">{stats.views ?? 0}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 bg-muted rounded-md">
              <Eye className="h-3.5 w-3.5" />
            </div>
            <span>Propriétés consultées</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
