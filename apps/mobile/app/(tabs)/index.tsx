import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/PropertyCard';

// Type for property items
interface PropertyItem {
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

// Type for properties list response
interface PropertiesResult {
  properties: PropertyItem[];
  nextCursor?: string | null;
}

// Conditionally import Convex
let api: unknown = null;
let useQuery: (query: unknown, args?: { limit: number }) => PropertiesResult | undefined = () =>
  undefined;

try {
  api = require('../../convex/_generated/api').api;
  const convex = require('convex/react');
  useQuery = convex.useQuery;
} catch (e) {
  console.warn('Convex not available');
}

// Mock data for demo mode
const mockProperties: PropertyItem[] = [
  {
    _id: '1',
    title: 'Beautiful Studio in Bonapriso',
    propertyType: 'studio',
    rentAmount: 75000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonapriso',
    verificationStatus: 'approved',
    landlord: { _id: 'l1', firstName: 'Jean', lastName: 'Kamga', idVerified: true },
  },
  {
    _id: '2',
    title: 'Modern 2BR Apartment Bastos',
    propertyType: '2br',
    rentAmount: 150000,
    currency: 'XAF',
    city: 'Yaoundé',
    neighborhood: 'Bastos',
    verificationStatus: 'approved',
    landlord: { _id: 'l2', firstName: 'Marie', lastName: 'Fotso', idVerified: true },
  },
  {
    _id: '3',
    title: 'Cozy House in Buea',
    propertyType: 'house',
    rentAmount: 120000,
    currency: 'XAF',
    city: 'Buea',
    neighborhood: 'Mile 17',
    verificationStatus: 'approved',
    landlord: { _id: 'l3', firstName: 'Peter', lastName: 'Tabi', idVerified: false },
  },
  {
    _id: '4',
    title: 'Luxury Villa with Pool',
    propertyType: 'villa',
    rentAmount: 500000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonanjo',
    verificationStatus: 'approved',
    landlord: { _id: 'l4', firstName: 'Alice', lastName: 'Ngo', idVerified: true },
  },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Use Convex query if available, otherwise use mock data
  const convexResult: PropertiesResult | undefined = api
    ? useQuery((api as { properties: { listProperties: unknown } }).properties.listProperties, {
        limit: 20,
      })
    : undefined;
  const propertiesResult: PropertiesResult = convexResult ?? { properties: mockProperties };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Convex will automatically refetch
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </View>

      <View style={styles.quickFilters}>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterChipText}>{t('filters.all')}</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterChipText}>{t('filters.verified')}</Text>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Text style={styles.filterChipText}>{t('filters.nearMe')}</Text>
        </Pressable>
      </View>

      <FlashList<PropertyItem>
        data={propertiesResult?.properties ?? []}
        renderItem={({ item }) => (
          <PropertyCard property={item} onPress={() => handlePropertyPress(item._id)} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {propertiesResult === undefined ? t('common.loading') : t('home.noProperties')}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  quickFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipText: {
    fontSize: 14,
    color: '#374151',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
