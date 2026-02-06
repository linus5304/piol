'use client';

import { brandConstants } from '@/components/brand';
import { ArrowRight, MapPin, Menu, Moon, Search, Shield, Smartphone, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------
const PHOTOS = [
  'photo-1522708323590-d24dbb6b0267',
  'photo-1502672260266-1c1ef2d93688',
  'photo-1560448204-e02f11c3d0e2',
  'photo-1600210492486-724fe5c67fb0',
  'photo-1600573472591-ee6b68d14c68',
  'photo-1600585154526-990dced4db0d',
];
const img = (i: number) => `https://images.unsplash.com/${PHOTOS[i % PHOTOS.length]}?w=800&q=80`;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const FEED_ITEMS = [
  { price: '150,000', location: 'Akwa, Douala', type: '2BR', time: '2h ago' },
  { price: '85,000', location: 'Bastos, Yaound\u00e9', type: 'Studio', time: '3h ago' },
  { price: '220,000', location: 'Bonapriso, Douala', type: '3BR', time: '5h ago' },
  { price: '65,000', location: 'Mvan, Yaound\u00e9', type: '1BR', time: '6h ago' },
  { price: '180,000', location: 'Bonanjo, Douala', type: '2BR', time: '8h ago' },
  { price: '120,000', location: 'Nlongkak, Yaound\u00e9', type: '2BR', time: '12h ago' },
];

const PROPERTIES = [
  { price: '150,000', location: 'Akwa, Douala', tags: ['2BR', 'furnished', 'parking'] },
  { price: '85,000', location: 'Bastos, Yaound\u00e9', tags: ['studio', 'wifi', 'security'] },
  { price: '220,000', location: 'Bonapriso, Douala', tags: ['3BR', 'balcony', 'generator'] },
  { price: '130,000', location: 'Molyko, Buea', tags: ['2BR', 'furnished', 'wifi'] },
  { price: '95,000', location: 'Nlongkak, Yaound\u00e9', tags: ['1BR', 'kitchen', 'water'] },
  { price: '250,000', location: 'Bonanjo, Douala', tags: ['3BR', 'pool', 'parking'] },
];

const CITIES = [
  { name: 'Douala', count: 4821, desc: 'Economic capital' },
  { name: 'Yaound\u00e9', count: 3912, desc: 'Political capital' },
  { name: 'Buea', count: 2103, desc: 'University town' },
];

const STEPS = [
  {
    id: '01',
    label: 'SEARCH',
    title: 'Search',
    desc: 'Filter by city, neighborhood, budget, and amenities. Every listing shows real photos and GPS coordinates.',
    icon: Search,
  },
  {
    id: '02',
    label: 'VERIFY',
    title: 'Verify',
    desc: 'Our team visits every property in person. Landlord identity confirmed, photos verified, availability checked.',
    icon: Shield,
  },
  {
    id: '03',
    label: 'SECURE',
    title: 'Pay & move in',
    desc: 'Pay securely with MTN MoMo or Orange Money. Funds held until you confirm move-in. No middlemen.',
    icon: Smartphone,
  },
];

const TESTIMONIALS = [
  {
    quote:
      'I found my apartment in Bonapriso in 2 days. The photos matched, the landlord was real, and I paid with MoMo without any stress.',
    name: 'Amina K.',
    city: 'Douala',
    role: 'Renter',
  },
  {
    quote:
      'As a landlord, Piol brought me 3 serious tenants in the first week. No more agents taking huge commissions for doing nothing.',
    name: 'Jean-Pierre M.',
    city: 'Yaound\u00e9',
    role: 'Property owner',
  },
  {
    quote:
      'I moved from Bamenda to Buea for university and found a verified place near campus in one evening. The escrow payment made me feel safe.',
    name: 'Grace N.',
    city: 'Buea',
    role: 'Student',
  },
];

const HERO_SLIDES = [
  { price: '150,000', location: 'Akwa, Douala', type: '2BR', tag: 'furnished' },
  { price: '85,000', location: 'Bastos, Yaound\u00e9', type: 'Studio', tag: 'wifi' },
  { price: '220,000', location: 'Bonapriso, Douala', type: '3BR', tag: 'balcony' },
  { price: '130,000', location: 'Molyko, Buea', type: '2BR', tag: 'furnished' },
  { price: '95,000', location: 'Nlongkak, Yaound\u00e9', type: '1BR', tag: 'kitchen' },
  { price: '250,000', location: 'Bonanjo, Douala', type: '3BR', tag: 'pool' },
];

const METRICS = [
  { value: '98.2%', label: 'verified on-ground' },
  { value: '4.8', label: 'user rating' },
  { value: '<24h', label: 'response time' },
  { value: '100%', label: 'secure payments' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PHOTOS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="bg-background text-foreground">
      {/* ================================================================= */}
      {/* NAV                                                               */}
      {/* ================================================================= */}
      <nav className="sticky top-0 z-50 dusk-surface-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tighter">
              piol<span className="text-primary">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {[
              { label: 'Explore', href: '/properties' },
              { label: 'How it works', href: '#how-it-works' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/sign-up?role=landlord"
              className="ml-1 rounded-lg px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              For landlords
            </Link>

            <div className="mx-3 h-5 w-px bg-border" />

            {/* Theme toggle — animated sun/moon */}
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {mounted && (
                <>
                  <Sun
                    size={16}
                    className={`absolute transition-all duration-300 ${
                      resolvedTheme === 'dark'
                        ? 'rotate-90 scale-0 opacity-0'
                        : 'rotate-0 scale-100 opacity-100'
                    }`}
                  />
                  <Moon
                    size={16}
                    className={`absolute transition-all duration-300 ${
                      resolvedTheme === 'dark'
                        ? 'rotate-0 scale-100 opacity-100'
                        : '-rotate-90 scale-0 opacity-0'
                    }`}
                  />
                </>
              )}
            </button>

            <Link
              href="/sign-in"
              className="rounded-lg px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="ml-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <div className="mx-auto w-full max-w-7xl px-4 pb-5 pt-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Explore', href: '/properties' },
                  { label: 'How it works', href: '#how-it-works' },
                  { label: 'For landlords', href: '/sign-up?role=landlord', accent: true },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-lg px-3 py-2.5 text-sm ${link.accent ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                {/* Mobile theme toggle */}
                <button
                  type="button"
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground"
                >
                  {mounted && resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  {mounted && resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
                <Link
                  href="/sign-in"
                  className="rounded-lg border border-border px-3 py-2.5 text-center text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ================================================================= */}
      {/* HERO — carousel + ken burns + grain + orbs                       */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
        <div className="absolute inset-0">
          {PHOTOS.map((photo, i) => (
            <div
              key={photo}
              className={`hero-slide ${i === currentSlide ? 'hero-slide-active' : ''}`}
            >
              <Image
                src={`https://images.unsplash.com/${photo}?w=1920&q=85`}
                alt={`Property ${i + 1}`}
                fill
                className={`object-cover ${i === currentSlide ? 'hero-ken-burns' : ''}`}
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Gradient overlays using CSS background tokens */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-background/73" />
          <div className="absolute inset-0 md:hidden bg-gradient-to-b from-background/87 via-background/67 to-background/80" />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-background/94 via-background/87 to-background/47" />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/87 to-transparent"
            style={{
              backgroundSize: '100% 30%',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-background/80 to-transparent"
            style={{ backgroundSize: '100% 18%', backgroundRepeat: 'no-repeat' }}
          />
        </div>

        <div className="hero-grain" />

        {/* Ambient orbs — purely decorative */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[15%] right-[10%] rounded-full blur-[60px] bg-primary/8"
            style={{
              width: 'clamp(180px, 35vw, 500px)',
              height: 'clamp(180px, 35vw, 500px)',
              animation: 'orbDrift1 18s ease-in-out infinite',
            }}
          />
          <div
            className="absolute top-[50%] left-[5%] rounded-full blur-[50px] bg-border/13"
            style={{
              width: 'clamp(120px, 25vw, 400px)',
              height: 'clamp(120px, 25vw, 400px)',
              animation: 'orbDrift2 14s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-[20%] right-[25%] rounded-full blur-[70px] bg-primary/5"
            style={{
              width: 'clamp(150px, 30vw, 450px)',
              height: 'clamp(150px, 30vw, 450px)',
              animation: 'orbDrift3 20s ease-in-out infinite',
            }}
          />
        </div>

        <div className="relative z-10 pt-16 pb-24 md:pt-28 md:pb-36">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1
              className="anim-fade-in-up font-extrabold tracking-tighter leading-[0.85]"
              style={{ fontSize: 'clamp(56px, 14vw, 180px)' }}
            >
              piol<span className="text-primary">.</span>
            </h1>

            <div className="mt-6 max-w-2xl sm:mt-8 md:mt-12">
              <h2 className="anim-fade-in-up-delay-1 text-xl font-bold tracking-tight sm:text-2xl md:text-4xl lg:text-5xl">
                Stop renting blind<span className="text-primary">.</span>
              </h2>

              <p className="anim-fade-in-up-delay-1 mt-3 max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base md:mt-5 md:text-lg">
                Every home on Piol is visited and verified by our team. Real photos, real prices,
                real availability&mdash;pay with mobile money and move in stress&#8209;free.
              </p>

              <div className="anim-fade-in-up-delay-2 mt-6 flex flex-col gap-2 rounded-xl border border-border p-2 sm:flex-row sm:items-center sm:gap-3 md:mt-10 bg-card/87 backdrop-blur-xl">
                <div className="flex flex-1 items-center gap-3 px-3 sm:px-4">
                  <Search size={18} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by city, neighborhood..."
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:opacity-50 caret-primary"
                  />
                </div>
                <Link
                  href="/properties"
                  className="dusk-btn-amber font-mono text-sm w-full sm:w-auto justify-center"
                >
                  Search
                </Link>
              </div>

              <div className="font-mono anim-fade-in-up-delay-2 mt-4 flex flex-wrap items-center gap-2 text-xs tracking-wider text-muted-foreground sm:mt-5">
                <span>12,847 listings</span>
                <span className="text-border">|</span>
                <span>5 cities</span>
                <span className="text-border">|</span>
                <span>
                  <span className="text-success">98.2%</span> verified
                </span>
              </div>
            </div>

            {/* Floating info card — desktop only */}
            <div className="pointer-events-none absolute right-8 bottom-36 hidden lg:block xl:right-16">
              <div className="pointer-events-auto anim-fade-in-up-delay-2 dusk-float-card px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/13">
                    <Shield size={10} className="text-success" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-success">Verified</span>
                </div>
                <div className="font-mono mt-2 text-lg font-bold text-primary transition-all duration-700">
                  {slide?.price} F
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground transition-all duration-700">
                  <MapPin size={10} />
                  {slide?.location}
                </div>
              </div>

              <div className="pointer-events-auto anim-fade-in-up dusk-float-card ml-auto mt-3 w-fit px-3 py-2">
                <span className="font-mono text-xs font-semibold transition-all duration-700">
                  {slide?.type}
                </span>
                <span className="font-mono ml-1.5 text-xs text-muted-foreground transition-all duration-700">
                  {slide?.tag}
                </span>
              </div>
            </div>

            {/* Slide dots */}
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {PHOTOS.map((_, i) => (
                <button
                  key={`dot-${PHOTOS[i]}`}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all duration-500 rounded-full ${
                    i === currentSlide
                      ? 'w-6 h-1.5 bg-primary'
                      : 'w-1.5 h-1.5 bg-muted-foreground/27'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* HOW IT WORKS                                                      */}
      {/* ================================================================= */}
      <section id="how-it-works" className="pb-16 md:pb-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl md:mb-12 md:text-6xl">
            How it works<span className="text-primary">.</span>
          </h2>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => {
              const isActive = i === activeStep;
              const Icon = step.icon;
              return (
                <button
                  type="button"
                  key={step.id}
                  className={`relative cursor-pointer rounded-xl p-5 text-left transition-all sm:p-6 border ${
                    isActive
                      ? 'bg-accent border-primary border-l-4'
                      : 'bg-card border-border hover:border-border/80'
                  }`}
                  onClick={() => setActiveStep(i)}
                >
                  <div
                    className={`font-mono mb-4 text-xs font-bold tracking-widest ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {step.id}_{step.label}
                  </div>
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                      isActive ? 'dusk-accent-badge' : 'bg-border/53'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isActive ? 'text-primary' : 'text-muted-foreground'}
                    />
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div className="absolute -right-5 top-1/2 hidden -translate-y-1/2 md:block">
                      <ArrowRight size={18} className="text-border" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:mt-12">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors"
            >
              Get started &mdash; it&apos;s free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FEATURED PROPERTIES                                               */}
      {/* ================================================================= */}
      <section className="pb-16 md:pb-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl md:mb-12 md:text-6xl">
            Selected<span className="text-primary">.</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {PROPERTIES.map((prop, i) => (
              <Link
                key={`prop-${prop.location}-${i}`}
                href="/properties"
                className="dusk-card group block overflow-hidden"
              >
                <div className="relative h-40 w-full overflow-hidden sm:h-48">
                  <Image
                    src={img(i)}
                    alt={prop.location}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="font-mono text-lg font-bold text-primary sm:text-xl">
                    {prop.price}{' '}
                    <span className="text-xs font-normal text-muted-foreground sm:text-sm">
                      FCFA/mo
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <MapPin size={14} className="text-muted-foreground" />
                    {prop.location}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
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

          <div className="mt-8 text-center sm:mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors"
            >
              See all listings
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* LIVE FEED                                                         */}
      {/* ================================================================= */}
      <section className="pb-16 md:pb-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end gap-3 sm:mb-8 sm:gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-6xl">
              Latest<span className="text-primary">.</span>
            </h2>
            <span className="pulse-dot mb-1.5 inline-block h-2 w-2 rounded-full bg-success sm:mb-2 sm:h-2.5 sm:w-2.5 md:mb-3" />
          </div>

          <div className="overflow-hidden rounded-xl bg-card border border-border">
            {FEED_ITEMS.map((item, i) => (
              <Link
                key={`feed-${item.location}-${i}`}
                href="/properties"
                className="dusk-row flex items-center gap-2.5 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4"
              >
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md sm:h-10 sm:w-10 sm:rounded-lg">
                  <Image
                    src={img(i)}
                    alt={item.location}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <span className="font-mono shrink-0 text-xs font-bold text-primary sm:w-28 sm:text-sm">
                  {item.price} F
                </span>
                <span className="min-w-0 flex-1 truncate text-xs sm:text-sm">{item.location}</span>
                <span className="dusk-tag font-mono hidden text-muted-foreground sm:inline-block">
                  {item.type}
                </span>
                <span className="font-mono shrink-0 text-[10px] text-muted-foreground sm:text-xs">
                  {item.time}
                </span>
                <ArrowRight size={14} className="hidden shrink-0 text-border sm:block" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TESTIMONIALS                                                      */}
      {/* ================================================================= */}
      <section className="pb-16 md:pb-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl md:mb-12 md:text-6xl">
            Real people<span className="text-primary">.</span>
          </h2>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-xl border border-border bg-card p-5 sm:p-6">
                <p className="text-sm leading-relaxed sm:text-base">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold dusk-accent-badge">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {t.role} &middot; {t.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* BROWSE BY CITY                                                    */}
      {/* ================================================================= */}
      <section className="pb-16 md:pb-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl md:mb-12 md:text-6xl">
            Browse by city<span className="text-primary">.</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {CITIES.map((city) => (
              <Link
                key={city.name}
                href={`/properties?city=${city.name}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 sm:p-6"
              >
                <div>
                  <div className="text-lg font-bold sm:text-xl">{city.name}</div>
                  <div className="font-mono mt-1 text-xs text-muted-foreground">
                    {city.desc} &middot; {city.count.toLocaleString()} listings
                  </div>
                </div>
                <ArrowRight
                  size={20}
                  className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TRUST METRICS                                                     */}
      {/* ================================================================= */}
      <section className="bg-primary py-14 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-8">
            {METRICS.map((m) => (
              <div key={m.label}>
                <div className="text-4xl font-extrabold tracking-tighter text-primary-foreground sm:text-5xl md:text-7xl">
                  {m.value}
                </div>
                <div className="font-mono mt-2 text-[10px] uppercase tracking-widest text-primary-foreground/70 sm:mt-3 sm:text-xs">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CTA                                                               */}
      {/* ================================================================= */}
      <section className="py-16 md:py-32 bg-gradient-to-b from-accent/50 via-background to-background">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-6xl">
            Find home<span className="text-primary">.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-lg">
            Your next home is one search away. Browse verified listings across Cameroon&apos;s
            biggest cities.
          </p>

          <div className="mt-8 sm:mt-10">
            <Link href="/properties" className="dusk-btn-amber font-mono text-sm">
              Start searching
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FOOTER                                                            */}
      {/* ================================================================= */}
      <footer className="border-t border-border pt-14 pb-8 sm:pt-20 sm:pb-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-12 md:gap-8">
            <div className="col-span-2 md:col-span-4">
              <Link href="/" className="inline-flex items-center">
                <span className="text-2xl font-extrabold tracking-tighter">
                  piol<span className="text-primary">.</span>
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Cameroon&apos;s verified housing marketplace. Every listing visited, every landlord
                confirmed, every payment secured.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="font-mono rounded-md border border-border px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground">
                  MTN MoMo
                </div>
                <div className="font-mono rounded-md border border-border px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground">
                  Orange Money
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1">
                {[
                  {
                    label: 'Facebook',
                    href: brandConstants.social.facebook,
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        role="img"
                        aria-label="Facebook"
                      >
                        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146c-.427-.044-.72-.065-.82-.065-1.185 0-1.645.45-1.645 1.618v2.744h4.078l-.497 3.667h-3.581v8.127C19.395 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Instagram',
                    href: brandConstants.social.instagram,
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        role="img"
                        aria-label="Instagram"
                      >
                        <path d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.874 5.874 0 0 0-2.124 1.388 5.878 5.878 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076.008 8.354-.005 8.764.001 12.023c.007 3.259.021 3.667.083 4.947.061 1.277.264 2.149.563 2.911.31.804.717 1.484 1.388 2.123a5.872 5.872 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063 3.257-.007 3.668-.021 4.947-.082 1.28-.06 2.147-.265 2.91-.563a5.881 5.881 0 0 0 2.123-1.388 5.881 5.881 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.892 5.892 0 0 0-1.387-2.123 5.857 5.857 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0 8.718.008 8.31.021 7.03.084Zm.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.736 3.736 0 0 1-1.382-.895 3.695 3.695 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-1.001.896-1.382a3.705 3.705 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.999.476 1.382.895.384.383.677.822.9 1.38.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.998-.896 1.38a3.705 3.705 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079-3.204.007-3.582-.006-4.848-.06Zm9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442ZM5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.161 6.161 0 0 0-12.323.024ZM8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008Z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'X',
                    href: brandConstants.social.twitter,
                    icon: (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        role="img"
                        aria-label="X"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'TikTok',
                    href: brandConstants.social.tiktok,
                    icon: (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        role="img"
                        aria-label="TikTok"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'LinkedIn',
                    href: brandConstants.social.linkedin,
                    icon: (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        role="img"
                        aria-label="LinkedIn"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest">Product</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  { label: 'Explore listings', href: '/properties' },
                  { label: 'How it works', href: '#how-it-works' },
                  { label: 'For landlords', href: '/sign-up?role=landlord' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest">Company</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  { label: 'About us', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Careers', href: '/careers' },
                  { label: 'Blog', href: '/blog' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest">Support</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  { label: 'Help center', href: '/help' },
                  { label: 'Safety tips', href: '/help' },
                  { label: 'FAQ', href: '/help' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 sm:mt-14 sm:pt-8">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:text-xs">
              Cities we serve
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'Douala',
                'Yaound\u00e9',
                'Buea',
                'Bamenda',
                'Kribi',
                'Limb\u00e9',
                'Bafoussam',
                'Garoua',
              ].map((city) => (
                <Link
                  key={city}
                  href={`/properties?city=${city}`}
                  className="font-mono rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:mt-10 sm:flex-row sm:pt-8">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { label: 'Terms of service', href: '/terms' },
                { label: 'Privacy policy', href: '/privacy' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground sm:text-xs"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50 sm:text-xs">
              &copy; {new Date().getFullYear()} {brandConstants.legal.company}. All rights reserved.
              <span className="mx-2 text-border">|</span>
              Made with pride in Cameroon
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
