'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'gt-next';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function PropertyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-4 py-16"
      data-testid="error-boundary"
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      <p className="text-muted-foreground text-center max-w-md">{t('description')}</p>
      <div className="flex gap-3">
        <Button onClick={reset}>{t('tryAgain')}</Button>
        <Button variant="outline" asChild>
          <Link href="/properties">{t('backToProperties')}</Link>
        </Button>
      </div>
    </div>
  );
}
