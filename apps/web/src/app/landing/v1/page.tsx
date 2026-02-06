'use client';

import { Logo } from '@/components/brand';
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
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Search,
  Shield,
  Smartphone,
  Star,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

/**
 * V1 - "Immersive Hero" Landing Page
 *
 * Airbnb-inspired: Full-bleed hero image, floating glass search bar,
 * warm and inviting tone, image-forward property showcase.
 */
export default function LandingV1() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const featuredProperties = useQuery(api.properties.getFeaturedProperties, { limit: 6 });
  const cityStats = useQuery(api.properties.getCityStats);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="transparent" />

      {/* ================================================================
          HERO - Full-bleed image with floating search
          ================================================================ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop&q=80"
            alt="Beautiful home in Cameroon"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 text-center text-white">
          <Badge className="mb-6 rounded-full px-5 py-2 bg-white/15 text-white border-white/20 backdrop-blur-md text-sm">
            La plateforme de location au Cameroun
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance drop-shadow-lg">
            Trouvez votre
            <br />
            <span className="text-primary">chez-vous</span>
          </h1>

          <p className="text-lg md:text-xl text-white/85 mb-12 max-w-2xl mx-auto leading-relaxed">
            Annonces vérifiées, paiement sécurisé par Mobile Money.
            <br className="hidden md:block" />
            De Douala à Yaoundé, votre prochain logement vous attend.
          </p>

          {/* Floating Glass Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Douala, Yaoundé, Buea..."
                  className="pl-12 h-14 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                />
              </div>
              <Link href={`/properties${searchQuery ? `?search=${searchQuery}` : ''}`}>
                <Button
                  size="lg"
                  className="h-14 px-10 w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 shadow-lg text-base font-semibold"
                >
                  Rechercher
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Annonces vérifiées</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Support 7j/7</span>
            </div>
          </div>
        </div>

        {/* Bottom wave/fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ================================================================
          POPULAR CITIES - Horizontal scroll cards with images
          ================================================================ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Explorez par ville</h2>
              <p className="text-muted-foreground mt-2">
                Découvrez les logements disponibles dans les grandes villes du Cameroun
              </p>
            </div>
            <Link
              href="/properties"
              className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Toutes les villes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: 'Douala',
                image:
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
              },
              {
                name: 'Yaoundé',
                image:
                  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
              },
              {
                name: 'Buea',
                image:
                  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
              },
              {
                name: 'Kribi',
                image:
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
              },
            ].map((city) => {
              const stat = cityStats?.find((s: { city: string }) => s.city === city.name);
              return (
                <Link key={city.name} href={`/properties?city=${city.name}`}>
                  <Card className="group card-hover rounded-2xl overflow-hidden border-0 shadow-lg">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-xl">{city.name}</h3>
                        <p className="text-white/70 text-sm">
                          {stat ? `${stat.count} logements` : 'Découvrir'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS - Horizontal timeline style
          ================================================================ */}
      <section className="py-16 md:py-20 bg-muted/30 border-y">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5">
              Simple et rapide
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Votre logement en 3 étapes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-0 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: 'Recherchez',
                desc: "Parcourez des centaines d'annonces vérifiées, filtrez par ville, prix et type de logement.",
                icon: Search,
              },
              {
                step: 2,
                title: 'Contactez',
                desc: 'Échangez directement avec les propriétaires vérifiés via notre messagerie intégrée.',
                icon: MessageCircle,
              },
              {
                step: 3,
                title: 'Emménagez',
                desc: "Payez en toute sécurité par Mobile Money et récupérez vos clés. C'est aussi simple.",
                icon: Home,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative text-center px-8 py-6 group">
                {/* Connector line */}
                {step < 3 && (
                  <div className="hidden md:block absolute top-16 right-0 w-1/2 h-px bg-border" />
                )}
                {step > 1 && (
                  <div className="hidden md:block absolute top-16 left-0 w-1/2 h-px bg-border" />
                )}

                <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-lg transition-all duration-300">
                  <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">
                  Étape {step}
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURED PROPERTIES - Large grid with feature cards
          ================================================================ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <Badge variant="secondary" className="mb-3 rounded-full px-4 py-1.5">
                Sélection du moment
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Annonces à la une</h2>
              <p className="text-muted-foreground mt-2">
                Les logements les mieux notés par notre communauté
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline" size="lg" className="rounded-xl group">
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
              featuredProperties
                .slice(0, 6)
                .map((property: (typeof featuredProperties)[number]) => (
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
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-muted-foreground" />
                </div>
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
          TRUST & FEATURES - Full-width cards
          ================================================================ */}
      <section className="py-16 md:py-20 bg-muted/30 border-y">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Pourquoi des milliers de Camerounais choisissent Piol
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nous avons repensé l'expérience locative pour la rendre simple, sûre et transparente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle2,
                title: 'Annonces vérifiées',
                desc: 'Chaque logement est visité par notre équipe. Photos authentiques, informations vérifiées, zéro arnaque.',
                stat: '100%',
                statLabel: 'vérifié',
              },
              {
                icon: Shield,
                title: 'Paiement sécurisé',
                desc: "Payez via MTN MoMo ou Orange Money. Vos fonds sont protégés en escrow jusqu'à la remise des clés.",
                stat: '0 FCFA',
                statLabel: 'de risque',
              },
              {
                icon: Smartphone,
                title: 'Support bilingue',
                desc: 'Assistance en français et anglais, disponible 7j/7. Nous vous accompagnons à chaque étape.',
                stat: '24/7',
                statLabel: 'disponible',
              },
            ].map(({ icon: Icon, title, desc, stat, statLabel }) => (
              <Card
                key={title}
                className="rounded-2xl border-border/50 card-hover overflow-hidden group"
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{stat}</div>
                      <div className="text-xs text-muted-foreground">{statLabel}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIAL - Single powerful quote
          ================================================================ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-6 w-6 fill-primary text-primary" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8 text-balance leading-tight">
            &ldquo;Grâce à Piol, j'ai trouvé mon appartement à Douala en 3 jours. Plus besoin de
            faire le tour de la ville.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              A
            </div>
            <div className="text-left">
              <div className="font-semibold">Amina T.</div>
              <div className="text-sm text-muted-foreground">Locataire à Douala</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA - Warm gradient with image
          ================================================================ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&h=600&fit=crop"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Prêt à trouver votre chez-vous ?
          </h2>
          <p className="text-white/80 mb-10 text-lg max-w-xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont trouvé leur logement idéal avec Piol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto rounded-xl px-10 h-14 text-base font-semibold shadow-xl hover:shadow-2xl transition-shadow"
              >
                Créer un compte gratuit
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl px-10 h-14 text-base border-white/30 text-white hover:bg-white/10 bg-white/5"
              >
                Explorer les annonces
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
