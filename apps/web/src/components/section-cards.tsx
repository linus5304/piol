'use client';

import { TrendingUp, TrendingDown, Building2, Eye, MessageSquare, Heart, Search, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Propriétés actives</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stats.properties ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Publiées sur Piol</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vues ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stats.views ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                +0%
              </Badge>
              <span className="text-muted-foreground">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Messages non lus</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stats.messages ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>De locataires potentiels</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenus ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stats.revenue ?? 0} FCFA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
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
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Favoris</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.favorites ?? 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>Propriétés sauvegardées</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Recherches</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.searches ?? 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>Ces 7 derniers jours</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Messages</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.messages ?? 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>Conversations actives</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Vues récentes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.views ?? 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>Propriétés consultées</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
