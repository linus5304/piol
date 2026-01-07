import {
  Building2,
  CreditCard,
  Heart,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  MessageSquare,
  Phone,
  Search,
  Settings,
  User,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface NavItem {
  href: string;
  label: string;
  labelKey?: string; // i18n key
  icon?: LucideIcon;
  badge?: string | number;
  external?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

// =============================================================================
// MAIN NAVIGATION
// Public pages navigation
// =============================================================================

export const mainNav: NavItem[] = [
  {
    href: '/properties',
    label: 'Propriétés',
    labelKey: 'nav.properties',
    icon: Search,
  },
  {
    href: '/about',
    label: 'À propos',
    labelKey: 'nav.about',
    icon: Info,
  },
  {
    href: '/contact',
    label: 'Contact',
    labelKey: 'nav.contact',
    icon: Phone,
  },
];

// =============================================================================
// USER NAVIGATION
// Dropdown menu items when user is signed in
// =============================================================================

export const userNavBase: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    labelKey: 'nav.dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/messages',
    label: 'Messages',
    labelKey: 'nav.messages',
    icon: MessageSquare,
  },
];

export const userNavRenter: NavItem[] = [
  ...userNavBase,
  {
    href: '/dashboard/saved',
    label: 'Favoris',
    labelKey: 'nav.saved',
    icon: Heart,
  },
];

export const userNavLandlord: NavItem[] = [
  ...userNavBase,
  {
    href: '/dashboard/properties',
    label: 'Mes biens',
    labelKey: 'nav.myProperties',
    icon: Building2,
  },
  {
    href: '/dashboard/payments',
    label: 'Paiements',
    labelKey: 'nav.payments',
    icon: CreditCard,
  },
];

export const userNavAdmin: NavItem[] = [
  ...userNavBase,
  {
    href: '/dashboard/properties',
    label: 'Propriétés',
    labelKey: 'nav.properties',
    icon: Building2,
  },
  {
    href: '/dashboard/payments',
    label: 'Paiements',
    labelKey: 'nav.payments',
    icon: CreditCard,
  },
];

// Settings & Logout (separate section)
export const userNavSettings: NavItem[] = [
  {
    href: '/dashboard/settings',
    label: 'Paramètres',
    labelKey: 'nav.settings',
    icon: Settings,
  },
];

// =============================================================================
// SIDEBAR NAVIGATION (Dashboard)
// =============================================================================

export const sidebarNavRenter: NavSection[] = [
  {
    title: 'Menu',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/properties', label: 'Rechercher', icon: Search },
      { href: '/dashboard/saved', label: 'Favoris', icon: Heart },
      { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    ],
  },
  {
    title: 'Compte',
    items: [{ href: '/dashboard/settings', label: 'Paramètres', icon: Settings }],
  },
];

export const sidebarNavLandlord: NavSection[] = [
  {
    title: 'Menu',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/properties', label: 'Mes biens', icon: Building2 },
      { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
      { href: '/dashboard/payments', label: 'Paiements', icon: CreditCard },
    ],
  },
  {
    title: 'Compte',
    items: [{ href: '/dashboard/settings', label: 'Paramètres', icon: Settings }],
  },
];

// =============================================================================
// FOOTER NAVIGATION
// =============================================================================

export const footerNav = {
  quickLinks: [
    { href: '/properties', label: 'Propriétés', labelKey: 'nav.properties' },
    { href: '/about', label: 'À propos', labelKey: 'nav.about' },
    { href: '/contact', label: 'Contact', labelKey: 'nav.contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Confidentialité', labelKey: 'footer.privacy' },
    { href: '/terms', label: 'Conditions', labelKey: 'footer.terms' },
  ],
  support: [
    { href: '/help', label: "Centre d'aide", labelKey: 'footer.help' },
    { href: '/faq', label: 'FAQ', labelKey: 'footer.faq' },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export type UserRole = 'renter' | 'landlord' | 'admin' | 'verifier';

export function getUserNav(role: UserRole): NavItem[] {
  switch (role) {
    case 'landlord':
      return userNavLandlord;
    case 'admin':
    case 'verifier':
      return userNavAdmin;
    default:
      return userNavRenter;
  }
}

export function getSidebarNav(role: UserRole): NavSection[] {
  switch (role) {
    case 'landlord':
    case 'admin':
    case 'verifier':
      return sidebarNavLandlord;
    default:
      return sidebarNavRenter;
  }
}

// =============================================================================
// METADATA DEFAULTS
// =============================================================================

export const siteConfig = {
  name: 'Piol',
  description:
    'Trouvez votre prochain logement au Cameroun. Annonces vérifiées, paiement sécurisé par Mobile Money.',
  descriptionEn:
    'Find your next home in Cameroon. Verified listings, secure Mobile Money payments.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://piol.cm',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/piolcm',
    facebook: 'https://facebook.com/piolcm',
  },
};
