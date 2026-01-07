import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <span className="text-3xl">🏠</span>
          <span className="text-2xl font-bold text-gray-900">Piol</span>
        </Link>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Piol. Tous droits réservés. | All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link href="/terms" className="hover:text-gray-700">
            Conditions d'utilisation
          </Link>
          <Link href="/privacy" className="hover:text-gray-700">
            Confidentialité
          </Link>
        </div>
      </footer>
    </div>
  );
}
