'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyCard } from '@/components/property-card';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Search, CheckCircle2, Shield, Smartphone, ArrowRight, MapPin, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop' }],
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
    images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop' }],
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
    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop' }],
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center">
              <span className="text-background text-sm font-bold">P</span>
            </div>
            <span className="text-xl font-semibold">Piol</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {tNav('properties')}
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {tNav('about')}
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {tNav('contact')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/sign-in" className="hidden sm:block">
              <Button variant="ghost" size="sm">{tNav('signIn')}</Button>
            </Link>
            <Link href="/sign-up" className="hidden sm:block">
              <Button size="sm">{tNav('signUp')}</Button>
            </Link>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/properties" className="text-lg font-medium">{tNav('properties')}</Link>
                  <Link href="/about" className="text-lg font-medium">{tNav('about')}</Link>
                  <Link href="/contact" className="text-lg font-medium">{tNav('contact')}</Link>
                  <hr className="my-4" />
                  <Link href="/sign-in"><Button variant="outline" className="w-full">{tNav('signIn')}</Button></Link>
                  <Link href="/sign-up"><Button className="w-full">{tNav('signUp')}</Button></Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              Plateforme de location au Cameroun
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Trouvez votre prochain logement
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Annonces vérifiées, paiement sécurisé par Mobile Money. 
              De Douala à Yaoundé, trouvez le logement idéal.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher par ville ou quartier..." 
                  className="pl-10 h-12"
                />
              </div>
              <Link href="/properties">
                <Button size="lg" className="h-12 px-8 w-full sm:w-auto">
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
        </div>
      </section>

      {/* Cities Section */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Villes populaires</h2>
            <Link href="/properties" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link key={city.name} href={`/properties?city=${city.name}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{city.name}</span>
                    </div>
                    <Badge variant="secondary">{city.count}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Recherchez</h3>
              <p className="text-sm text-muted-foreground">
                Filtrez par ville, prix et type de logement
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Contactez</h3>
              <p className="text-sm text-muted-foreground">
                Discutez avec les propriétaires vérifiés
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Emménagez</h3>
              <p className="text-sm text-muted-foreground">
                Payez par Mobile Money et récupérez vos clés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Annonces à la une</h2>
            <Link href="/properties">
              <Button variant="outline" size="sm">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Pourquoi Piol</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <CheckCircle2 className="h-8 w-8 mb-4" />
                <h3 className="font-semibold mb-2">Annonces vérifiées</h3>
                <p className="text-sm text-muted-foreground">
                  Chaque annonce est vérifiée par notre équipe pour garantir son authenticité.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 mb-4" />
                <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
                <p className="text-sm text-muted-foreground">
                  Payez en toute sécurité via Mobile Money (MTN, Orange).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Smartphone className="h-8 w-8 mb-4" />
                <h3 className="font-semibold mb-2">Support bilingue</h3>
                <p className="text-sm text-muted-foreground">
                  Assistance en français et anglais disponible 7j/7.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-16">
          <Card className="bg-foreground text-background">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Prêt à trouver votre logement ?
              </h2>
              <p className="text-background/80 mb-8 max-w-md mx-auto">
                Rejoignez des milliers d'utilisateurs qui ont trouvé leur chez-eux avec Piol.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Créer un compte
                  </Button>
                </Link>
                <Link href="/sign-up?role=landlord">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-background/20 text-background hover:bg-background/10">
                    Je suis propriétaire
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-foreground flex items-center justify-center">
                  <span className="text-background text-sm font-bold">P</span>
                </div>
                <span className="text-xl font-semibold">Piol</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {tFooter('description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{tFooter('quickLinks')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/properties" className="text-muted-foreground hover:text-foreground">{tNav('properties')}</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">{tNav('about')}</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">{tNav('contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{tFooter('legal')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">{tFooter('privacy')}</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">{tFooter('terms')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{tNav('contact')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@piol.cm</li>
                <li>+237 6XX XXX XXX</li>
                <li>Douala, Cameroun</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Piol. {tFooter('copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
