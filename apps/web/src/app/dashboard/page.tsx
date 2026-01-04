'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionCards } from '@/components/section-cards';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  ArrowRight,
  Search,
  Building2,
  MessageSquare,
  Heart,
  Home,
  CheckCircle,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const role = (user?.unsafeMetadata?.role as string) || 'renter';
  const firstName = user?.firstName || 'Utilisateur';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Bonjour, {firstName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {role === 'landlord'
              ? 'Gérez vos propriétés et suivez vos revenus'
              : 'Trouvez votre prochain logement idéal'}
          </p>
        </div>
        {role === 'landlord' && (
          <Link href="/dashboard/properties/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle annonce
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <SectionCards role={role as 'renter' | 'landlord'} />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {role === 'landlord' ? (
            <>
              <Link href="/dashboard/properties/new" className="group">
                <Card className="h-full hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:underline">
                          Ajouter une propriété
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Publiez une nouvelle annonce
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/properties" className="group">
                <Card className="h-full hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:underline">
                          Gérer mes propriétés
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Voir et modifier vos annonces
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/messages" className="group">
                <Card className="h-full hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:underline">
                          Messages
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Répondez aux demandes
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          ) : (
            <>
              <Link href="/properties" className="group">
                <Card className="h-full hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted">
                        <Search className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:underline">
                          Rechercher
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Explorez les propriétés
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/saved" className="group">
                <Card className="h-full hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted">
                        <Heart className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:underline">
                          Mes favoris
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Propriétés sauvegardées
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/messages" className="group">
                <Card className="h-full hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:underline">
                          Messages
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Contactez les propriétaires
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Onboarding Prompt */}
      {!user?.unsafeMetadata?.onboardingCompleted && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-background">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Complétez votre profil</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ajoutez vos informations pour une meilleure expérience
                  </p>
                </div>
              </div>
              <Link href="/dashboard/settings">
                <Button>Compléter mon profil</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips for Renters */}
      {role === 'renter' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Conseils pour votre recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-muted">
                  <Home className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Visitez toujours</p>
                  <p className="text-xs text-muted-foreground">Avant de payer quoi que ce soit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-muted">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Privilégiez les vérifiés</p>
                  <p className="text-xs text-muted-foreground">Propriétés avec le badge ✓</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-muted">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Planifiez vos visites</p>
                  <p className="text-xs text-muted-foreground">Via notre messagerie sécurisée</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
