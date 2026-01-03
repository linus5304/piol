// Re-export Convex types for use across web and mobile apps
// These types are generated from the Convex schema

export type UserRole = 'renter' | 'landlord' | 'admin' | 'verifier';

export type PropertyType =
  | 'studio'
  | '1br'
  | '2br'
  | '3br'
  | '4br'
  | 'house'
  | 'apartment'
  | 'villa';

export type PropertyStatus =
  | 'draft'
  | 'pending_verification'
  | 'verified'
  | 'active'
  | 'rented'
  | 'archived';

export type VerificationStatus = 'pending' | 'in_progress' | 'approved' | 'rejected';

export type PaymentMethod = 'mtn_momo' | 'orange_money' | 'bank_transfer' | 'cash';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type TransactionType = 'rent_payment' | 'deposit' | 'commission' | 'refund';

export type EscrowStatus = 'held' | 'released' | 'refunded';

export type Language = 'fr' | 'en';

// Common interfaces
export interface PropertyImage {
  url: string;
  order: number;
}

export interface PropertyDocument {
  type: string;
  url: string;
  verified: boolean;
}

export interface VisitPhoto {
  url: string;
  timestamp: number;
}

export interface Reference {
  name: string;
  phone: string;
  relationship: string;
}

// Filter/Search types
export interface PropertyFilters {
  city?: string;
  neighborhood?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
  verificationStatus?: VerificationStatus;
  amenities?: string[];
}

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  total?: number;
}

// Payment types
export interface PaymentRequest {
  amount: number;
  currency?: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResult {
  success: boolean;
  method: PaymentMethod;
  referenceId?: string;
  paymentUrl?: string;
  payToken?: string;
  orderId?: string;
  requiresRedirect: boolean;
  message?: string;
}

// Notification types
export type NotificationType =
  | 'payment_received'
  | 'payment_confirmed'
  | 'payment_failed'
  | 'property_verified'
  | 'property_rejected'
  | 'new_message'
  | 'booking_request'
  | 'review_received';

// Amenity labels
export const AMENITY_LABELS: Record<string, { fr: string; en: string }> = {
  wifi: { fr: 'WiFi', en: 'WiFi' },
  parking: { fr: 'Parking', en: 'Parking' },
  ac: { fr: 'Climatisation', en: 'Air Conditioning' },
  security: { fr: 'Sécurité 24/7', en: '24/7 Security' },
  water247: { fr: 'Eau 24/7', en: '24/7 Water' },
  electricity247: { fr: 'Électricité 24/7', en: '24/7 Electricity' },
  furnished: { fr: 'Meublé', en: 'Furnished' },
  balcony: { fr: 'Balcon', en: 'Balcony' },
  garden: { fr: 'Jardin', en: 'Garden' },
  pool: { fr: 'Piscine', en: 'Swimming Pool' },
  gym: { fr: 'Salle de sport', en: 'Gym' },
};

// Property type labels
export const PROPERTY_TYPE_LABELS: Record<PropertyType, { fr: string; en: string }> = {
  studio: { fr: 'Studio', en: 'Studio' },
  '1br': { fr: '1 Chambre', en: '1 Bedroom' },
  '2br': { fr: '2 Chambres', en: '2 Bedrooms' },
  '3br': { fr: '3 Chambres', en: '3 Bedrooms' },
  '4br': { fr: '4 Chambres', en: '4 Bedrooms' },
  house: { fr: 'Maison', en: 'House' },
  apartment: { fr: 'Appartement', en: 'Apartment' },
  villa: { fr: 'Villa', en: 'Villa' },
};

// Major cities in Cameroon
export const CAMEROON_CITIES = [
  'Douala',
  'Yaoundé',
  'Bafoussam',
  'Bamenda',
  'Buea',
  'Kribi',
  'Limbe',
  'Garoua',
  'Maroua',
  'Ngaoundéré',
];
