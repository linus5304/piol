import { enUS, frFR } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import './globals.css';
import { ConnectionStatus } from '@/components/connection-status';
import { Toaster } from '@/components/ui/sonner';
import { env, isClerkConfigured } from '@/lib/env';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_APP_NAME} - Cameroon Housing Marketplace`,
  description:
    'Find your perfect home in Cameroon. Verified properties, secure payments, and trusted landlords.',
  keywords: ['rental', 'housing', 'cameroon', 'douala', 'yaoundé', 'apartment', 'property'],
  authors: [{ name: env.NEXT_PUBLIC_APP_NAME }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: env.NEXT_PUBLIC_APP_NAME,
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: `${env.NEXT_PUBLIC_APP_NAME} - Cameroon Housing Marketplace`,
    description: 'Find your perfect home in Cameroon',
    type: 'website',
    locale: 'fr_CM',
    alternateLocale: 'en_CM',
    siteName: env.NEXT_PUBLIC_APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${env.NEXT_PUBLIC_APP_NAME} - Cameroon Housing Marketplace`,
    description: 'Find your perfect home in Cameroon',
  },
};

export const viewport: Viewport = {
  themeColor: '#18181b',
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

  const content = (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ConnectionStatus />
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Toaster position="top-right" richColors />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );

  // If Clerk is not configured, render without ClerkProvider
  if (!isClerkConfigured) {
    console.warn('⚠️ Clerk not configured - running in demo mode without authentication');
    return content;
  }

  return (
    <ClerkProvider
      localization={clerkLocalization}
      appearance={{
        variables: {
          colorPrimary: '#ff385c',
          colorBackground: '#fafafa',
          colorText: '#18181b',
          colorTextSecondary: '#71717a',
          borderRadius: '8px',
        },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90',
          card: 'shadow-lg',
          headerTitle: 'text-2xl font-bold',
          headerSubtitle: 'text-muted-foreground',
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
