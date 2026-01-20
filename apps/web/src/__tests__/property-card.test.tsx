import { PropertyCard } from '@/components/properties';
import { render, screen } from '@testing-library/react';

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
};

describe('PropertyCard', () => {
  it('renders property title', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Beautiful Apartment in Douala')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/150[\s,]000 FCFA/)).toBeInTheDocument();
  });

  it('renders location', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Makepe, Douala/)).toBeInTheDocument();
  });

  it('renders property type badge', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('2 Chambres')).toBeInTheDocument();
  });

  it('renders verified badge for approved properties', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/vérifié/i)).toBeInTheDocument();
  });

  it('renders landlord name', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Jean Dupont/)).toBeInTheDocument();
  });

  it('shows landlord verified checkmark', () => {
    render(<PropertyCard property={mockProperty} />);
    const landlordSection = screen.getByText(/Jean Dupont/).closest('div');
    expect(landlordSection).toHaveTextContent('✓');
  });

  it('does not render verified badge for non-approved properties', () => {
    const unverifiedProperty = {
      ...mockProperty,
      verificationStatus: 'pending',
    };
    render(<PropertyCard property={unverifiedProperty} />);
    expect(screen.queryByText(/vérifié/i)).not.toBeInTheDocument();
  });
});
