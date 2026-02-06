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
  Award,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

/**
 * V3 - "Social Proof First" Landing Page
 *
 * Booking.com-inspired: Trust signals up front, testimonials,
 * numbers-heavy, urgency elements, data-driven reassurance.
 */
export default function LandingV3() {
  const t = useTranslations('home');
  const featuredProperties = useQuery(api.properties.getFeaturedProperties, { limit: 3 });
  const cityStats = useQuery(api.properties.getCityStats);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ================================================================
          TOP BAR - Urgency/trust signal
          ================================================================ */}
      <div className="bg-foreground text-background py-2.5">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm font-medium flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>
              <strong>127 personnes</strong> cherchent un logement en ce moment
            </span>
            <span className="text-background/40 mx-2">|</span>
            <span className="text-background/70">
              <strong>23 logements</strong> ajoutés cette semaine
            </span>
          </p>
        </div>
      </div>

      {/* ================================================================
          HERO - Trust-forward with social proof
          ================================================================ */}
      <section className="py-12 md:py-20 border-b">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              {/* Trust badges row */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
                  <BadgeCheck className="h-4 w-4" />
                  Annonces vérifiées
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Paiement sécurisé
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium">
                  <Award className="h-4 w-4" />
                  #1 au Cameroun
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Des milliers de Camerounais
                <span className="text-primary"> nous font confiance</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Trouvez votre logement parmi des annonces vérifiées. Payez en sécurité par Mobile
                Money. Zéro arnaque, zéro stress.
              </p>

              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Où cherchez-vous ? (ex: Douala, Yaoundé)"
                    className="pl-12 h-14 text-base rounded-xl shadow-sm"
                  />
                </div>
                <Link href="/properties">
                  <Button
                    size="lg"
                    className="h-14 px-8 w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 shadow-md text-base font-semibold"
                  >
                    Rechercher
                  </Button>
                </Link>
              </div>

              {/* Social proof line */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['A', 'M', 'J', 'P', 'S'].map((initial, i) => (
                    <div
                      key={initial}
                      className="w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: ['#FF385C', '#E31C5F', '#008A05', '#D97706', '#71717A'][i],
                        color: 'white',
                      }}
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                    <span className="font-bold ml-1">4.8</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rejoint par <strong>5,000+</strong> utilisateurs
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-2xl border-border/50 card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Home className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-bold tracking-tight mb-1">1,200+</div>
                  <div className="text-sm text-muted-foreground">Logements actifs</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50 card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7 text-success" />
                  </div>
                  <div className="text-4xl font-bold tracking-tight mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Annonces vérifiées</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50 card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-7 w-7 text-warning" />
                  </div>
                  <div className="text-4xl font-bold tracking-tight mb-1">5,000+</div>
                  <div className="text-sm text-muted-foreground">Utilisateurs actifs</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50 card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Wallet className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-bold tracking-tight mb-1">0 FCFA</div>
                  <div className="text-sm text-muted-foreground">Inscription gratuite</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS - Three review cards
          ================================================================ */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-primary text-primary" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-muted-foreground">Note moyenne : 4.8/5 sur plus de 500 avis</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Amina T.',
                role: 'Locataire à Douala',
                text: "J'ai trouvé mon appartement en 3 jours ! Les photos correspondent parfaitement à la réalité. Le paiement par MoMo était super simple.",
                rating: 5,
                initial: 'A',
                time: 'Il y a 2 semaines',
              },
              {
                name: 'Jean-Claude M.',
                role: 'Propriétaire à Yaoundé',
                text: "Depuis que j'utilise Piol, mes appartements sont loués en moins d'une semaine. La vérification attire des locataires sérieux.",
                rating: 5,
                initial: 'J',
                time: 'Il y a 1 mois',
              },
              {
                name: 'Sandra K.',
                role: 'Locataire à Buea',
                text: "Enfin une plateforme fiable ! J'avais perdu 200,000 FCFA sur une fausse annonce avant. Avec Piol, l'escrow me protège.",
                rating: 5,
                initial: 'S',
                time: 'Il y a 3 semaines',
              },
            ].map((review) => (
              <Card key={review.name} className="rounded-2xl border-border/50 card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={`star-${review.name}-${i}`}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6">&ldquo;{review.text}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {review.initial}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{review.name}</div>
                        <div className="text-xs text-muted-foreground">{review.role}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{review.time}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS - Steps with numbers
          ================================================================ */}
      <section className="py-16 md:py-20 border-b">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5">
              Simple comme 1-2-3
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Comment ça marche</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: 'Recherchez',
                desc: 'Tapez une ville ou un quartier. Filtrez par prix, type de logement, et équipements.',
                icon: Search,
                detail: 'Plus de 10 villes couvertes',
              },
              {
                step: 2,
                title: 'Contactez',
                desc: 'Envoyez un message au propriétaire directement via la plateforme. Posez vos questions.',
                icon: MessageCircle,
                detail: 'Réponse moyenne en 2h',
              },
              {
                step: 3,
                title: 'Payez et emménagez',
                desc: "Payez par Mobile Money. Vos fonds sont protégés en escrow jusqu'à la remise des clés.",
                icon: Shield,
                detail: 'Protection 100% garantie',
              },
            ].map(({ step, title, desc, icon: Icon, detail }) => (
              <div key={step} className="relative">
                <Card className="rounded-2xl border-border/50 h-full card-hover">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
                        {step}
                      </div>
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{desc}</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {detail}
                    </div>
                  </CardContent>
                </Card>
                {/* Connector */}
                {step < 3 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 w-8 items-center justify-center z-10">
                    <ArrowRight className="h-5 w-5 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CITIES - With property counts
          ================================================================ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Villes les plus recherchées
              </h2>
              <p className="text-muted-foreground mt-2">
                Trouvez votre prochain logement dans ces villes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: 'Douala',
                desc: 'Capitale économique',
                image:
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
              },
              {
                name: 'Yaoundé',
                desc: 'Capitale politique',
                image:
                  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
              },
              {
                name: 'Buea',
                desc: 'Ville universitaire',
                image:
                  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
              },
              {
                name: 'Kribi',
                desc: 'Ville balnéaire',
                image:
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
              },
            ].map((city) => {
              const stat = cityStats?.find((s: { city: string }) => s.city === city.name);
              return (
                <Link key={city.name} href={`/properties?city=${city.name}`}>
                  <Card className="card-hover rounded-2xl overflow-hidden border-border/50 group">
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {stat && (
                        <Badge className="absolute top-3 right-3 rounded-full bg-primary text-primary-foreground border-0 shadow-lg">
                          {stat.count} annonces
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <h3 className="text-white font-bold text-lg">{city.name}</h3>
                        <p className="text-white/70 text-xs">{city.desc}</p>
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
          FEATURED PROPERTIES
          ================================================================ */}
      <section className="py-16 md:py-20 bg-muted/30 border-y">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Ajoutées récemment</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ne ratez pas ces annonces
              </h2>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="rounded-xl group">
                Voir toutes les annonces
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
          TRUST STRIP
          ================================================================ */}
      <section className="py-10 border-b">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Paiement escrow sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>Vérification sur le terrain</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>Support FR/EN 7j/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <span>MTN MoMo & Orange Money</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA - High urgency
          ================================================================ */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Commencez votre recherche aujourd'hui
          </h2>
          <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto">
            Inscription gratuite. Plus de 1,200 logements vérifiés vous attendent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto rounded-xl px-10 h-14 text-base font-semibold shadow-xl"
              >
                Créer mon compte gratuit
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl px-10 h-14 text-base border-white/30 text-white hover:bg-white/10 bg-white/5"
              >
                Voir les annonces
              </Button>
            </Link>
          </div>
          <p className="text-white/50 text-sm mt-6">
            Aucune carte bancaire requise. Annulez quand vous voulez.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
