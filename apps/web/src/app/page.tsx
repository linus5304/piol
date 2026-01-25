'use client';

import { PageSection, PublicLayout } from '@/components/layouts/public-layout';
import { PropertyCard } from '@/components/properties';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { ArrowRight, CheckCircle2, MapPin, Search, Shield, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');

  // Fetch featured properties from Convex
  const featuredProperties = useQuery(api.properties.getFeaturedProperties, { limit: 3 });

  // Fetch city statistics from Convex
  const cityStats = useQuery(api.properties.getCityStats);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <PageSection bordered className="py-20 md:py-28">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 text-sm">
            Plateforme de location au Cameroun
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            Trouvez votre prochain <span className="text-primary">logement</span>
          </h1>
          <p className="text-lead mb-10 max-w-xl">
            Annonces vérifiées, paiement sécurisé par Mobile Money. De Douala à Yaoundé, trouvez le
            logement idéal.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ville ou quartier..."
                className="pl-12 h-14 text-base rounded-xl border-border/50 bg-card shadow-sm focus:shadow-md transition-shadow"
              />
            </div>
            <Link href="/properties">
              <Button
                size="lg"
                className="h-14 px-8 w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow"
              >
                Rechercher
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10 pt-2">
            <div>
              <div className="text-3xl font-bold tabular-nums">1,000+</div>
              <div className="text-sm text-muted-foreground mt-0.5">Logements</div>
            </div>
            <div>
              <div className="text-3xl font-bold tabular-nums">5,000+</div>
              <div className="text-sm text-muted-foreground mt-0.5">Utilisateurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold tabular-nums">98%</div>
              <div className="text-sm text-muted-foreground mt-0.5">Satisfaction</div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Cities Section */}
      <PageSection bordered>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Villes populaires</h2>
          <Link
            href="/properties"
            className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 group"
          >
            Voir tout{' '}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cityStats === undefined ? (
            // Loading skeleton
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="rounded-xl border-border/50 bg-card">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-5 w-10 rounded-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : cityStats && cityStats.length > 0 ? (
            cityStats.slice(0, 4).map((city: { city: string; count: number }) => (
              <Link key={city.city} href={`/properties?city=${city.city}`}>
                <Card className="card-hover cursor-pointer rounded-xl border-border/50 bg-card">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-semibold">{city.city}</span>
                    </div>
                    <Badge variant="secondary" className="rounded-full text-xs px-2.5">
                      {city.count}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            // Fallback cities when no data
            <>
              {['Douala', 'Yaoundé', 'Buea', 'Kribi'].map((city) => (
                <Link key={city} href={`/properties?city=${city}`}>
                  <Card className="card-hover cursor-pointer rounded-xl border-border/50 bg-card">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-semibold">{city}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </>
          )}
        </div>
      </PageSection>

      {/* How It Works */}
      <PageSection bg="muted" bordered>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Comment ça marche</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Trouvez votre logement idéal en 3 étapes simples
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-5 text-2xl font-bold rounded-2xl shadow-lg group-hover:scale-105 transition-transform">
              1
            </div>
            <h3 className="font-semibold text-lg mb-2">Recherchez</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Filtrez par ville, prix et type de logement
            </p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-5 text-2xl font-bold rounded-2xl shadow-lg group-hover:scale-105 transition-transform">
              2
            </div>
            <h3 className="font-semibold text-lg mb-2">Contactez</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discutez avec les propriétaires vérifiés
            </p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-5 text-2xl font-bold rounded-2xl shadow-lg group-hover:scale-105 transition-transform">
              3
            </div>
            <h3 className="font-semibold text-lg mb-2">Emménagez</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Payez par Mobile Money et récupérez vos clés
            </p>
          </div>
        </div>
      </PageSection>

      {/* Featured Properties */}
      <PageSection bordered>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Annonces à la une</h2>
            <p className="text-muted-foreground mt-1">Les logements les plus populaires</p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="rounded-xl group">
              Voir tout{' '}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties === undefined ? (
            // Loading skeleton
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-2xl overflow-hidden border-border/50">
                  <Skeleton className="aspect-[4/3]" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </Card>
              ))}
            </>
          ) : featuredProperties && featuredProperties.length > 0 ? (
            featuredProperties.map((property: (typeof featuredProperties)[number]) => (
              <PropertyCard
                key={property._id}
                property={{
                  _id: property._id,
                  title: property.title,
                  propertyType: property.propertyType as
                    | 'studio'
                    | '1br'
                    | '2br'
                    | '3br'
                    | '4br'
                    | 'house'
                    | 'villa'
                    | 'apartment',
                  rentAmount: property.rentAmount,
                  currency: property.currency,
                  city: property.city,
                  neighborhood: property.neighborhood ?? undefined,
                  images: property.imageUrl ? [{ url: property.imageUrl }] : undefined,
                  status: 'active' as const,
                  verificationStatus: property.verificationStatus as
                    | 'pending'
                    | 'in_progress'
                    | 'approved'
                    | 'rejected',
                  landlordId: property.landlord?._id ?? '',
                  landlordName: property.landlord
                    ? `${property.landlord.firstName} ${property.landlord.lastName ?? ''}`.trim()
                    : undefined,
                  landlordVerified: property.landlord?.idVerified ?? false,
                }}
              />
            ))
          ) : (
            // Empty state
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">
                Aucune annonce pour le moment.{' '}
                <Link href="/properties" className="text-primary hover:underline">
                  Voir toutes les propriétés
                </Link>
              </p>
            </div>
          )}
        </div>
      </PageSection>

      {/* Features Section */}
      <PageSection bg="muted" bordered>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Pourquoi Piol</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            La plateforme de confiance pour votre recherche de logement
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="rounded-2xl border-border/50 card-hover">
            <CardContent className="p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Annonces vérifiées</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Chaque annonce est vérifiée par notre équipe pour garantir son authenticité.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50 card-hover">
            <CardContent className="p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Paiement sécurisé</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Payez en toute sécurité via Mobile Money (MTN, Orange).
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50 card-hover">
            <CardContent className="p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                <Smartphone className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Support bilingue</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Assistance en français et anglais disponible 7j/7.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* CTA Section */}
      <PageSection bg="brand">
        <div className="text-center max-w-2xl mx-auto py-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
            Prêt à trouver votre logement ?
          </h2>
          <p className="text-white/80 mb-10 text-lg">
            Rejoignez des milliers d'utilisateurs qui ont trouvé leur chez-eux avec Piol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto rounded-xl px-8 h-12 text-base shadow-lg hover:shadow-xl transition-shadow"
              >
                Créer un compte
              </Button>
            </Link>
            <Link href="/sign-up?role=landlord">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl px-8 h-12 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-primary-foreground/5"
              >
                Je suis propriétaire
              </Button>
            </Link>
          </div>
        </div>
      </PageSection>
    </PublicLayout>
  );
}
