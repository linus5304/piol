'use client';

import { Logo } from '@/components/brand';
import { ArrowLeft, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('auth');
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel — hidden on mobile */}
      <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between overflow-hidden bg-[#0C1222]">
        {/* Background property image */}
        <Image
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80"
          alt=""
          fill
          className="object-cover opacity-[0.15]"
          sizes="45vw"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C1222]/80 via-[#0C1222]/60 to-[#0C1222]/90" />

        {/* Grain texture */}
        <div className="hero-grain" />

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
          {/* Top — Logo */}
          <div>
            <Logo size="lg" className="text-white" />
          </div>

          {/* Middle — Tagline + stats */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white xl:text-4xl">
                {t('tagline')}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                {t('description')}
              </p>
            </div>

            {/* Trust metrics */}
            <div className="flex items-center gap-6">
              <div>
                <div className="font-mono text-2xl font-bold text-white">98.2%</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {t('verified')}
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="font-mono text-2xl font-bold text-white">4.8</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {t('rating')}
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="font-mono text-2xl font-bold text-white">12k+</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {t('listings')}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom — Testimonial */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-1 mb-3">
              <Star size={12} className="fill-primary text-primary" />
              <Star size={12} className="fill-primary text-primary" />
              <Star size={12} className="fill-primary text-primary" />
              <Star size={12} className="fill-primary text-primary" />
              <Star size={12} className="fill-primary text-primary" />
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              &ldquo;I found my apartment in Bonapriso in 2 days. The photos matched, the landlord
              was real, and I paid with MoMo without any stress.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                A
              </div>
              <div>
                <div className="text-sm font-medium text-white">Amina K.</div>
                <div className="font-mono text-[10px] text-white/40">Renter &middot; Douala</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col bg-background">
        {/* Top bar — Logo + back link */}
        <header className="flex items-center justify-between p-6">
          <div className="lg:hidden">
            <Logo size="md" />
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">{t('backToHome')}</span>
          </Link>
        </header>

        {/* Centered form content */}
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Piol. All rights reserved.</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
