'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { homepageNav } from '@/config/navigation';
import { parseAppLocale } from '@/i18n/config';
import { formatNumber } from '@/lib/i18n-format';
import { useLocale, useTranslations } from 'gt-next';
import { ArrowRight, MapPin, Search, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------
const PHOTOS = [
  'photo-1502672260266-1c1ef2d93688',
  'photo-1560448204-e02f11c3d0e2',
  'photo-1600596542815-ffad4c1539a9',
  'photo-1600585154340-be6161a56a0c',
];
const img = (i: number) => `https://images.unsplash.com/${PHOTOS[i % PHOTOS.length]}?w=800&q=80`;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const PROPERTIES = [
  {
    price: 150_000,
    location: 'Akwa, Douala',
    title: 'Appartement 2 chambres meublé',
    tags: ['2ch', 'meublé', 'parking'],
  },
  {
    price: 85_000,
    location: 'Bastos, Yaoundé',
    title: 'Studio meublé à Bastos',
    tags: ['studio', 'wifi', 'sécurité'],
  },
  {
    price: 220_000,
    location: 'Bonapriso, Douala',
    title: 'Villa 3 chambres avec piscine',
    tags: ['3ch', 'balcon', 'générateur'],
  },
  {
    price: 130_000,
    location: 'Molyko, Buea',
    title: 'Appart 2 chambres à Molyko',
    tags: ['2ch', 'meublé', 'wifi'],
  },
];

const CITIES = [
  { name: 'cityDouala', sub: 'cityDoualaSub', count: 4821, query: 'Douala' },
  {
    name: 'cityYaounde',
    sub: 'cityYaoundeSub',
    count: 3912,
    query: 'Yaoundé',
  },
  { name: 'cityBuea', sub: 'cityBueaSub', count: 2103, query: 'Buea' },
];

const STEPS = [
  { id: '01', titleKey: 'stepSearchTitle', descKey: 'stepSearchDesc' },
  { id: '02', titleKey: 'stepVerifyTitle', descKey: 'stepVerifyDesc' },
  { id: '03', titleKey: 'stepContactTitle', descKey: 'stepContactDesc' },
] as const;

const HERO_PHOTOS = [
  { price: 150_000, photo: 0 },
  { price: 85_000, photo: 1 },
  { price: 220_000, photo: 2 },
  { price: 130_000, photo: 3 },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function HomePage() {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations('home');

  return (
    <div className="bg-background text-foreground">
      <Header navItems={homepageNav} />

      {/* ================================================================= */}
      {/* HERO — navy split layout                                          */}
      {/* ================================================================= */}
      <section
        className="relative overflow-hidden bg-[var(--background)]"
        style={{ minHeight: '100svh' }}
      >
        {/* Navy background — uses dark mode tokens */}
        <div className="absolute inset-0" style={{ backgroundColor: '#0c1222' }} />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            {/* Left column */}
            <div className="flex-1 max-w-xl">
              <h1
                className="font-extrabold tracking-tighter leading-[0.9]"
                style={{
                  fontSize: 'clamp(56px, 10vw, 80px)',
                  color: '#f1f1f1',
                }}
              >
                piol<span style={{ color: '#e8a838' }}>.</span>
              </h1>

              <h2
                className="mt-6 font-extrabold tracking-tight leading-[1.1]"
                style={{
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  color: '#f1f1f1',
                }}
              >
                {t('tagline')}
              </h2>

              <p
                className="mt-5 max-w-md text-base leading-relaxed sm:text-lg"
                style={{ color: '#9ba4b5' }}
              >
                {t('subtitle')}
              </p>

              {/* Search bar */}
              <div
                className="mt-8 flex flex-col gap-0 rounded-xl overflow-hidden border sm:flex-row"
                style={{
                  backgroundColor: '#141e33',
                  borderColor: '#1e2a42',
                }}
              >
                <div className="flex flex-1 items-center gap-3 px-4 py-3 sm:py-0">
                  <Search size={18} style={{ color: '#9ba4b5' }} />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:opacity-50 caret-primary"
                    style={{ color: '#f1f1f1' }}
                  />
                </div>
                <Link
                  href="/properties"
                  className="dusk-btn-amber font-mono text-sm justify-center sm:rounded-none"
                >
                  {t('searchButton')}
                </Link>
              </div>

              {/* Trust signals */}
              <div
                className="mt-5 flex flex-wrap items-center gap-3 font-mono text-xs tracking-wider"
                style={{ color: '#9ba4b5' }}
              >
                <span>{t('statsListings', { count: formatNumber(12847, locale) })}</span>
                <span style={{ color: '#1e2a42' }}>|</span>
                <span>{t('statsCities', { count: '5' })}</span>
                <span style={{ color: '#1e2a42' }}>|</span>
                <span style={{ color: '#34d399' }}>{t('statsVerified', { percent: '98,2%' })}</span>
              </div>
            </div>

            {/* Right column — 2x2 photo grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3 w-[560px] flex-shrink-0">
              {HERO_PHOTOS.map((item, i) => (
                <div
                  key={`hero-${PHOTOS[item.photo]}`}
                  className="relative h-[270px] rounded-xl overflow-hidden"
                >
                  <Image
                    src={img(item.photo)}
                    alt={`Property ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="270px"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 flex flex-col gap-1">
                    <div
                      className="flex items-center gap-1 rounded-full px-2 py-0.5 w-fit"
                      style={{ backgroundColor: 'rgba(52, 211, 153, 0.9)' }}
                    >
                      <Shield size={10} style={{ color: '#0c1222' }} />
                      <span
                        className="font-mono text-[10px] font-semibold"
                        style={{ color: '#0c1222' }}
                      >
                        Vérifié
                      </span>
                    </div>
                    <span
                      className="font-mono text-sm font-bold"
                      style={{
                        color: '#ffffff',
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {formatNumber(item.price, locale)} F
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* HOW IT WORKS — compact strip                                      */}
      {/* ================================================================= */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-10">
            {t('howItWorksLabel')}
          </p>

          <div className="grid gap-8 md:grid-cols-3 md:gap-0">
            {STEPS.map((step, i) => (
              <div
                key={step.id}
                className={`flex flex-col gap-3 ${
                  i > 0 ? 'md:border-l md:border-border md:pl-12' : ''
                } ${i < STEPS.length - 1 ? 'md:pr-12' : ''}`}
              >
                <span className="font-mono text-xs font-medium tracking-[0.1em] text-primary">
                  {step.id}
                </span>
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{t(step.titleKey)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* LISTINGS + CITIES                                                 */}
      {/* ================================================================= */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('listingsTitle')}</h2>
            <Link
              href="/properties"
              className="hidden sm:inline-flex items-center gap-1.5 font-mono text-sm font-medium text-primary transition-colors"
            >
              {t('viewAll')}
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 4-column property grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROPERTIES.map((prop, i) => (
              <Link
                key={`prop-${prop.location}`}
                href="/properties"
                className="dusk-card group block overflow-hidden"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={img(i)}
                    alt={prop.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-success/90 px-2 py-0.5">
                    <Shield size={10} className="text-success-foreground" />
                    <span className="font-mono text-[10px] font-semibold text-success-foreground">
                      Vérifié
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-mono text-base font-bold text-primary">
                    {formatNumber(prop.price, locale)}{' '}
                    <span className="text-xs font-normal text-muted-foreground">FCFA/mois</span>
                  </div>
                  <div className="mt-1.5 text-sm font-semibold leading-tight">{prop.title}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    {prop.location}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {prop.tags.map((tag) => (
                      <span key={tag} className="dusk-tag font-mono text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile "View all" link */}
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-primary"
            >
              {t('viewAll')}
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* City cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {CITIES.map((city) => (
              <Link
                key={city.query}
                href={`/properties?city=${city.query}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40"
              >
                <div>
                  <div className="text-lg font-bold">{t(city.name)}</div>
                  <div className="font-mono mt-1 text-xs text-muted-foreground">
                    {t(city.sub)} &middot;{' '}
                    {t('cityListings', {
                      count: formatNumber(city.count, locale),
                    })}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TRUST STRIP — facts + testimonial                                 */}
      {/* ================================================================= */}
      <section style={{ backgroundColor: '#0c1222' }}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            {/* Trust facts */}
            <div className="flex flex-wrap gap-10 lg:gap-12 flex-1">
              <div className="flex flex-col gap-2">
                <span
                  className="text-3xl font-extrabold tracking-tight sm:text-4xl"
                  style={{ color: '#f1f1f1' }}
                >
                  98,2%
                </span>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.08em]"
                  style={{ color: '#9ba4b5' }}
                >
                  {t('trustVerified')}
                </span>
              </div>
              <div
                className="hidden lg:block w-px self-stretch"
                style={{ backgroundColor: '#1e2a42' }}
              />
              <div className="flex flex-col gap-2">
                <span
                  className="text-3xl font-extrabold tracking-tight sm:text-4xl"
                  style={{ color: '#f1f1f1' }}
                >
                  MTN &amp; OM
                </span>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.08em]"
                  style={{ color: '#9ba4b5' }}
                >
                  {t('trustMobileMoney')}
                </span>
              </div>
              <div
                className="hidden lg:block w-px self-stretch"
                style={{ backgroundColor: '#1e2a42' }}
              />
              <div className="flex flex-col gap-2">
                <span
                  className="text-3xl font-extrabold tracking-tight sm:text-4xl"
                  style={{ color: '#e8a838' }}
                >
                  0 FCFA
                </span>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.08em]"
                  style={{ color: '#9ba4b5' }}
                >
                  {t('trustFree')}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div
              className="hidden lg:block w-px self-stretch"
              style={{ backgroundColor: '#1e2a42' }}
            />

            {/* Testimonial */}
            <div className="flex flex-col gap-4 lg:w-[380px] lg:flex-shrink-0">
              <p className="text-base leading-relaxed italic" style={{ color: '#f1f1f1' }}>
                &laquo; {t('testimonialQuote')} &raquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: 'rgba(232, 168, 56, 0.12)',
                    color: '#e8a838',
                  }}
                >
                  A
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#f1f1f1' }}>
                    {t('testimonialName')}
                  </div>
                  <div className="font-mono text-xs" style={{ color: '#9ba4b5' }}>
                    {t('testimonialRole')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CTA                                                               */}
      {/* ================================================================= */}
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            {t('ctaTitle')}
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            {t('ctaSubtitle')}
          </p>

          <div className="mt-8 sm:mt-10">
            <Link href="/properties" className="dusk-btn-amber font-mono text-sm">
              {t('ctaButton')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
