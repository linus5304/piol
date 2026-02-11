import { Logo } from '@/components/brand';
import { parseAppLocale } from '@/i18n/config';
import { formatDate } from '@/lib/i18n-format';
import { getLocale } from 'gt-next/server';

export default async function PrivacyPage() {
  const locale = parseAppLocale(await getLocale());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">Politique de confidentialité</h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Dernière mise à jour:{' '}
            {formatDate(new Date(), locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
          <p className="text-muted-foreground mb-4">
            Chez Piol, nous nous engageons à protéger votre vie privée. Cette politique décrit
            comment nous collectons, utilisons et protégeons vos informations personnelles.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Données collectées</h2>
          <p className="text-muted-foreground mb-4">
            Nous collectons les types de données suivants:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>
              <strong>Informations de compte:</strong> nom, email, numéro de téléphone
            </li>
            <li>
              <strong>Informations de paiement:</strong> détails pour les transactions Mobile Money
            </li>
            <li>
              <strong>Données de propriété:</strong> adresses, photos, descriptions
            </li>
            <li>
              <strong>Communications:</strong> messages échangés sur la plateforme
            </li>
            <li>
              <strong>Données d'utilisation:</strong> historique de navigation, préférences
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            3. Utilisation des données
          </h2>
          <p className="text-muted-foreground mb-4">Nous utilisons vos données pour:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Fournir et améliorer nos services</li>
            <li>Traiter les transactions et paiements</li>
            <li>Vérifier les propriétés et les utilisateurs</li>
            <li>Communiquer avec vous concernant votre compte</li>
            <li>Respecter nos obligations légales</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            4. Partage des données
          </h2>
          <p className="text-muted-foreground mb-4">
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations
            avec:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Les autres utilisateurs (selon vos paramètres de confidentialité)</li>
            <li>Nos prestataires de services (hébergement, paiement)</li>
            <li>Les autorités légales si requis par la loi</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            5. Sécurité des données
          </h2>
          <p className="text-muted-foreground mb-4">
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Chiffrement des données en transit et au repos</li>
            <li>Authentification sécurisée</li>
            <li>Accès limité aux données personnelles</li>
            <li>Surveillance continue de nos systèmes</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Vos droits</h2>
          <p className="text-muted-foreground mb-4">Vous avez le droit de:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Accéder à vos données personnelles</li>
            <li>Corriger vos données inexactes</li>
            <li>Demander la suppression de vos données</li>
            <li>Vous opposer au traitement de vos données</li>
            <li>Exporter vos données</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Cookies</h2>
          <p className="text-muted-foreground mb-4">
            Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos
            préférences de cookies dans les paramètres de votre navigateur.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            8. Modifications de cette politique
          </h2>
          <p className="text-muted-foreground mb-4">
            Nous pouvons mettre à jour cette politique périodiquement. Nous vous informerons des
            changements importants par email ou notification sur la plateforme.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Contact</h2>
          <p className="text-muted-foreground mb-4">
            Pour toute question concernant cette politique, contactez-nous à:
          </p>
          <p className="text-muted-foreground">
            <strong>Email:</strong> privacy@piol.cm
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
