import type { Id } from '@repo/convex/_generated/dataModel';
import type { LucideIcon } from 'lucide-react';
import { Armchair, Car, Droplet, Shield, Sun, TreePine, Wifi, Wind, Zap } from 'lucide-react';

// ---------------------------------------------------------------------------
// Shared configuration
// ---------------------------------------------------------------------------

export const amenityConfig: Record<string, { label: string; icon: LucideIcon }> = {
  wifi: { label: 'WiFi inclus', icon: Wifi },
  parking: { label: 'Parking privé', icon: Car },
  ac: { label: 'Climatisation', icon: Wind },
  security: { label: 'Sécurité 24h/24', icon: Shield },
  water247: { label: 'Eau disponible 24/7', icon: Droplet },
  electricity247: { label: 'Électricité stable', icon: Zap },
  furnished: { label: 'Entièrement meublé', icon: Armchair },
  balcony: { label: 'Balcon avec vue', icon: Sun },
  garden: { label: 'Accès jardin', icon: TreePine },
};

/** Essential amenities for Cameroon renters (used by Cost Calculator + Editorial). */
export const essentialAmenityKeys = ['water247', 'electricity247', 'security', 'wifi'];

/** All 9 amenity keys (used by Dashboard variation to show on/off). */
export const allAmenityKeys = Object.keys(amenityConfig);

export const propertyTypeLabels: Record<string, string> = {
  studio: 'Studio',
  '1br': '1 Chambre',
  '2br': '2 Chambres',
  '3br': '3 Chambres',
  '4br': '4 Chambres',
  house: 'Maison',
  apartment: 'Appartement',
  villa: 'Villa',
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PropertyLandlord {
  _id: Id<'users'>;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string | null;
  idVerified: boolean;
}

export interface PropertyReviews {
  averageRating: number | null;
  count: number;
}

export interface PropertyData {
  _id: Id<'properties'>;
  _creationTime: number;
  title: string;
  description?: string;
  propertyType: string;
  rentAmount: number;
  currency: string;
  cautionMonths: number;
  upfrontMonths: number;
  city: string;
  neighborhood?: string;
  addressLine1?: string;
  location?: { latitude: number; longitude: number };
  verificationStatus: string;
  amenities?: Record<string, boolean | undefined>;
  landlord?: PropertyLandlord | null;
  reviews: PropertyReviews;
}

/** Props for the property detail variation component. */
export interface PropertyVariationProps {
  property: PropertyData;
  images: string[];
  enabledAmenities: string[];
  totalEntry: number;
  isSaved: boolean;
  isSignedIn: boolean;
  locale: string;
  onToggleSave: () => void;
  onContactClick: () => void;
  onOpenGallery: (imageIndex: number) => void;
  formatCurrency: (amount: number, locale: string) => string;
  formatListingDate: (timestamp: number, locale: string) => string;
}
