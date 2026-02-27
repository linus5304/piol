'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isClerkConfigured } from '@/lib/env';
import { SignIn } from '@clerk/nextjs';
import { useTranslations } from 'gt-next/client';
import Link from 'next/link';

// Demo sign-in form when Clerk is not configured
function DemoSignInForm() {
  const t = useTranslations();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('auth.signInTitle')}</CardTitle>
        <CardDescription>{t('auth.signInDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-sm text-warning">
          <strong>{t('auth.demoMode')}:</strong> {t('auth.demoModeDesc')}
          <br />
          {t('auth.demoModeHint')} <code className="bg-warning/20 px-1 rounded">.env.local</code>
        </div>

        <div className="space-y-3">
          <Input placeholder={t('auth.email')} type="email" disabled />
          <Input placeholder={t('auth.password')} type="password" disabled />
          <Button className="w-full" disabled>
            {t('auth.signInDemo')}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {t('auth.notRegistered')}{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            {t('auth.createAccount')}
          </Link>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            {t('auth.demoTestHint')}{' '}
            <Link href="/dashboard" className="text-primary hover:underline">
              {t('auth.demoTestDashboard')}
            </Link>{' '}
            {t('auth.demoTestDirectly')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SignInPage() {
  const t = useTranslations();

  // Show demo form when Clerk is not configured
  if (!isClerkConfigured) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <DemoSignInForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.signInTitle')}</h1>
        <p className="text-muted-foreground">{t('auth.signInDesc')}</p>
      </div>

      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'w-full',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton: 'transition-colors',
            formButtonPrimary: 'bg-primary hover:bg-primary/90 transition-colors',
            footerActionLink: 'text-primary hover:text-primary/90',
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
