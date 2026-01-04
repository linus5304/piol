import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-gray-900">Piol</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/properties" className="text-gray-600 hover:text-gray-900">
              Propriétés
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Connexion</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              À propos de Piol
            </h1>
            <p className="text-xl text-gray-600">
              Nous révolutionnons le marché locatif au Cameroun en rendant la location simple, 
              transparente et digne de confiance.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notre Mission</h2>
            <p className="text-gray-600 text-lg mb-6">
              Le marché locatif camerounais souffre de nombreux problèmes : annonces frauduleuses, 
              frais cachés, manque de transparence et difficultés de paiement. Nous avons créé Piol 
              pour résoudre ces problèmes et offrir une expérience de location moderne et sécurisée.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-lg font-semibold mb-2">Propriétés Vérifiées</h3>
                <p className="text-gray-600">
                  Chaque propriété est visitée et vérifiée par notre équipe avant publication.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold mb-2">Paiements Sécurisés</h3>
                <p className="text-gray-600">
                  Payez en toute sécurité via MTN MoMo ou Orange Money avec notre système d'escrow.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-lg font-semibold mb-2">Support Bilingue</h3>
                <p className="text-gray-600">
                  Notre équipe parle français et anglais pour vous accompagner.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
            <p className="text-gray-600 text-lg mb-4">
              Fondée en 2024, Piol est née de la frustration de chercher un logement au Cameroun. 
              Après avoir perdu de l'argent sur des annonces frauduleuses et passé des semaines 
              à visiter des propriétés qui ne correspondaient pas aux descriptions, nous avons 
              décidé de créer la solution que nous aurions aimé avoir.
            </p>
            <p className="text-gray-600 text-lg">
              Aujourd'hui, Piol connecte des milliers de locataires avec des propriétaires 
              vérifiés à travers Douala, Yaoundé et d'autres villes du Cameroun.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#FF385C]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Rejoignez la communauté Piol
            </h2>
            <p className="text-white/80 mb-8">
              Que vous soyez locataire ou propriétaire, nous avons une solution pour vous.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/properties">
                <Button variant="secondary" size="lg">
                  Explorer les propriétés
                </Button>
              </Link>
              <Link href="/sign-up?role=landlord">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white hover:bg-white/20">
                  Je suis propriétaire
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Piol. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

