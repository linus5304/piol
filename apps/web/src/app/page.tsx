'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { homepageNav } from '@/config/navigation';
import { ArrowRight, MapPin, Search, Shield, Smartphone } from 'lucide-react';
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
  const [activeStep, setActiveStep] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PHOTOS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="bg-background text-foreground">
      <Header navItems={homepageNav} />

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

      <Footer />
    </div>
  );
}
