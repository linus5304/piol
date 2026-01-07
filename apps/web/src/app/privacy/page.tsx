import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-gray-900">Piol</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Dernière mise à jour:{' '}
            {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            Chez Piol, nous prenons la protection de vos données personnelles très au sérieux. Cette
            politique de confidentialité explique comment nous collectons, utilisons et protégeons
            vos informations.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Données collectées</h2>
          <p className="text-gray-600 mb-4">Nous collectons les types de données suivants:</p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Informations de compte:</strong> nom, email, numéro de téléphone
            </li>
            <li>
              <strong>Informations de profil:</strong> photo de profil, préférences
            </li>
            <li>
              <strong>Données de transaction:</strong> historique des paiements
            </li>
            <li>
              <strong>Données d'utilisation:</strong> pages visitées, recherches effectuées
            </li>
            <li>
              <strong>Données de localisation:</strong> ville, quartier de recherche
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            3. Utilisation des données
          </h2>
          <p className="text-gray-600 mb-4">Nous utilisons vos données pour:</p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Fournir et améliorer nos services</li>
            <li>Faciliter la communication entre utilisateurs</li>
            <li>Traiter les paiements de manière sécurisée</li>
            <li>Vérifier l'identité des utilisateurs</li>
            <li>Envoyer des notifications pertinentes</li>
            <li>Prévenir la fraude et assurer la sécurité</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Partage des données</h2>
          <p className="text-gray-600 mb-4">
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager certaines
            informations avec:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>D'autres utilisateurs (informations de profil public)</li>
            <li>Prestataires de paiement (MTN, Orange)</li>
            <li>Autorités légales (si requis par la loi)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Sécurité des données</h2>
          <p className="text-gray-600 mb-4">
            Nous utilisons des mesures de sécurité de pointe pour protéger vos données:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Chiffrement SSL/TLS pour toutes les communications</li>
            <li>Stockage sécurisé des données</li>
            <li>Accès restreint aux données personnelles</li>
            <li>Audits de sécurité réguliers</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Vos droits</h2>
          <p className="text-gray-600 mb-4">Vous avez le droit de:</p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Accéder à vos données personnelles</li>
            <li>Corriger des informations inexactes</li>
            <li>Supprimer votre compte et vos données</li>
            <li>Exporter vos données</li>
            <li>Refuser certains traitements de données</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Cookies</h2>
          <p className="text-gray-600 mb-4">
            Nous utilisons des cookies pour améliorer votre expérience sur Piol. Vous pouvez gérer
            vos préférences de cookies dans les paramètres de votre navigateur.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            8. Conservation des données
          </h2>
          <p className="text-gray-600 mb-4">
            Nous conservons vos données aussi longtemps que votre compte est actif ou que nécessaire
            pour vous fournir nos services. Après suppression de votre compte, certaines données
            peuvent être conservées pour des raisons légales.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Contact</h2>
          <p className="text-gray-600 mb-4">
            Pour toute question concernant cette politique ou vos données personnelles:
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> privacy@piol.cm
            <br />
            <strong>Adresse:</strong> Douala, Cameroun
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Piol. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
