import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { frFR, enUS } from '@clerk/localizations';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './providers';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Piol - Cameroon Housing Marketplace',
  description:
    'Find your perfect home in Cameroon. Verified properties, secure payments, and trusted landlords.',
  keywords: ['rental', 'housing', 'cameroon', 'douala', 'yaoundé', 'apartment', 'property'],
  authors: [{ name: 'Piol' }],
  openGraph: {
    title: 'Piol - Cameroon Housing Marketplace',
    description: 'Find your perfect home in Cameroon',
    type: 'website',
    locale: 'fr_CM',
    alternateLocale: 'en_CM',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={frFR}
      appearance={{
        variables: {
          colorPrimary: '#FF385C',
          colorBackground: '#FFFFFF',
          colorText: '#222222',
          colorTextSecondary: '#717171',
          borderRadius: '12px',
        },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90',
          card: 'shadow-lg',
          headerTitle: 'text-2xl font-bold',
          headerSubtitle: 'text-gray-600',
        },
      }}
    >
      <html lang="fr" suppressHydrationWarning>
        <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
