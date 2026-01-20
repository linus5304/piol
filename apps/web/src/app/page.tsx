'use client';

import { PageSection, PublicLayout } from '@/components/layouts/public-layout';
import { PropertyCard } from '@/components/properties';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, CheckCircle2, MapPin, Search, Shield, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// Featured properties data
const featuredProperties = [
  {
    _id: 'feat-1',
    title: 'Appartement Moderne à Bonapriso',
    propertyType: '2br' as const,
    rentAmount: 180000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonapriso',
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop' },
    ],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-1',
    landlordName: 'Jean-Pierre K.',
    landlordVerified: true,
  },
  {
    _id: 'feat-2',
    title: 'Studio Étudiant à Ngoa-Ekelle',
    propertyType: 'studio' as const,
    rentAmount: 45000,
    currency: 'XAF',
    city: 'Yaoundé',
    neighborhood: 'Ngoa-Ekelle',
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop' },
    ],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-2',
    landlordName: 'Marie N.',
    landlordVerified: true,
  },
  {
    _id: 'feat-3',
    title: 'Villa Familiale avec Jardin',
    propertyType: 'villa' as const,
    rentAmount: 350000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonanjo',
    images: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop' },
    ],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-3',
    landlordName: 'Paul M.',
    landlordVerified: true,
  },
];

// Cities data
const cities = [
  { name: 'Douala', count: '450+' },
  { name: 'Yaoundé', count: '380+' },
  { name: 'Buea', count: '120+' },
  { name: 'Kribi', count: '85+' },
];

export default function HomePage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');

  return (
    <PublicLayout>
      {/* Hero Section */}
      <PageSection bordered className="py-16 md:py-24">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-4 rounded-full">
            Plateforme de location au Cameroun
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Trouvez votre prochain logement
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            Annonces vérifiées, paiement sécurisé par Mobile Money. De Douala à Yaoundé, trouvez le
            logement idéal.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ville ou quartier..."
                className="pl-12 h-14 text-base rounded-xl"
              />
            </div>
            <Link href="/properties">
              <Button
                size="lg"
                className="h-14 px-8 w-full sm:w-auto rounded-xl bg-[#FF385C] hover:bg-[#E31C5F]"
              >
                Rechercher
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <div>
              <div className="text-3xl font-bold">1,000+</div>
              <div className="text-sm text-muted-foreground">Logements</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-sm text-muted-foreground">Utilisateurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Cities Section */}
      <PageSection bordered>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Villes populaires</h2>
          <Link
            href="/properties"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.map((city) => (
            <Link key={city.name} href={`/properties?city=${city.name}`}>
              <Card className="hover:shadow-card transition-all cursor-pointer rounded-xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{city.name}</span>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {city.count}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </PageSection>

      {/* How It Works */}
      <PageSection bg="muted" bordered>
        <h2 className="text-2xl font-semibold mb-8 text-center">Comment ça marche</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-14 h-14 bg-[#FF385C] text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold rounded-2xl">
              1
            </div>
            <h3 className="font-semibold mb-2">Recherchez</h3>
            <p className="text-sm text-muted-foreground">
              Filtrez par ville, prix et type de logement
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-[#FF385C] text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold rounded-2xl">
              2
            </div>
            <h3 className="font-semibold mb-2">Contactez</h3>
            <p className="text-sm text-muted-foreground">
              Discutez avec les propriétaires vérifiés
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-[#FF385C] text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold rounded-2xl">
              3
            </div>
            <h3 className="font-semibold mb-2">Emménagez</h3>
            <p className="text-sm text-muted-foreground">
              Payez par Mobile Money et récupérez vos clés
            </p>
          </div>
        </div>
      </PageSection>

      {/* Featured Properties */}
      <PageSection bordered>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Annonces à la une</h2>
          <Link href="/properties">
            <Button variant="outline" size="sm" className="rounded-xl">
              Voir tout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </PageSection>

      {/* Features Section */}
      <PageSection bg="muted" bordered>
        <h2 className="text-2xl font-semibold mb-8 text-center">Pourquoi Piol</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[#FF385C]/10 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-[#FF385C]" />
              </div>
              <h3 className="font-semibold mb-2">Annonces vérifiées</h3>
              <p className="text-sm text-muted-foreground">
                Chaque annonce est vérifiée par notre équipe pour garantir son authenticité.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[#FF385C]/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-[#FF385C]" />
              </div>
              <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
              <p className="text-sm text-muted-foreground">
                Payez en toute sécurité via Mobile Money (MTN, Orange).
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[#FF385C]/10 rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-[#FF385C]" />
              </div>
              <h3 className="font-semibold mb-2">Support bilingue</h3>
              <p className="text-sm text-muted-foreground">
                Assistance en français et anglais disponible 7j/7.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* CTA Section */}
      <PageSection bg="brand">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à trouver votre logement ?</h2>
          <p className="text-white/80 mb-8">
            Rejoignez des milliers d'utilisateurs qui ont trouvé leur chez-eux avec Piol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto rounded-xl">
                Créer un compte
              </Button>
            </Link>
            <Link href="/sign-up?role=landlord">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-white/30 text-white hover:bg-white/10 bg-white/5"
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
