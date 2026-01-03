'use client';

import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data for demo - replace with Convex when connected
const mockProperties = [
  {
    _id: '1',
    title: 'Bel appartement à Makepe',
    propertyType: '2br' as const,
    rentAmount: 150000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Makepe',
    verificationStatus: 'approved',
    landlord: { _id: 'l1', firstName: 'Jean', lastName: 'Kamga', idVerified: true },
  },
  {
    _id: '2',
    title: 'Studio moderne Bastos',
    propertyType: 'studio' as const,
    rentAmount: 85000,
    currency: 'XAF',
    city: 'Yaoundé',
    neighborhood: 'Bastos',
    verificationStatus: 'approved',
    landlord: { _id: 'l2', firstName: 'Marie', lastName: 'Fotso', idVerified: true },
  },
  {
    _id: '3',
    title: 'Villa 4 chambres avec piscine',
    propertyType: 'villa' as const,
    rentAmount: 500000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonanjo',
    verificationStatus: 'approved',
    landlord: { _id: 'l3', firstName: 'Paul', lastName: 'Mbarga', idVerified: true },
  },
];

export default function HomePage() {
  // TODO: Replace with Convex query when connected
  // const propertiesResult = useQuery(api.properties.listProperties, { limit: 6 });
  const propertiesResult = { properties: mockProperties };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-blue-600">Piol</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-gray-600 hover:text-gray-900">
              Propriétés
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Trouvez votre
          <span className="text-blue-600"> maison idéale</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          La plateforme de location immobilière la plus fiable au Cameroun. Propriétés vérifiées,
          paiement sécurisé, propriétaires de confiance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/properties">
            <Button size="lg" className="text-lg px-8">
              Explorer les propriétés
            </Button>
          </Link>
          <Link href="/register?role=landlord">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Je suis propriétaire
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
          <div>
            <div className="text-3xl font-bold text-blue-600">1,000+</div>
            <div className="text-gray-600">Propriétés</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">5,000+</div>
            <div className="text-gray-600">Utilisateurs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">98%</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Piol?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Propriétés Vérifiées</h3>
              <p className="text-gray-600">
                Toutes nos propriétés sont visitées et vérifiées par notre équipe. Plus de mauvaises
                surprises.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Paiement Mobile Money</h3>
              <p className="text-gray-600">
                Payez en toute sécurité avec MTN MoMo ou Orange Money. Vos fonds sont protégés.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Support Bilingue</h3>
              <p className="text-gray-600">
                Notre équipe parle français et anglais. Nous sommes là pour vous aider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Propriétés récentes</h2>
            <Link href="/properties">
              <Button variant="outline">Voir toutes</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertiesResult?.properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}

            {!propertiesResult && (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
                ))}
              </>
            )}

            {propertiesResult?.properties.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-500">
                Aucune propriété disponible pour le moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à trouver votre prochaine maison?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Rejoignez des milliers de locataires et propriétaires qui font confiance à Piol.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Créer un compte gratuit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏠</span>
                <span className="text-xl font-bold text-white">Piol</span>
              </div>
              <p className="text-sm">
                La plateforme de location immobilière la plus fiable au Cameroun.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/properties" className="hover:text-white">
                    Propriétés
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>📧 support@piol.cm</li>
                <li>📞 +237 6XX XXX XXX</li>
                <li>📍 Douala, Cameroun</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © {new Date().getFullYear()} Piol. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
