'use client';

import { Logo } from '@/components/brand';
import { LandlordApplicationForm } from '@/components/landlord-application-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSafeUser } from '@/hooks/use-safe-auth';
import { api } from '@repo/convex/_generated/api';
import { useMutation } from 'convex/react';
import { Building2, CheckCircle, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Role = 'renter' | 'landlord';

export default function OnboardingPage() {
  const { user, isLoaded } = useSafeUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('renter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update selected role when user loads
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      const metaRole = user.unsafeMetadata.role as Role;
      // If Clerk metadata says landlord, show the application form
      if (metaRole === 'landlord') {
        setSelectedRole('landlord');
        setShowApplicationForm(true);
      } else {
        setSelectedRole(metaRole);
      }
    }
  }, [user?.unsafeMetadata?.role]);

  // Redirect if already completed onboarding
  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.onboardingCompleted) {
      router.replace('/dashboard');
    }
  }, [isLoaded, user?.unsafeMetadata?.onboardingCompleted, router]);

  // Auto-complete onboarding if role is already set from signup
  // but override landlord to renter (they must apply)
  useEffect(() => {
    if (
      isLoaded &&
      user &&
      user.unsafeMetadata?.role &&
      !user.unsafeMetadata?.onboardingCompleted &&
      !isSubmitting
    ) {
      const metaRole = user.unsafeMetadata.role as Role;

      // If landlord from signup, show application form instead of auto-completing
      if (metaRole === 'landlord') {
        setShowApplicationForm(true);
        return;
      }

      // Auto-complete for renters
      setIsSubmitting(true);
      completeOnboarding({ role: 'renter', languagePreference: 'fr' })
        .then(() =>
          user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              onboardingCompleted: true,
            },
          })
        )
        .then(() => {
          router.push('/dashboard');
        })
        .catch((error) => {
          console.error('Failed to auto-complete onboarding:', error);
          setIsSubmitting(false);
        });
    }
  }, [isLoaded, user, isSubmitting, router, completeOnboarding]);

  // Auto-redirect after application submitted
  useEffect(() => {
    if (applicationSubmitted) {
      redirectTimerRef.current = setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    }
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [applicationSubmitted, router]);

  const handleComplete = async () => {
    if (!user) return;

    // If landlord selected, show application form
    if (selectedRole === 'landlord') {
      setShowApplicationForm(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await completeOnboarding({
        role: 'renter',
        languagePreference: 'fr',
      });

      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: 'renter',
          onboardingCompleted: true,
        },
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setIsSubmitting(false);
    }
  };

  const handleApplicationComplete = async () => {
    if (!user) return;

    // Complete onboarding as renter (application is pending)
    try {
      await completeOnboarding({
        role: 'renter',
        languagePreference: 'fr',
      });

      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: 'renter',
          onboardingCompleted: true,
        },
      });

      setApplicationSubmitted(true);
    } catch (error) {
      console.error('Failed to complete onboarding after application:', error);
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

  // Application submitted success screen
  if (applicationSubmitted) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 rounded-2xl shadow-card text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Candidature envoyée !</h1>
          <p className="text-muted-foreground mb-4">
            Nous examinerons votre candidature et vous notifierons. Vous pouvez parcourir les
            propriétés en tant que locataire en attendant.
          </p>
          <p className="text-sm text-muted-foreground">Redirection vers le tableau de bord...</p>
        </Card>
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
            {showApplicationForm
              ? 'Complétez votre candidature propriétaire'
              : 'Dites-nous comment vous souhaitez utiliser la plateforme'}
          </p>
        </div>

        {showApplicationForm ? (
          <LandlordApplicationForm onComplete={handleApplicationComplete} />
        ) : (
          <>
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
                  <KeyRound className="w-8 h-8 text-primary" />
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
                  <Building2 className="w-8 h-8 text-primary" />
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
          </>
        )}
      </Card>
    </div>
  );
}
