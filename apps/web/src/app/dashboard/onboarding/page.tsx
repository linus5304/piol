'use client';

import { useSafeUser } from '@/hooks/use-safe-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Role = 'renter' | 'landlord';

export default function OnboardingPage() {
  const { user, isLoaded } = useSafeUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(
    (user?.unsafeMetadata?.role as Role) || 'renter'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already completed onboarding, redirect to dashboard
  if (isLoaded && user?.unsafeMetadata?.onboardingCompleted) {
    router.replace('/dashboard');
    return null;
  }

  const handleComplete = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenue sur Piol!
          </h1>
          <p className="text-gray-600">
            Dites-nous comment vous souhaitez utiliser la plateforme
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            type="button"
            onClick={() => setSelectedRole('renter')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedRole === 'renter'
                ? 'border-[#FF385C] bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🔑</span>
              <div>
                <div className="font-semibold text-gray-900">
                  Je cherche un logement
                </div>
                <div className="text-sm text-gray-500">
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
                ? 'border-[#FF385C] bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🏢</span>
              <div>
                <div className="font-semibold text-gray-900">
                  Je suis propriétaire
                </div>
                <div className="text-sm text-gray-500">
                  Publier des annonces et gérer mes biens
                </div>
              </div>
            </div>
          </button>
        </div>

        <Button
          onClick={handleComplete}
          disabled={isSubmitting}
          className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white py-6 text-lg"
        >
          {isSubmitting ? 'En cours...' : 'Continuer'}
        </Button>

        <p className="text-xs text-center text-gray-400 mt-4">
          Vous pourrez changer votre rôle plus tard dans les paramètres
        </p>
      </Card>
    </div>
  );
}

