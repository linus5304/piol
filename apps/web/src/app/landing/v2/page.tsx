'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { PropertyCard } from '@/components/properties';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Home,
  MapPin,
  MessageSquare,
  MoveRight,
  Search,
  Shield,
  Smartphone,
  Wallet,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

/**
 * V2 - "Bold Editorial" Landing Page
 *
 * Stripe-inspired: Giant typography, asymmetric layout, gradient accents,
 * confident and sophisticated editorial design.
 */
export default function LandingV2() {
  const t = useTranslations('home');
  const featuredProperties = useQuery(api.properties.getFeaturedProperties, { limit: 3 });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ================================================================
          HERO - Giant typography with asymmetric layout
          ================================================================ */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Disponible au Cameroun</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
                La location
                <br />
                <span className="text-primary">réinventée.</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
                Annonces vérifiées. Paiement Mobile Money. Trouvez votre logement en toute
                confiance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/properties">
                  <Button
                    size="lg"
                    className="h-14 px-8 rounded-xl text-base font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-lg"
                  >
                    Explorer les annonces
                    <MoveRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/sign-up?role=landlord">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 rounded-xl text-base font-semibold"
                  >
                    Je suis propriétaire
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex gap-12 pt-8 border-t border-border/50">
                <div>
                  <div className="text-4xl font-bold tracking-tight">1K+</div>
                  <div className="text-sm text-muted-foreground mt-1">Logements</div>
                </div>
                <div>
                  <div className="text-4xl font-bold tracking-tight">5K+</div>
                  <div className="text-sm text-muted-foreground mt-1">Utilisateurs</div>
                </div>
                <div>
                  <div className="text-4xl font-bold tracking-tight">98%</div>
                  <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right - Stacked cards */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Background card */}
                <div className="absolute -top-4 -left-4 right-8 bottom-8 rounded-3xl bg-primary/5 border border-primary/10" />

                {/* Main visual card */}
                <Card className="relative rounded-3xl overflow-hidden border-0 shadow-2xl">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-foreground to-foreground/80 p-8 text-background">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                            <Home className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <span className="font-semibold">Piol</span>
                        </div>
                        <Badge className="rounded-full bg-primary/20 text-primary border-0">
                          Vérifié
                        </Badge>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 rounded-2xl bg-background/5 border border-background/10">
                          <div className="text-sm text-background/60 mb-1">
                            Appartement 3 chambres
                          </div>
                          <div className="text-xl font-bold">Akwa, Douala</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold text-primary">250,000</span>
                            <span className="text-background/60">FCFA/mois</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl bg-background/5 text-center">
                            <div className="text-lg font-bold">3</div>
                            <div className="text-xs text-background/60">Chambres</div>
                          </div>
                          <div className="p-3 rounded-xl bg-background/5 text-center">
                            <div className="text-lg font-bold">2</div>
                            <div className="text-xs text-background/60">SDB</div>
                          </div>
                          <div className="p-3 rounded-xl bg-background/5 text-center">
                            <div className="text-lg font-bold">120</div>
                            <div className="text-xs text-background/60">m²</div>
                          </div>
                        </div>

                        <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-base font-semibold">
                          Contacter le propriétaire
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating notification card */}
                <div className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-card border shadow-xl max-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-medium text-success">Paiement sécurisé</span>
                  </div>
                  <div className="text-sm font-semibold">250,000 FCFA</div>
                  <div className="text-xs text-muted-foreground">via MTN MoMo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES - Editorial grid with large icons
          ================================================================ */}
      <section className="py-20 md:py-28 border-t">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Conçu pour le
              <br />
              <span className="text-primary">marché camerounais</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Chaque fonctionnalité résout un vrai problème rencontré par les locataires et
              propriétaires au Cameroun.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Large feature card */}
            <Card className="rounded-3xl border-border/50 overflow-hidden md:row-span-2 group card-hover">
              <CardContent className="p-10 h-full flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                  <Shield className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Escrow Mobile Money</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  Vos fonds sont protégés jusqu'à la remise des clés. Payez via MTN MoMo ou Orange
                  Money en toute sécurité. Plus besoin de transporter des millions de FCFA en
                  espèces.
                </p>
                <div className="flex items-center gap-2 mt-8 text-primary font-semibold">
                  En savoir plus <ArrowUpRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            {/* Smaller feature cards */}
            <Card className="rounded-3xl border-border/50 card-hover group">
              <CardContent className="p-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <CheckCircle2 className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Vérification terrain</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Notre équipe visite chaque propriété. Photos réelles, informations confirmées,
                      zéro arnaque.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/50 card-hover group">
              <CardContent className="p-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <MessageSquare className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Messagerie intégrée</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Discutez directement avec les propriétaires. Historique complet en cas de
                      litige.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom features row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {[
              { icon: Wallet, label: 'MTN MoMo' },
              { icon: Smartphone, label: 'Orange Money' },
              { icon: Zap, label: 'Temps réel' },
              { icon: Search, label: 'Recherche avancée' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="p-5 rounded-2xl bg-muted/50 border border-border/50 text-center hover:border-primary/30 transition-colors"
              >
                <Icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PROPERTIES - Featured listings
          ================================================================ */}
      <section className="py-20 md:py-28 bg-muted/30 border-y">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Annonces récentes</h2>
              <p className="text-lg text-muted-foreground mt-2">
                Des logements de qualité, vérifiés par notre équipe
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline" size="lg" className="rounded-xl group font-semibold">
                Tout parcourir
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties === undefined ? (
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
              <div className="col-span-3 text-center py-16">
                <p className="text-muted-foreground">
                  Aucune annonce pour le moment.{' '}
                  <Link href="/properties" className="text-primary hover:underline">
                    Voir toutes les propriétés
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA - Bold dark section
          ================================================================ */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Votre prochain <span className="text-primary">chez-vous</span> est à un clic.
            </h2>
            <p className="text-background/60 text-lg mb-10 max-w-xl mx-auto">
              Créez votre compte gratuitement et commencez à explorer des milliers de logements
              vérifiés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-base font-semibold shadow-2xl"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 rounded-xl text-base border-background/20 text-background hover:bg-background/10"
                >
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  );
}
