import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { frFR, enUS } from '@clerk/localizations';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './providers';
import { ConnectionStatus } from '@/components/connection-status';

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
  manifest: '/manifest.json',
  themeColor: '#FF385C',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Piol',
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: 'Piol - Cameroon Housing Marketplace',
    description: 'Find your perfect home in Cameroon',
    type: 'website',
    locale: 'fr_CM',
    alternateLocale: 'en_CM',
    siteName: 'Piol',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Piol - Cameroon Housing Marketplace',
    description: 'Find your perfect home in Cameroon',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Select Clerk localization based on locale
  const clerkLocalization = locale === 'en' ? enUS : frFR;

  return (
    <ClerkProvider
      localization={clerkLocalization}
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
      <html lang={locale} suppressHydrationWarning>
        <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
          <NextIntlClientProvider messages={messages}>
            <ConnectionStatus />
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
