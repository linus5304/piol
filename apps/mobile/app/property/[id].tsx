import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock property data
const mockProperty = {
  _id: 'prop-1',
  title: 'Appartement moderne 2 chambres à Makepe',
  description: `Découvrez ce magnifique appartement de 2 chambres situé dans le quartier calme de Makepe, Douala.

L'appartement comprend:
- Un salon spacieux et lumineux
- Une cuisine moderne entièrement équipée
- 2 chambres confortables avec placards intégrés
- Une salle de bain moderne avec douche
- Un balcon avec vue sur le quartier`,
  propertyType: '2br',
  rentAmount: 150000,
  currency: 'XAF',
  cautionMonths: 2,
  upfrontMonths: 6,
  city: 'Douala',
  neighborhood: 'Makepe',
  amenities: ['wifi', 'parking', 'security', 'water247', 'ac', 'balcony'],
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
  ],
  verificationStatus: 'approved',
  landlord: {
    name: 'Jean Kamga',
    verified: true,
    phone: '+237600000000',
    responseTime: 'Répond en 1h',
  },
};

const amenityLabels: Record<string, { label: string; icon: string }> = {
  wifi: { label: 'WiFi', icon: '📶' },
  parking: { label: 'Parking', icon: '🚗' },
  ac: { label: 'Climatisation', icon: '❄️' },
  security: { label: 'Sécurité 24h', icon: '🔐' },
  water247: { label: 'Eau 24/7', icon: '💧' },
  electricity247: { label: 'Électricité 24/7', icon: '⚡' },
  furnished: { label: 'Meublé', icon: '🛋️' },
  balcony: { label: 'Balcon', icon: '🌅' },
  garden: { label: 'Jardin', icon: '🌳' },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleContact = () => {
    if (!isSignedIn) {
      router.push('/(auth)/sign-in');
      return;
    }

    // Open WhatsApp or phone
    const phoneUrl = `tel:${mockProperty.landlord.phone}`;
    Linking.openURL(phoneUrl);
  };

  const handleWhatsApp = () => {
    if (!isSignedIn) {
      router.push('/(auth)/sign-in');
      return;
    }

    const message = encodeURIComponent(
      `Bonjour, je suis intéressé par: ${mockProperty.title}`
    );
    const whatsappUrl = `whatsapp://send?phone=${mockProperty.landlord.phone}&text=${message}`;
    Linking.openURL(whatsappUrl);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>←</Text>
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable onPress={() => {}} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>↗️</Text>
            </Pressable>
            <Pressable onPress={() => setIsSaved(!isSaved)} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>{isSaved ? '❤️' : '🤍'}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {mockProperty.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>

        {/* Image Indicators */}
        <View style={styles.imageIndicators}>
          {mockProperty.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.imageIndicator,
                index === currentImageIndex && styles.imageIndicatorActive,
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Verification Badge */}
          {mockProperty.verificationStatus === 'approved' && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>✓ Propriété vérifiée</Text>
            </View>
          )}

          {/* Title & Location */}
          <Text style={styles.title}>{mockProperty.title}</Text>
          <Text style={styles.location}>
            📍 {mockProperty.neighborhood}, {mockProperty.city}
          </Text>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatCurrency(mockProperty.rentAmount)}</Text>
            <Text style={styles.priceUnit}>/mois</Text>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Text style={styles.quickInfoLabel}>Caution</Text>
              <Text style={styles.quickInfoValue}>
                {formatCurrency(mockProperty.rentAmount * mockProperty.cautionMonths)}
              </Text>
            </View>
            <View style={styles.quickInfoDivider} />
            <View style={styles.quickInfoItem}>
              <Text style={styles.quickInfoLabel}>Avance ({mockProperty.upfrontMonths} mois)</Text>
              <Text style={styles.quickInfoValue}>
                {formatCurrency(mockProperty.rentAmount * mockProperty.upfrontMonths)}
              </Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Équipements</Text>
            <View style={styles.amenitiesGrid}>
              {mockProperty.amenities.map((amenityKey) => {
                const amenity = amenityLabels[amenityKey];
                if (!amenity) return null;
                return (
                  <View key={amenityKey} style={styles.amenityItem}>
                    <Text style={styles.amenityIcon}>{amenity.icon}</Text>
                    <Text style={styles.amenityLabel}>{amenity.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{mockProperty.description}</Text>
          </View>

          {/* Landlord */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Propriétaire</Text>
            <View style={styles.landlordCard}>
              <View style={styles.landlordAvatar}>
                <Text style={styles.landlordAvatarText}>
                  {mockProperty.landlord.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.landlordInfo}>
                <View style={styles.landlordNameRow}>
                  <Text style={styles.landlordName}>{mockProperty.landlord.name}</Text>
                  {mockProperty.landlord.verified && (
                    <Text style={styles.landlordVerified}>✓</Text>
                  )}
                </View>
                <Text style={styles.landlordResponse}>
                  ⏱️ {mockProperty.landlord.responseTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Safety Tips */}
          <View style={styles.safetyTips}>
            <Text style={styles.safetyTitle}>🛡️ Conseils de sécurité</Text>
            <Text style={styles.safetyText}>
              • Visitez toujours la propriété avant de payer{'\n'}
              • Ne partagez jamais vos informations bancaires
            </Text>
          </View>

          {/* Spacer for bottom bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Contact Bar */}
      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={styles.bottomPrice}>{formatCurrency(mockProperty.rentAmount)}/mois</Text>
            <Text style={styles.bottomTotal}>
              Total: {formatCurrency(mockProperty.rentAmount * (mockProperty.cautionMonths + mockProperty.upfrontMonths))}
            </Text>
          </View>
          <View style={styles.bottomButtons}>
            <Pressable style={styles.whatsappButton} onPress={handleWhatsApp}>
              <Text style={styles.whatsappButtonText}>💬</Text>
            </Pressable>
            <Pressable style={styles.contactButton} onPress={handleContact}>
              <Text style={styles.contactButtonText}>Contacter</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButtonText: {
    fontSize: 18,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: width,
    height: width * 0.75,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  imageIndicatorActive: {
    backgroundColor: '#FF385C',
    width: 24,
  },
  content: {
    padding: 20,
  },
  verifiedBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  verifiedBadgeText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF385C',
  },
  priceUnit: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  quickInfo: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  quickInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickInfoDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },
  quickInfoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  quickInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  amenityIcon: {
    fontSize: 16,
  },
  amenityLabel: {
    fontSize: 14,
    color: '#374151',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  landlordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  landlordAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landlordAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  landlordInfo: {
    flex: 1,
  },
  landlordNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  landlordName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  landlordVerified: {
    color: '#10b981',
    fontWeight: '600',
  },
  landlordResponse: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  safetyTips: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 14,
    color: '#3b82f6',
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  bottomTotal: {
    fontSize: 12,
    color: '#6b7280',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  whatsappButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#25d366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappButtonText: {
    fontSize: 20,
  },
  contactButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

