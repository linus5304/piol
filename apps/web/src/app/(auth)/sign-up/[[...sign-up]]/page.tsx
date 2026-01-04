'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isClerkConfigured } from '@/hooks/use-safe-auth';

// Demo sign-up form when Clerk is not configured
function DemoSignUpForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>
          {role === 'landlord'
            ? 'Rejoignez Piol en tant que propriétaire'
            : 'Trouvez votre prochain logement'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <strong>Mode Démo:</strong> L'authentification Clerk n'est pas configurée.
          <br />
          Pour activer l'authentification complète, ajoutez vos clés Clerk dans <code className="bg-amber-100 px-1 rounded">.env.local</code>
        </div>
        
        <div className="space-y-3">
          <Input placeholder="Email" type="email" disabled />
          <Input placeholder="Mot de passe" type="password" disabled />
          <Button className="w-full" disabled>
            S'inscrire (Mode Démo)
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Déjà inscrit?{' '}
          <Link href="/sign-in" className="text-primary hover:underline">
            Se connecter
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

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  // Show demo form when Clerk is not configured
  if (!isClerkConfigured) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <DemoSignUpForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Créer un compte
        </h1>
        <p className="text-gray-600">
          {role === 'landlord'
            ? 'Rejoignez Piol en tant que propriétaire'
            : 'Trouvez votre prochain logement'}
        </p>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'w-full shadow-xl border-0',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton:
              'border border-gray-200 hover:bg-gray-50 transition-colors',
            formButtonPrimary:
              'bg-[#FF385C] hover:bg-[#E31C5F] transition-colors',
            footerActionLink: 'text-[#FF385C] hover:text-[#E31C5F]',
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard/onboarding"
        unsafeMetadata={{
          role: role || 'renter',
        }}
      />
    </div>
  );
}
