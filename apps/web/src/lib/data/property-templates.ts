import type { AmenityId, City, PropertyType } from '@/lib/validations';

export interface PropertyTemplate {
  id: string;
  propertyType: PropertyType;
  city: City;
  rentRange: { min: number; max: number };
  defaultRent: number;
  defaultCautionMonths: number;
  defaultUpfrontMonths: number;
  defaultAmenities: AmenityId[];
}

export const PROPERTY_TEMPLATES: PropertyTemplate[] = [
  // Studios
  {
    id: 'studio-douala',
    propertyType: 'studio',
    city: 'Douala',
    rentRange: { min: 25000, max: 50000 },
    defaultRent: 35000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  {
    id: 'studio-yaounde',
    propertyType: 'studio',
    city: 'Yaoundé',
    rentRange: { min: 25000, max: 50000 },
    defaultRent: 35000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  {
    id: 'studio-buea',
    propertyType: 'studio',
    city: 'Buea',
    rentRange: { min: 20000, max: 40000 },
    defaultRent: 30000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247'],
  },
  // 1 Bedroom
  {
    id: '1br-douala',
    propertyType: '1br',
    city: 'Douala',
    rentRange: { min: 40000, max: 75000 },
    defaultRent: 50000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  {
    id: '1br-yaounde',
    propertyType: '1br',
    city: 'Yaoundé',
    rentRange: { min: 40000, max: 75000 },
    defaultRent: 50000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  // 2 Bedrooms
  {
    id: '2br-douala',
    propertyType: '2br',
    city: 'Douala',
    rentRange: { min: 60000, max: 120000 },
    defaultRent: 75000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking'],
  },
  {
    id: '2br-yaounde',
    propertyType: '2br',
    city: 'Yaoundé',
    rentRange: { min: 60000, max: 120000 },
    defaultRent: 75000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking'],
  },
  {
    id: '2br-bafoussam',
    propertyType: '2br',
    city: 'Bafoussam',
    rentRange: { min: 40000, max: 80000 },
    defaultRent: 50000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247'],
  },
  // 3 Bedrooms
  {
    id: '3br-douala',
    propertyType: '3br',
    city: 'Douala',
    rentRange: { min: 100000, max: 200000 },
    defaultRent: 150000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security'],
  },
  {
    id: '3br-yaounde',
    propertyType: '3br',
    city: 'Yaoundé',
    rentRange: { min: 100000, max: 200000 },
    defaultRent: 150000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security'],
  },
  // Apartments
  {
    id: 'apartment-douala',
    propertyType: 'apartment',
    city: 'Douala',
    rentRange: { min: 75000, max: 150000 },
    defaultRent: 100000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security'],
  },
  {
    id: 'apartment-yaounde',
    propertyType: 'apartment',
    city: 'Yaoundé',
    rentRange: { min: 75000, max: 150000 },
    defaultRent: 100000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security'],
  },
  // Houses
  {
    id: 'house-douala',
    propertyType: 'house',
    city: 'Douala',
    rentRange: { min: 100000, max: 250000 },
    defaultRent: 150000,
    defaultCautionMonths: 3,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security', 'garden'],
  },
  {
    id: 'house-yaounde',
    propertyType: 'house',
    city: 'Yaoundé',
    rentRange: { min: 100000, max: 250000 },
    defaultRent: 150000,
    defaultCautionMonths: 3,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'parking', 'security', 'garden'],
  },
  {
    id: 'house-buea',
    propertyType: 'house',
    city: 'Buea',
    rentRange: { min: 60000, max: 150000 },
    defaultRent: 100000,
    defaultCautionMonths: 2,
    defaultUpfrontMonths: 6,
    defaultAmenities: ['water247', 'electricity247', 'garden'],
  },
  // Villas
  {
    id: 'villa-douala',
    propertyType: 'villa',
    city: 'Douala',
    rentRange: { min: 200000, max: 500000 },
    defaultRent: 300000,
    defaultCautionMonths: 3,
    defaultUpfrontMonths: 6,
    defaultAmenities: [
      'water247',
      'electricity247',
      'parking',
      'security',
      'ac',
      'garden',
      'furnished',
    ],
  },
  {
    id: 'villa-yaounde',
    propertyType: 'villa',
    city: 'Yaoundé',
    rentRange: { min: 200000, max: 500000 },
    defaultRent: 300000,
    defaultCautionMonths: 3,
    defaultUpfrontMonths: 6,
    defaultAmenities: [
      'water247',
      'electricity247',
      'parking',
      'security',
      'ac',
      'garden',
      'furnished',
    ],
  },
];

/** Get templates filtered by city */
export function getTemplatesByCity(city: City): PropertyTemplate[] {
  return PROPERTY_TEMPLATES.filter((t) => t.city === city);
}

/** Generate a title from form data */
export function generateTitle(
  propertyTypeName: string,
  city: string,
  neighborhood?: string
): string {
  if (!propertyTypeName || !city) return '';
  return neighborhood
    ? `${propertyTypeName} à ${neighborhood}, ${city}`
    : `${propertyTypeName} à ${city}`;
}

/** Format number with dot separators (Cameroon style) */
function formatCFA(n: number): string {
  return n.toLocaleString('fr-FR');
}

/** Generate template label: "Studio à Douala" */
export function getTemplateLabel(template: PropertyTemplate, propertyTypeName: string): string {
  return `${propertyTypeName} à ${template.city}`;
}

/** Format rent range for display */
export function formatRentRange(range: { min: number; max: number }): string {
  return `${formatCFA(range.min)} - ${formatCFA(range.max)}`;
}
