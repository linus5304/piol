'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Une erreur est survenue</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Impossible de charger les propri&eacute;t&eacute;s. Veuillez r&eacute;essayer.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline" className="rounded-xl">
          R&eacute;essayer
        </Button>
        <Link href="/">
          <Button variant="ghost" className="rounded-xl">
            Retour &agrave; l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
