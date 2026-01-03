import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue</h1>
        <p className="text-gray-600">
          Connectez-vous pour accéder à votre compte
        </p>
      </div>

      <SignIn
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
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}

