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
  Globe,
  Home,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

/**
 * V5 - "Bento Grid Modern" Landing Page
 *
 * Linear-inspired: Bento-box grid layout, glassmorphism cards,
 * modern SaaS aesthetic, subtle animations, tech-forward.
 */
export default function LandingV5() {
  const t = useTranslations('home');
  const featuredProperties = useQuery(api.properties.getFeaturedProperties, { limit: 3 });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ================================================================
          HERO - Centered with gradient orb
          ================================================================ */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 text-center">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm mb-8 shadow-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </div>
            <span className="text-sm font-medium">
              <strong>23</strong> nouveaux logements cette semaine
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 text-balance">
            L'immobilier camerounais,
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              enfin digitalisé.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Piol connecte locataires et propriétaires au Cameroun avec des annonces vérifiées, des
            paiements Mobile Money sécurisés, et une messagerie intégrée.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/properties">
              <Button
                size="lg"
                className="h-13 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-base font-semibold shadow-lg"
              >
                Explorer les annonces
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-up?role=landlord">
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 rounded-xl text-base font-semibold"
              >
                Je suis propriétaire
              </Button>
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Annonces vérifiées
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Paiement escrow
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Français & English
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Temps réel
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          BENTO GRID - Feature showcase
          ================================================================ */}
      <section className="py-16 md:py-24 border-t">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5">
              Fonctionnalités
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              Tout ce dont vous avez besoin
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large card - Verification */}
            <Card className="lg:col-span-2 rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 h-full">
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-6">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3">Vérification terrain</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Chaque propriété est visitée par notre équipe. Photos authentiques, documents
                      vérifiés, propriétaire identifié. Zéro arnaque.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Visite physique', 'Photos réelles', 'Badge vérifié'].map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-full text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="relative min-h-[250px] bg-muted/30">
                    <Image
                      src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop"
                      alt="Verified property"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Small card - Real-time */}
            <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Temps réel</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  Nouvelles annonces, messages, mises à jour de paiement : tout arrive
                  instantanément.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                  Powered by Convex <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>

            {/* Small card - Mobile Money */}
            <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-6">
                  <Wallet className="h-6 w-6 text-warning" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Mobile Money</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  MTN MoMo et Orange Money. Les moyens de paiement que les Camerounais utilisent
                  déjà.
                </p>
                <div className="mt-6 flex gap-2">
                  <Badge variant="outline" className="rounded-full text-xs">
                    MTN MoMo
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-xs">
                    Orange Money
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Large card - Escrow */}
            <Card className="lg:col-span-2 rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-colors bg-foreground text-background">
              <CardContent className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3">Escrow sécurisé</h3>
                    <p className="text-background/60 leading-relaxed">
                      Vos fonds sont protégés par Piol. Ils ne sont libérés au propriétaire qu'après
                      la remise des clés. Remboursement garanti en cas de problème.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Paiement envoyé', status: 'done', amount: '1,500,000 FCFA' },
                      { label: 'Fonds en escrow', status: 'active', amount: 'Protégé' },
                      { label: 'Clés remises', status: 'pending', amount: 'En attente' },
                    ].map((step) => (
                      <div
                        key={step.label}
                        className={`p-4 rounded-xl border ${
                          step.status === 'active'
                            ? 'border-primary/30 bg-primary/10'
                            : 'border-background/10 bg-background/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {step.status === 'done' ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : step.status === 'active' ? (
                              <Lock className="h-5 w-5 text-primary" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-background/20" />
                            )}
                            <span className="text-sm font-medium">{step.label}</span>
                          </div>
                          <span
                            className={`text-sm ${step.status === 'active' ? 'text-primary font-bold' : 'text-background/40'}`}
                          >
                            {step.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Small card - Messaging */}
            <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Messagerie</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  Discutez directement avec les propriétaires. Historique complet pour la résolution
                  de litiges.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  Temps réel
                </div>
              </CardContent>
            </Card>

            {/* Full-width card - Cities */}
            <Card className="lg:col-span-3 rounded-2xl border-border/50 overflow-hidden hover:border-primary/30 transition-colors">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-1">
                      Disponible dans 10+ villes
                    </h3>
                    <p className="text-muted-foreground">
                      Douala, Yaoundé, Buea, Kribi, et plus encore
                    </p>
                  </div>
                  <Link href="/properties" className="hidden md:block">
                    <Button variant="outline" className="rounded-xl group">
                      Explorer
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      name: 'Douala',
                      properties: '450+',
                      image:
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop',
                    },
                    {
                      name: 'Yaoundé',
                      properties: '380+',
                      image:
                        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop',
                    },
                    {
                      name: 'Buea',
                      properties: '120+',
                      image:
                        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=200&fit=crop',
                    },
                    {
                      name: 'Kribi',
                      properties: '90+',
                      image:
                        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop',
                    },
                  ].map((city) => (
                    <Link key={city.name} href={`/properties?city=${city.name}`}>
                      <div className="group/city relative rounded-xl overflow-hidden aspect-[3/2] cursor-pointer">
                        <Image
                          src={city.image}
                          alt={city.name}
                          fill
                          className="object-cover group-hover/city:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
                        <div className="absolute bottom-3 left-3">
                          <div className="text-white font-bold">{city.name}</div>
                          <div className="text-white/60 text-xs">{city.properties} logements</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Small card - Search */}
            <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Recherche avancée</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Filtrez par ville, quartier, prix, type de logement, et équipements.
                </p>
              </CardContent>
            </Card>

            {/* Small card - Bilingual */}
            <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Bilingue</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Interface complète en français et anglais, comme le Cameroun.
                </p>
              </CardContent>
            </Card>

            {/* Small card - Support */}
            <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
                  <Phone className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Support 7j/7</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Notre équipe vous accompagne à chaque étape, du premier clic aux clés.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ================================================================
          STATS - Minimal numbers row
          ================================================================ */}
      <section className="py-16 md:py-20 border-y bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1,200+', label: 'Logements' },
              { value: '5,000+', label: 'Utilisateurs' },
              { value: '100%', label: 'Vérifiés' },
              { value: '4.8', label: 'Note /5' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-1">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PROPERTIES - Featured
          ================================================================ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Annonces récentes</h2>
              <p className="text-muted-foreground mt-2">
                Des logements de qualité, prêts pour emménagement
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="rounded-xl group">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
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
          CTA - Clean, minimal
          ================================================================ */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Home className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-background/50 text-lg mb-10 max-w-xl mx-auto">
            Créez votre compte en 30 secondes. Gratuit, sans engagement, sans carte bancaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-base font-semibold shadow-2xl"
              >
                Créer mon compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 rounded-xl text-base border-background/20 text-background hover:bg-background/10"
              >
                Explorer d'abord
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  );
}
