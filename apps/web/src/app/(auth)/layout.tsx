import { Logo } from '@/components/brand';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Logo size="md" />
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Piol. Tous droits réservés. | All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Conditions d'utilisation
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Confidentialité
          </Link>
        </div>
      </footer>
    </div>
  );
}
