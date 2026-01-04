/**
 * Piol Design System - Design Tokens
 * Single source of truth for all design values
 * 
 * Inspired by Airbnb's warm, trust-focused UI
 */

// =============================================================================
// BRAND
// =============================================================================

export const brand = {
  name: 'Piol',
  tagline: 'Trouvez votre chez-vous',
  taglineEn: 'Find your home',
  colors: {
    coral: '#FF385C',      // Primary brand color
    coralDark: '#E31C5F',  // Hover/pressed state
    coralLight: '#FF5A7D', // Light variant
    coralPale: '#FFE4E8',  // Very light bg
  },
} as const;

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // Brand
  primary: brand.colors.coral,
  primaryHover: brand.colors.coralDark,
  primaryLight: brand.colors.coralLight,
  primaryPale: brand.colors.coralPale,

  // Neutrals (Airbnb-inspired)
  background: '#FFFFFF',
  foreground: '#222222',
  muted: '#717171',           // Airbnb's signature gray
  mutedLight: '#B0B0B0',      // Lighter gray
  subtle: '#F7F7F7',          // Light backgrounds
  border: '#DDDDDD',          // Softer borders
  borderLight: '#EBEBEB',     // Very light borders

  // Semantic
  success: '#008A05',         // Verification green
  successLight: '#E6F4E7',
  warning: '#C13515',         // Alert/error
  warningLight: '#FDECEA',
  info: '#1A73E8',            // Info blue
  infoLight: '#E8F0FE',

  // Cards
  card: '#FFFFFF',
  cardHover: '#F7F7F7',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

// =============================================================================
// RADIUS
// =============================================================================

export const radius = {
  none: '0px',
  xs: '4px',       // Very small elements
  sm: '8px',       // Small elements, badges
  md: '12px',      // Cards, inputs (Airbnb default)
  lg: '16px',      // Larger cards
  xl: '24px',      // Hero sections, modals
  '2xl': '32px',   // Large decorative
  full: '9999px',  // Pills, avatars
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  // Card shadows (Airbnb-style)
  card: '0 6px 16px rgba(0, 0, 0, 0.12)',
  cardHover: '0 6px 20px rgba(0, 0, 0, 0.18)',
  cardLift: '0 12px 28px rgba(0, 0, 0, 0.15)',

  // UI shadows
  dropdown: '0 2px 16px rgba(0, 0, 0, 0.12)',
  modal: '0 8px 28px rgba(0, 0, 0, 0.28)',
  tooltip: '0 2px 8px rgba(0, 0, 0, 0.15)',

  // Input focus
  focus: `0 0 0 2px ${brand.colors.coralPale}`,
  focusRing: `0 0 0 2px ${brand.colors.coral}`,
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fonts: {
    sans: 'var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'var(--font-mono), ui-monospace, "SF Mono", Monaco, monospace',
  },
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// =============================================================================
// Z-INDEX
// =============================================================================

export const zIndex = {
  dropdown: 50,
  sticky: 100,
  modal: 200,
  popover: 300,
  tooltip: 400,
  toast: 500,
} as const;

// =============================================================================
// CSS VARIABLES EXPORT
// For use in globals.css
// =============================================================================

export const cssVariables = {
  // Brand
  '--brand-coral': brand.colors.coral,
  '--brand-coral-dark': brand.colors.coralDark,
  '--brand-coral-light': brand.colors.coralLight,
  '--brand-coral-pale': brand.colors.coralPale,

  // Colors
  '--color-primary': colors.primary,
  '--color-primary-hover': colors.primaryHover,
  '--color-background': colors.background,
  '--color-foreground': colors.foreground,
  '--color-muted': colors.muted,
  '--color-subtle': colors.subtle,
  '--color-border': colors.border,
  '--color-success': colors.success,
  '--color-warning': colors.warning,

  // Radius
  '--radius-sm': radius.sm,
  '--radius-md': radius.md,
  '--radius-lg': radius.lg,
  '--radius-xl': radius.xl,
  '--radius-full': radius.full,

  // Shadows
  '--shadow-card': shadows.card,
  '--shadow-card-hover': shadows.cardHover,
  '--shadow-dropdown': shadows.dropdown,
} as const;

// Export everything as default for convenience
export default {
  brand,
  colors,
  radius,
  shadows,
  spacing,
  typography,
  breakpoints,
  transitions,
  zIndex,
  cssVariables,
};

