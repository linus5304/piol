import { useMutation, useQuery } from 'convex/react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { formatCurrency } from '../lib/utils';

// Only import api if convex is available
let api: any = null;
try {
  api = require('../convex/_generated/api').api;
} catch (e) {
  console.warn('Convex API not available');
}

interface Property {
  _id: string;
  title: string;
  propertyType: string;
  rentAmount: number;
  currency: string;
  city: string;
  neighborhood?: string;
  images?: Array<{ storageId: string; url?: string; order: number }>;
  status?: string;
  verificationStatus?: string;
  landlord?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    idVerified: boolean;
  } | null;
}

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  showSaveButton?: boolean;
}

export function PropertyCard({ property, onPress, showSaveButton = true }: PropertyCardProps) {
  // Local state for optimistic updates when Convex is unavailable
  const [localSaved, setLocalSaved] = useState(false);
  
  // Only use Convex hooks if api is available
  const isSavedQuery = api ? useQuery(api.savedProperties.isPropertySaved, {
    propertyId: property._id as any,
  }) : undefined;
  
  const toggleSaveMutation = api ? useMutation(api.savedProperties.toggleSaveProperty) : null;
  
  const isSaved = isSavedQuery ?? localSaved;

  const handleSavePress = async () => {
    if (toggleSaveMutation) {
      try {
        await toggleSaveMutation({ propertyId: property._id as any });
      } catch (error) {
        console.error('Failed to toggle save:', error);
      }
    } else {
      // Fallback for demo mode
      setLocalSaved(!localSaved);
    }
  };

  const propertyTypeLabels: Record<string, string> = {
    studio: 'Studio',
    '1br': '1 Bedroom',
    '2br': '2 Bedrooms',
    '3br': '3 Bedrooms',
    '4br': '4 Bedrooms',
    house: 'House',
    apartment: 'Apartment',
    villa: 'Villa',
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {property.images && property.images.length > 0 && property.images[0].url ? (
          <Image
            source={{ uri: property.images[0].url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>🏠</Text>
          </View>
        )}

        {property.verificationStatus === 'approved' && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>✓ Verified</Text>
          </View>
        )}

        {showSaveButton && (
          <Pressable style={styles.saveButton} onPress={handleSavePress}>
            <Text style={styles.saveButtonText}>{isSaved ? '❤️' : '🤍'}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.price}>
            {formatCurrency(property.rentAmount, property.currency)}
            <Text style={styles.perMonth}>/mo</Text>
          </Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {propertyTypeLabels[property.propertyType] ?? property.propertyType}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          📍 {property.neighborhood ? `${property.neighborhood}, ` : ''}
          {property.city}
        </Text>

        {property.landlord && (
          <View style={styles.landlordInfo}>
            <Text style={styles.landlordName}>
              {property.landlord.firstName} {property.landlord.lastName}
            </Text>
            {property.landlord.idVerified && <Text style={styles.landlordVerified}>✓</Text>}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 18,
  },
  content: {
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  perMonth: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6b7280',
  },
  typeBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563eb',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  landlordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  landlordName: {
    fontSize: 13,
    color: '#6b7280',
  },
  landlordVerified: {
    fontSize: 12,
    color: '#10b981',
  },
});
