'use client';

import { LocationPicker } from '@/components/properties/location-picker-wrapper';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CITIES, type PropertyFormInput } from '@/lib/validations';
import { useTranslations } from 'gt-next';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface LocationBlockProps {
  form: UseFormReturn<PropertyFormInput>;
}

export function LocationBlock({ form }: LocationBlockProps) {
  const t = useTranslations();
  const [showGps, setShowGps] = useState(false);
  const selectedCity = form.watch('city');

  return (
    <div className="space-y-4 p-1">
      {/* City chips */}
      <div className="space-y-2">
        <Label>{t('newProperty.city')}</Label>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => form.setValue('city', city, { shouldValidate: true })}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                selectedCity === city
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {city}
            </button>
          ))}
        </div>
        {form.formState.errors.city && (
          <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
        )}
      </div>

      {/* Neighborhood */}
      <FormField
        control={form.control}
        name="neighborhood"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('newProperty.neighborhood')}</FormLabel>
            <FormControl>
              <Input placeholder={t('newProperty.neighborhoodPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address */}
      <FormField
        control={form.control}
        name="addressLine1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('newProperty.address')}</FormLabel>
            <FormControl>
              <Input placeholder={t('newProperty.addressPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* GPS toggle */}
      <button
        type="button"
        onClick={() => setShowGps(!showGps)}
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <MapPin className="w-4 h-4" />
        {t('newProperty.addGpsPosition')}
      </button>

      {showGps && (
        <LocationPicker
          latitude={form.watch('latitude')}
          longitude={form.watch('longitude')}
          city={form.watch('city')}
          onLocationChange={(lat, lng) => {
            form.setValue('latitude', lat, { shouldValidate: true });
            form.setValue('longitude', lng, { shouldValidate: true });
          }}
        />
      )}
    </div>
  );
}
