import { FlashList } from '@shopify/flash-list';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/PropertyCard';
import { api } from '../../convex/_generated/api';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>();

  const debouncedQuery = useDebounce(searchQuery, 300);

  const searchResults = useQuery(
    api.properties.searchProperties,
    debouncedQuery.length >= 2
      ? { searchQuery: debouncedQuery, city: selectedCity, limit: 30 }
      : 'skip'
  );

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
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
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
