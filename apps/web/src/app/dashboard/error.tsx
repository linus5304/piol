'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function DashboardError({
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
        Impossible de charger le tableau de bord. Veuillez r&eacute;essayer.
      </p>
      <Button onClick={reset} variant="outline" className="rounded-xl">
        R&eacute;essayer
      </Button>
    </div>
  );
}
