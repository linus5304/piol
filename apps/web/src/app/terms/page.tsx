import { Logo } from '@/components/brand';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">Conditions d'utilisation</h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Dernière mise à jour:{' '}
            {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            1. Acceptation des conditions
          </h2>
          <p className="text-muted-foreground mb-4">
            En accédant à Piol ou en utilisant nos services, vous acceptez d'être lié par ces
            conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas
            utiliser notre plateforme.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            2. Description du service
          </h2>
          <p className="text-muted-foreground mb-4">
            Piol est une plateforme de mise en relation entre propriétaires et locataires au
            Cameroun. Nous facilitons la recherche, la vérification et la location de biens
            immobiliers.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            3. Inscription et compte
          </h2>
          <p className="text-muted-foreground mb-4">
            Pour utiliser certaines fonctionnalités de Piol, vous devez créer un compte. Vous êtes
            responsable de maintenir la confidentialité de vos informations de connexion et de
            toutes les activités sur votre compte.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            4. Propriétés et annonces
          </h2>
          <p className="text-muted-foreground mb-4">
            Les propriétaires sont responsables de l'exactitude des informations publiées sur leurs
            annonces. Piol vérifie les propriétés mais ne garantit pas l'exactitude de toutes les
            informations fournies.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Paiements</h2>
          <p className="text-muted-foreground mb-4">
            Les paiements effectués via Piol sont sécurisés par notre système d'escrow. Les fonds
            sont retenus jusqu'à confirmation de la transaction par les deux parties.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            6. Comportement interdit
          </h2>
          <p className="text-muted-foreground mb-4">Il est interdit de:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Publier des informations fausses ou trompeuses</li>
            <li>Utiliser la plateforme à des fins frauduleuses</li>
            <li>Harceler d'autres utilisateurs</li>
            <li>Contourner les systèmes de paiement de Piol</li>
            <li>Violer les lois camerounaises ou internationales</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            7. Limitation de responsabilité
          </h2>
          <p className="text-muted-foreground mb-4">
            Piol ne peut être tenu responsable des litiges entre propriétaires et locataires, des
            dommages résultant de l'utilisation de la plateforme, ou des problèmes liés aux
            propriétés listées.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Modifications</h2>
          <p className="text-muted-foreground mb-4">
            Piol se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs
            seront informés des modifications importantes par email ou notification.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Contact</h2>
          <p className="text-muted-foreground mb-4">
            Pour toute question concernant ces conditions, contactez-nous à:
          </p>
          <p className="text-muted-foreground">
            <strong>Email:</strong> legal@piol.cm
            <br />
            <strong>Adresse:</strong> Douala, Cameroun
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-muted-foreground py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Piol. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
