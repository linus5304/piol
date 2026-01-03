'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

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

