'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property-card';
import { LanguageSwitcher } from '@/components/language-switcher';

// Cameroon cities with cultural context
const cameroonCities = [
  {
    name: 'Douala',
    properties: '450+',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop',
    tagline: 'La capitale économique',
  },
  {
    name: 'Yaoundé',
    properties: '380+',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    tagline: 'La ville aux sept collines',
  },
  {
    name: 'Buea',
    properties: '120+',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
    tagline: 'Au pied du Mont Cameroun',
  },
  {
    name: 'Kribi',
    properties: '85+',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    tagline: 'Perle de la côte',
  },
];

// Mock featured properties
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
    landlordName: 'Jean-Pierre Kamga',
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
    landlordName: 'Marie Ngo Bassa',
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
    landlordName: 'Paul Mbarga Atangana',
    landlordVerified: true,
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Amina Bello',
    role: 'Locataire à Douala',
    text: "J'ai trouvé mon appartement en seulement 3 jours. Les photos correspondaient parfaitement à la réalité !",
    avatar: '👩🏾',
  },
  {
    name: 'Christian Fotso',
    role: 'Propriétaire',
    text: "Piol m'a aidé à trouver des locataires sérieux. Le paiement via Mobile Money est vraiment pratique.",
    avatar: '👨🏾',
  },
  {
    name: 'Sandra Eyenga',
    role: 'Étudiante à Yaoundé',
    text: "Super plateforme ! J'ai pu comparer plusieurs studios près de l'université facilement.",
    avatar: '👩🏾‍🎓',
  },
];

export default function HomePage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E8E4DE] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#E85D4C] to-[#D14836] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <span className="text-white text-xl font-bold">P</span>
            </div>
            <span className="text-2xl font-bold text-[#2D2A26]">Piol</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-[#5C564D] hover:text-[#2D2A26] font-medium transition-colors"
            >
              {tNav('properties')}
            </Link>
            <Link
              href="/about"
              className="text-[#5C564D] hover:text-[#2D2A26] font-medium transition-colors"
            >
              {tNav('about')}
            </Link>
            <Link
              href="/contact"
              className="text-[#5C564D] hover:text-[#2D2A26] font-medium transition-colors"
            >
              {tNav('contact')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/sign-in">
              <Button variant="ghost" className="font-semibold text-[#5C564D] hover:text-[#2D2A26]">
                {tNav('signIn')}
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-[#E85D4C] hover:bg-[#D14836] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                {tNav('signUp')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Cameroon Inspired */}
      <section className="relative overflow-hidden">
        {/* Background Pattern - Subtle Cameroon flag inspired gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#007A33]/5 via-[#CE1126]/5 to-[#FCD116]/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E85D4C]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D6A4F]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#2D6A4F]/10 text-[#2D6A4F] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span>🇨🇲</span>
                <span>La 1ère plateforme de location au Cameroun</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2D2A26] leading-tight">
                Trouvez votre{' '}
                <span className="text-[#E85D4C]">chez-vous</span>{' '}
                au Cameroun
              </h1>
              
              <p className="text-lg text-[#5C564D] mt-6 leading-relaxed max-w-xl">
                Annonces vérifiées, paiement sécurisé par Mobile Money, et propriétaires de confiance.
                De Douala à Yaoundé, trouvez le logement idéal.
              </p>

              {/* Search Bar */}
              <div className="mt-8 bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <span className="text-[#8B8378]">📍</span>
                  <input
                    type="text"
                    placeholder="Douala, Yaoundé, Buea..."
                    className="flex-1 outline-none text-[#2D2A26] placeholder:text-[#C4BEB4]"
                  />
                </div>
                <Link href="/properties">
                  <Button className="bg-[#E85D4C] hover:bg-[#D14836] text-white font-semibold px-8 py-6 rounded-xl w-full sm:w-auto">
                    Rechercher
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-[#5C564D]">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center">✓</span>
                  <span>Annonces vérifiées</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#D4A017]/10 rounded-full flex items-center justify-center">📱</span>
                  <span>MTN MoMo & Orange Money</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#E85D4C]/10 rounded-full flex items-center justify-center">🔒</span>
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
                    alt="Villa moderne"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop"
                    alt="Appartement"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop"
                    alt="Studio moderne"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#E85D4C] to-[#D14836] flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <div className="text-4xl font-bold">1,000+</div>
                    <div className="text-sm opacity-90">Logements disponibles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D2A26]">
              Explorez nos villes
            </h2>
            <p className="text-[#5C564D] mt-3 max-w-xl mx-auto">
              Du dynamisme de Douala au charme de Kribi, trouvez votre quartier idéal
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cameroonCities.map((city) => (
              <Link key={city.name} href={`/properties?city=${city.name}`}>
                <div className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold">{city.name}</h3>
                    <p className="text-sm opacity-80">{city.tagline}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span>🏠</span>
                      <span>{city.properties} annonces</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#FAF9F7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D2A26]">
              Comment ça marche ?
            </h2>
            <p className="text-[#5C564D] mt-3">
              Trouvez et louez en 3 étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#E85D4C]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <div className="w-8 h-8 bg-[#E85D4C] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h3 className="text-xl font-bold text-[#2D2A26] mb-2">Recherchez</h3>
              <p className="text-[#5C564D]">
                Filtrez par ville, prix, type de logement et équipements
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#2D6A4F]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💬</span>
              </div>
              <div className="w-8 h-8 bg-[#2D6A4F] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h3 className="text-xl font-bold text-[#2D2A26] mb-2">Contactez</h3>
              <p className="text-[#5C564D]">
                Discutez directement avec les propriétaires vérifiés
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4A017]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔑</span>
              </div>
              <div className="w-8 h-8 bg-[#D4A017] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h3 className="text-xl font-bold text-[#2D2A26] mb-2">Emménagez</h3>
              <p className="text-[#5C564D]">
                Payez par Mobile Money et récupérez vos clés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2D2A26]">
                Annonces à la une
              </h2>
              <p className="text-[#5C564D] mt-2">Sélectionnées pour vous</p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="rounded-xl border-[#E8E4DE] hover:border-[#E85D4C] hover:text-[#E85D4C]">
                Voir tout →
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

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-[#2D6A4F] to-[#1B4332]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ce que disent nos utilisateurs
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-white/90 mb-4 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-white/70">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FAF9F7]">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-[#E85D4C] to-[#D14836] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à trouver votre logement ?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                Rejoignez des milliers de Camerounais qui ont trouvé leur chez-eux grâce à Piol
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-white text-[#E85D4C] hover:bg-gray-100 font-bold px-8 py-6 rounded-xl"
                  >
                    Créer un compte gratuit
                  </Button>
                </Link>
                <Link href="/sign-up?role=landlord">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-6 rounded-xl"
                  >
                    Je suis propriétaire
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 bg-white border-t border-[#E8E4DE]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
            <span className="text-[#5C564D] font-medium">Moyens de paiement acceptés :</span>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-[#FCD116] text-black px-4 py-2 rounded-lg font-semibold">
                📱 MTN MoMo
              </div>
              <div className="flex items-center gap-2 bg-[#FF6600] text-white px-4 py-2 rounded-lg font-semibold">
                📱 Orange Money
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2A26] text-[#C4BEB4] py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#E85D4C] to-[#D14836] rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">P</span>
                </div>
                <span className="text-2xl font-bold text-white">Piol</span>
              </div>
              <p className="leading-relaxed">
                La plateforme de confiance pour trouver et louer des logements au Cameroun.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  📘
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  📸
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  🐦
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Liens rapides</h4>
              <ul className="space-y-3">
                <li><Link href="/properties" className="hover:text-white transition-colors">Rechercher</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Légal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Conditions d'utilisation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">📧 support@piol.cm</li>
                <li className="flex items-center gap-2">📞 +237 6XX XXX XXX</li>
                <li className="flex items-center gap-2">📍 Douala, Cameroun</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} Piol. Tous droits réservés.</p>
            <p className="text-sm flex items-center gap-2">
              Fait avec ❤️ au <span className="text-[#FCD116]">🇨🇲</span> Cameroun
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
