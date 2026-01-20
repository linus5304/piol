'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isClerkConfigured } from '@/lib/env';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

// Demo sign-in form when Clerk is not configured
function DemoSignInForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Se connecter</CardTitle>
        <CardDescription>Bienvenue! Connectez-vous pour accéder à votre compte.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <strong>Mode Démo:</strong> L'authentification Clerk n'est pas configurée.
          <br />
          Pour activer l'authentification complète, ajoutez vos clés Clerk dans{' '}
          <code className="bg-amber-100 px-1 rounded">.env.local</code>
        </div>

        <div className="space-y-3">
          <Input placeholder="Email" type="email" disabled />
          <Input placeholder="Mot de passe" type="password" disabled />
          <Button className="w-full" disabled>
            Se connecter (Mode Démo)
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Pas encore inscrit?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Créer un compte
          </Link>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Pour tester l'application, naviguez vers{' '}
            <Link href="/dashboard" className="text-primary hover:underline">
              le tableau de bord
            </Link>{' '}
            directement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SignInPage() {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Se connecter</h1>
        <p className="text-muted-foreground">
          Bienvenue! Connectez-vous pour accéder à votre compte.
        </p>
      </div>

      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'w-full shadow-xl border-0',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton: 'border border-border hover:bg-muted transition-colors',
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
