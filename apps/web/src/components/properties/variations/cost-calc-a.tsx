'use client';

import { DirectionsButton } from '@/components/properties/directions-button';
import { PropertyDetailMapWrapper } from '@/components/properties/property-detail-map-wrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import {
  BadgeCheck,
  Heart,
  Images,
  LogIn,
  MapPin,
  MessageCircle,
  Share2,
  ShieldAlert,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import type { PropertyVariationProps } from './types';
import { allAmenityKeys, amenityConfig, essentialAmenityKeys, propertyTypeLabels } from './types';

// ---------------------------------------------------------------------------
// Safety log entries
// ---------------------------------------------------------------------------

const safetyEntries = [
  { code: 'AVIS-01', text: 'Ne payez jamais avant de visiter le logement en personne.' },
  { code: 'AVIS-02', text: 'Exigez un contrat de bail ecrit avant tout paiement.' },
  { code: 'AVIS-03', text: "Verifiez l'identite du proprietaire sur la plateforme." },
  { code: 'AVIS-04', text: 'Signalez tout comportement suspect a notre equipe.' },
];

// ---------------------------------------------------------------------------
// Section header component
// ---------------------------------------------------------------------------

function DossierSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-4">
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Data row component (label + value in 2-col)
// ---------------------------------------------------------------------------

function DataRow({
  label,
  value,
  className,
}: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 py-1.5', className)}>
      <span className="font-mono text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="font-mono text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CostCalcA — "Ledger Classic" — Refined Split Dossier
// ---------------------------------------------------------------------------

export function CostCalcA({
  property,
  images,
  enabledAmenities,
  totalEntry,
  isSaved,
  isSignedIn,
  locale,
  onToggleSave,
  onContactClick,
  onOpenGallery,
  formatCurrency,
  formatListingDate,
}: PropertyVariationProps) {
  const isVerified = property.verificationStatus === 'approved';
  const truncatedId = String(property._id).slice(0, 8).toUpperCase();
  const landlordName = [property.landlord?.firstName, property.landlord?.lastName]
    .filter(Boolean)
    .join(' ');
  const landlordInitials = [property.landlord?.firstName?.[0], property.landlord?.lastName?.[0]]
    .filter(Boolean)
    .join('');

  const cautionTotal = property.rentAmount * property.cautionMonths;
  const advanceTotal = property.rentAmount * property.upfrontMonths;

  const receiptRows = [
    { label: 'Loyer mensuel', amount: property.rentAmount, detail: 'par mois' },
    {
      label: `Caution (${property.cautionMonths} mois)`,
      amount: cautionTotal,
      detail: `${property.cautionMonths}x loyer`,
    },
    {
      label: `Avance (${property.upfrontMonths} mois)`,
      amount: advanceTotal,
      detail: `${property.upfrontMonths}x loyer`,
    },
  ];

  const projections = [
    { label: '1 mois', amount: totalEntry },
    { label: '3 mois', amount: totalEntry + property.rentAmount * 2 },
    { label: '6 mois', amount: totalEntry + property.rentAmount * 5 },
    { label: '12 mois', amount: totalEntry + property.rentAmount * 11 },
  ];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: property.title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Lien copié !');
    }
  };

  // -------------------------------------------------------------------------
  // LEFT PANEL — Scrollable Dossier
  // -------------------------------------------------------------------------

  const leftPanel = (
    <div className="flex-1 lg:w-[57%] lg:min-w-0 overflow-y-auto bg-card">
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-8 space-y-8">
        {/* ---- 1. DOSSIER HEADER ---- */}
        <header className="border-b-2 border-border pb-6 anim-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                DOSSIER
              </span>
              <span className="font-mono text-sm text-foreground">{truncatedId}</span>
            </div>
            {isVerified && (
              <span className="inline-block border-2 border-success text-success font-mono uppercase text-xs px-3 py-1 rotate-[-3deg] font-bold tracking-wider">
                VERIFIE
              </span>
            )}
          </div>
          <p className="font-mono text-[10px] text-muted-foreground mb-4">
            {formatListingDate(property._creationTime, locale)}
          </p>
          <h1 className="text-2xl font-bold text-foreground mb-2 font-mono">{property.title}</h1>
          <div className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {property.neighborhood ? `${property.neighborhood}, ${property.city}` : property.city}
            </span>
          </div>
          <DataRow
            label="TYPE"
            value={propertyTypeLabels[property.propertyType] ?? property.propertyType}
            className="mt-3"
          />
        </header>

        {/* ---- 2. ACTION BAR ---- */}
        <div className="flex items-center gap-2 anim-fade-in-up">
          <button
            type="button"
            onClick={onToggleSave}
            className={cn(
              'inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest px-3 py-2 border border-border rounded-sm transition-colors',
              isSaved
                ? 'bg-primary/10 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground hover:border-foreground'
            )}
          >
            <Heart className={cn('w-3.5 h-3.5', isSaved && 'fill-primary')} />
            {isSaved ? 'Sauvegarde' : 'Sauvegarder'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest px-3 py-2 border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Partager
          </button>
          {images.length > 0 && (
            <button
              type="button"
              onClick={() => onOpenGallery(0)}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest px-3 py-2 border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <Images className="w-3.5 h-3.5" />
              Photos ({images.length})
            </button>
          )}
        </div>

        {/* ---- 3. ANALYSE FINANCIERE ---- */}
        <section className="anim-fade-in-up-delay-1">
          <DossierSectionLabel>ANALYSE FINANCIERE</DossierSectionLabel>

          {/* Receipt-style breakdown */}
          <div className="space-y-0">
            {receiptRows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline py-2.5 border-b border-dotted border-border"
              >
                <span className="font-mono text-xs text-muted-foreground shrink-0">
                  {row.label}
                </span>
                <span className="flex-1 mx-3" />
                <span className="font-mono text-sm tabular-nums font-semibold text-foreground">
                  {formatCurrency(row.amount, locale)}
                </span>
              </div>
            ))}

            {/* Total row */}
            <div className="flex items-baseline py-3 border-t-2 border-foreground mt-1">
              <span className="font-mono text-xs font-bold text-foreground shrink-0">
                {"TOTAL A L'ENTREE"}
              </span>
              <span className="flex-1 mx-3" />
              <span className="font-mono text-lg tabular-nums font-bold text-primary">
                {formatCurrency(totalEntry, locale)}
              </span>
            </div>
          </div>

          {/* 12-month projection mini-table */}
          <div className="mt-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              Projection 12 mois
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-border bg-border">
              {projections.map((row, i) => (
                <div key={row.label} className="bg-card p-3 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    {row.label}
                  </p>
                  <p
                    className={cn(
                      'font-mono tabular-nums text-sm font-semibold',
                      i === projections.length - 1 ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {formatCurrency(row.amount, locale)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 4. DESCRIPTION ---- */}
        {property.description && (
          <section className="anim-fade-in-up-delay-2">
            <DossierSectionLabel>DESCRIPTION</DossierSectionLabel>
            <p className="font-mono text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
              {property.description}
            </p>
          </section>
        )}

        {/* ---- 5. MAP + DIRECTIONS ---- */}
        {property.location && (
          <section className="anim-fade-in-up">
            <DossierSectionLabel>LOCALISATION</DossierSectionLabel>
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="h-[300px]">
                <PropertyDetailMapWrapper
                  latitude={property.location.latitude}
                  longitude={property.location.longitude}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="font-mono text-xs text-muted-foreground">
                {property.addressLine1
                  ? `${property.addressLine1}, ${property.city}`
                  : property.neighborhood
                    ? `${property.neighborhood}, ${property.city}`
                    : property.city}
              </p>
              <DirectionsButton
                latitude={property.location.latitude}
                longitude={property.location.longitude}
              />
            </div>
          </section>
        )}

        {/* ---- 6. EQUIPEMENTS ---- */}
        <section className="anim-fade-in-up">
          <DossierSectionLabel>EQUIPEMENTS</DossierSectionLabel>
          <div className="space-y-0">
            {allAmenityKeys.map((key) => {
              const config = amenityConfig[key];
              if (!config) return null;
              const isEnabled = !!property.amenities?.[key];
              const isEssential = essentialAmenityKeys.includes(key);

              return (
                <div
                  key={key}
                  className={cn(
                    'flex items-center justify-between py-2 border-b border-border last:border-b-0',
                    !isEnabled && 'opacity-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'font-mono text-xs',
                        isEnabled ? 'text-success' : 'text-muted-foreground'
                      )}
                    >
                      {isEnabled ? '[✓]' : '[—]'}
                    </span>
                    <span className="font-mono text-sm text-foreground">{config.label}</span>
                    {isEssential && (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-primary border border-primary/30 px-1.5 py-0.5 rounded-sm">
                        ESSENTIEL
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'font-mono text-[10px] uppercase tracking-widest',
                      isEnabled ? 'text-success' : 'text-muted-foreground'
                    )}
                  >
                    {isEnabled ? 'CONFIRME' : 'NON INCLUS'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---- 7. PROPRIETAIRE ---- */}
        {property.landlord && (
          <section className="anim-fade-in-up">
            <DossierSectionLabel>PROPRIETAIRE</DossierSectionLabel>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12">
                {property.landlord.profileImageUrl && (
                  <AvatarImage
                    src={property.landlord.profileImageUrl}
                    alt={landlordName || 'Proprietaire'}
                  />
                )}
                <AvatarFallback className="font-mono text-sm bg-muted text-muted-foreground">
                  {landlordInitials || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-mono text-sm font-bold text-foreground">
                  {landlordName || 'Proprietaire'}
                </p>
                {property.landlord.idVerified && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-success">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    IDENTITE VERIFIEE
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-0">
              <DataRow label="NOM" value={landlordName || 'Non renseigne'} />
              <DataRow
                label="VERIFICATION"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={cn(
                        'pulse-dot inline-block h-2 w-2 rounded-full',
                        property.landlord.idVerified ? 'bg-success' : 'bg-muted-foreground/30'
                      )}
                    />
                    <span
                      className={cn(
                        'font-mono text-xs',
                        property.landlord.idVerified ? 'text-success' : 'text-muted-foreground'
                      )}
                    >
                      {property.landlord.idVerified ? 'VERIFIEE' : 'NON VERIFIEE'}
                    </span>
                  </span>
                }
              />
              <DataRow
                label="DATE PUBLICATION"
                value={formatListingDate(property._creationTime, locale)}
              />
            </div>
          </section>
        )}

        {/* ---- 8. SECURITE ---- */}
        <section className="anim-fade-in-up">
          <DossierSectionLabel>
            <span className="inline-flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              SECURITE
            </span>
          </DossierSectionLabel>
          <div className="space-y-2.5">
            {safetyEntries.map((entry) => (
              <p
                key={entry.code}
                className="font-mono text-[11px] leading-relaxed text-muted-foreground"
              >
                <span className="text-foreground/60">[{entry.code}]</span> {entry.text}
              </p>
            ))}
          </div>
        </section>

        {/* ---- 9. CTA (desktop only) ---- */}
        <div className="pt-4 pb-8 hidden lg:block">
          {isSignedIn ? (
            <button
              type="button"
              onClick={onContactClick}
              className="dusk-btn-amber w-full justify-center font-mono text-xs uppercase tracking-widest"
            >
              <MessageCircle className="h-4 w-4" />
              Contacter le proprietaire
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="dusk-btn-amber w-full justify-center font-mono text-xs uppercase tracking-widest"
            >
              <LogIn className="h-4 w-4" />
              Se connecter pour contacter
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // RIGHT PANEL — Sticky Carousel (desktop only)
  // -------------------------------------------------------------------------

  const rightPanel = (
    <div className="hidden lg:block lg:w-[43%] sticky top-0 h-screen bg-background overflow-hidden">
      <div className="relative h-full">
        {images.length > 0 ? (
          <Carousel
            opts={{ loop: true }}
            className="relative h-full [&>[data-slot=carousel-content]]:h-full"
          >
            <CarouselContent className="h-full -ml-0">
              {images.map((src, i) => (
                <CarouselItem key={src} className="pl-0 h-full">
                  <button
                    type="button"
                    onClick={() => onOpenGallery(i)}
                    className="relative block w-full h-full cursor-pointer"
                  >
                    <Image
                      src={src}
                      alt={`${property.title} - ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="43vw"
                      priority={i === 0}
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-black/40 text-white border-0 hover:bg-black/60" />
            <CarouselNext className="right-4 bg-black/40 text-white border-0 hover:bg-black/60" />

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            {/* Text overlay */}
            <div className="absolute bottom-[4.5rem] left-5 right-5 z-10 pointer-events-none">
              <p className="font-mono text-white text-2xl font-bold truncate [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
                {property.title}
              </p>
              <p className="font-mono text-white/80 text-sm tabular-nums mt-1 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
                {formatCurrency(property.rentAmount, locale)}/mois
              </p>
            </div>

            {/* Thumbnail strip — overlaid at very bottom */}
            {images.length > 1 && (
              <div className="absolute bottom-0 inset-x-0 z-20 flex gap-1.5 p-2.5 overflow-x-auto scrollbar-hide">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => onOpenGallery(i)}
                    className="relative flex-shrink-0 h-12 w-18 overflow-hidden rounded-sm border border-white/20 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Image
                      src={src}
                      alt={`${property.title} - ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </button>
                ))}
              </div>
            )}
          </Carousel>
        ) : (
          <div className="h-full flex items-center justify-center bg-muted">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              NO_IMAGE_DATA
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // MOBILE — Carousel on top
  // -------------------------------------------------------------------------

  const mobileCarousel = (
    <div className="lg:hidden">
      {images.length > 0 ? (
        <Carousel opts={{ loop: true }} className="relative">
          <CarouselContent className="-ml-0">
            {images.map((src, i) => (
              <CarouselItem key={src} className="pl-0">
                <button
                  type="button"
                  onClick={() => onOpenGallery(i)}
                  className="relative block w-full h-[320px] overflow-hidden cursor-pointer"
                >
                  <Image
                    src={src}
                    alt={`${property.title} - ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={i === 0}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-black/40 text-white border-0 hover:bg-black/60" />
          <CarouselNext className="right-4 bg-black/40 text-white border-0 hover:bg-black/60" />

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
            <p className="font-mono text-white text-2xl font-bold truncate [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
              {property.title}
            </p>
            <p className="font-mono text-white/80 text-sm tabular-nums mt-1 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
              {formatCurrency(property.rentAmount, locale)}/mois
            </p>
          </div>
        </Carousel>
      ) : (
        <div className="flex h-[200px] items-center justify-center bg-muted">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            NO_IMAGE_DATA
          </span>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------------------
  // MOBILE BOTTOM BAR
  // -------------------------------------------------------------------------

  const mobileBottomBar = (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            TOTAL ENTREE
          </p>
          <p className="font-mono text-base font-bold tabular-nums text-foreground truncate">
            {formatCurrency(totalEntry, locale)}
          </p>
        </div>
        {isSignedIn ? (
          <button
            type="button"
            onClick={onContactClick}
            className="dusk-btn-amber shrink-0 font-mono text-xs uppercase tracking-widest"
          >
            <MessageCircle className="h-4 w-4" />
            Contacter
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="dusk-btn-amber shrink-0 font-mono text-xs uppercase tracking-widest"
          >
            <LogIn className="h-4 w-4" />
            Se connecter
          </Link>
        )}
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------

  return (
    <>
      {/* Mobile: carousel on top, then dossier below */}
      {mobileCarousel}

      {/* Desktop: split-screen layout */}
      <div className="flex min-h-screen pb-24 lg:pb-0">
        {leftPanel}
        {rightPanel}
      </div>

      {mobileBottomBar}
    </>
  );
}
