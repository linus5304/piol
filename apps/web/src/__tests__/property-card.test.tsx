import { PropertyCard } from '@/components/property-card';
import { render, screen } from '@testing-library/react';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'propertyTypes.studio': 'Studio',
      'propertyTypes.1br': '1 Chambre',
      'propertyTypes.2br': '2 Chambres',
      'propertyTypes.3br': '3 Chambres',
      'amenities.wifi': 'WiFi',
      'amenities.parking': 'Parking',
      'amenities.ac': 'Climatisation',
      'amenities.security': 'Sécurité',
    };
    return translations[key] || key;
  },
}));

const mockProperty = {
  _id: 'test-id-123',
  title: 'Beautiful Apartment in Douala',
  propertyType: '2br' as const,
  rentAmount: 150000,
  currency: 'XAF',
  city: 'Douala',
  neighborhood: 'Makepe',
  verificationStatus: 'approved',
  landlord: {
    _id: 'landlord-123',
    firstName: 'Jean',
    lastName: 'Dupont',
    idVerified: true,
  },
  amenities: {
    wifi: true,
    parking: true,
    ac: false,
    security: true,
  },
};

describe('PropertyCard', () => {
  it('renders property title', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Beautiful Apartment in Douala')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/150[\s,.]000 FCFA/)).toBeInTheDocument();
  });

  it('renders location', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Makepe/)).toBeInTheDocument();
  });

  it('renders property type badge', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('2 Chambres')).toBeInTheDocument();
  });

  it('renders verified badge for approved properties', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Vérifié/i)).toBeInTheDocument();
  });

  it('renders landlord name', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Jean Dupont/)).toBeInTheDocument();
  });

  it('renders amenity badges', () => {
    render(<PropertyCard property={mockProperty} />);
    // Should show wifi, parking, security (not ac since it's false)
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Sécurité')).toBeInTheDocument();
  });

  it('does not render verified badge when neither property nor landlord is verified', () => {
    const unverifiedProperty = {
      ...mockProperty,
      verificationStatus: 'pending',
      landlord: {
        ...mockProperty.landlord,
        idVerified: false,
      },
      landlordVerified: false,
    };
    render(<PropertyCard property={unverifiedProperty} />);
    expect(screen.queryByText(/Vérifié/i)).not.toBeInTheDocument();
  });

  it('shows verified badge when landlord is verified even if property is not', () => {
    const landlordVerifiedProperty = {
      ...mockProperty,
      verificationStatus: 'pending',
      landlord: {
        ...mockProperty.landlord,
        idVerified: true,
      },
    };
    render(<PropertyCard property={landlordVerifiedProperty} />);
    expect(screen.getByText(/Vérifié/i)).toBeInTheDocument();
  });
});
