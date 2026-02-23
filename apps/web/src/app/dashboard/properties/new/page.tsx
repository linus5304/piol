'use client';

import { BlockFormV5b } from '@/components/properties/block-form-v5b';
import { ShareButtons } from '@/components/properties/share-buttons';
import { Button } from '@/components/ui/button';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useTranslations } from 'gt-next';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function NewPropertyPage() {
  const t = useTranslations();
  const router = useRouter();

  const [createdPropertyId, setCreatedPropertyId] = useState<Id<'properties'> | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-redirect on success
  useEffect(() => {
    if (createdPropertyId) {
      redirectTimerRef.current = setTimeout(() => {
        router.push('/dashboard/properties');
      }, 10000);
    }
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [createdPropertyId, router]);

  // Success state
  if (createdPropertyId) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-success" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('newProperty.successTitle')}</h1>
          <p className="text-muted-foreground mt-2">{t('newProperty.successDesc')}</p>
        </div>

        <ShareButtons propertyId={createdPropertyId} />

        <div className="flex justify-center gap-3">
          <Link href={`/dashboard/properties/${createdPropertyId}`}>
            <Button>{t('newProperty.submitForVerification')}</Button>
          </Link>
          <Link href="/dashboard/properties">
            <Button variant="outline">{t('newProperty.backToProperties')}</Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">{t('newProperty.autoRedirect')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="text-muted-foreground hover:text-foreground">
          {t('newProperty.back')}
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{t('newProperty.title')}</h1>
      </div>

      <BlockFormV5b template={null} onSuccess={(id) => setCreatedPropertyId(id)} />
    </div>
  );
}
