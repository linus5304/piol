'use client';

import { Logo } from '@/components/brand';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSafeUser } from '@/hooks/use-safe-auth';
import { api } from '@repo/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Role = 'renter' | 'landlord';

export default function OnboardingPage() {
  const { user, isLoaded } = useSafeUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('renter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);

  // Update selected role when user loads
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      setSelectedRole(user.unsafeMetadata.role as Role);
    }
  }, [user?.unsafeMetadata?.role]);

  // Redirect if already completed onboarding - using useEffect to avoid setState during render
  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.onboardingCompleted) {
      router.replace('/dashboard');
    }
  }, [isLoaded, user?.unsafeMetadata?.onboardingCompleted, router]);

  const handleComplete = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Create/update user in Convex with selected role
      await ensureCurrentUser({
        email: user.primaryEmailAddress?.emailAddress ?? '',
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        profileImageUrl: user.imageUrl ?? undefined,
        role: selectedRole,
      });

      // Update Clerk metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: selectedRole,
          onboardingCompleted: true,
        },
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Chargement...</span>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (user?.unsafeMetadata?.onboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Redirection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 rounded-2xl shadow-card">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" asLink={false} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Bienvenue sur Piol!</h1>
          <p className="text-muted-foreground">
            Dites-nous comment vous souhaitez utiliser la plateforme
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            type="button"
            onClick={() => setSelectedRole('renter')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedRole === 'renter'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🔑</span>
              <div>
                <div className="font-semibold">Je cherche un logement</div>
                <div className="text-sm text-muted-foreground">
                  Parcourir les annonces et contacter les propriétaires
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('landlord')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedRole === 'landlord'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🏢</span>
              <div>
                <div className="font-semibold">Je suis propriétaire</div>
                <div className="text-sm text-muted-foreground">
                  Publier des annonces et gérer mes biens
                </div>
              </div>
            </div>
          </button>
        </div>

        <Button
          onClick={handleComplete}
          disabled={isSubmitting}
          className="w-full py-6 text-lg rounded-xl"
        >
          {isSubmitting ? 'En cours...' : 'Continuer'}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Vous pourrez changer votre rôle plus tard dans les paramètres
        </p>
      </Card>
    </div>
  );
}
