import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/PropertyCard';
import { useDebounce } from '../../hooks/useDebounce';

// Conditionally import Convex
let api: any = null;
let useQuery: any = () => undefined;

try {
  api = require('../../convex/_generated/api').api;
  const convex = require('convex/react');
  useQuery = convex.useQuery;
} catch (e) {
  console.warn('Convex not available');
}

// Mock data for demo mode
const mockSearchResults = [
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
];

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>();

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Use Convex if available
  const convexResults = api && debouncedQuery.length >= 2
    ? useQuery(api.properties.searchProperties, { 
        searchQuery: debouncedQuery, 
        city: selectedCity, 
        limit: 30 
      })
    : undefined;

  // For demo mode, filter mock data based on search query
  const demoResults = debouncedQuery.length >= 2 
    ? mockSearchResults.filter(p => 
        p.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.neighborhood?.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : [];

  const searchResults = api ? convexResults : demoResults;

  const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Buea', 'Kribi'];

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('search.title')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('search.placeholder')}
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.cityFilters}>
        <Pressable
          style={[styles.cityChip, !selectedCity && styles.cityChipActive]}
          onPress={() => setSelectedCity(undefined)}
        >
          <Text style={[styles.cityChipText, !selectedCity && styles.cityChipTextActive]}>
            {t('filters.allCities')}
          </Text>
        </Pressable>
        {cities.map((city) => (
          <Pressable
            key={city}
            style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
            onPress={() => setSelectedCity(city)}
          >
            <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>
              {city}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlashList
        data={searchResults ?? []}
        renderItem={({ item }) => (
          <PropertyCard property={item} onPress={() => handlePropertyPress(item._id)} />
        )}
        estimatedItemSize={280}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery.length < 2
                ? t('search.enterQuery')
                : searchResults === undefined
                  ? t('common.loading')
                  : t('search.noResults')}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cityFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  cityChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cityChipActive: {
    backgroundColor: '#FF385C',
    borderColor: '#FF385C',
  },
  cityChipText: {
    fontSize: 14,
    color: '#374151',
  },
  cityChipTextActive: {
    color: '#fff',
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
    textAlign: 'center',
  },
});
