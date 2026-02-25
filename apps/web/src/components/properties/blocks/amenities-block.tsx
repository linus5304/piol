'use client';
'use no memo'; // RHF v7 form.watch() is incompatible with React Compiler

import { cn } from '@/lib/utils';
import type { AmenityId, PropertyFormInput } from '@/lib/validations';
import { useTranslations } from 'gt-next';
import { Armchair, Car, Droplet, Shield, Sun, TreePine, Wifi, Wind, Zap } from 'lucide-react';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface AmenitiesBlockProps {
  form: UseFormReturn<PropertyFormInput>;
}

export function AmenitiesBlock({ form }: AmenitiesBlockProps) {
  const t = useTranslations();
  const selected = form.watch('selectedAmenities') ?? [];

  const amenities = useMemo(
    () => [
      { id: 'wifi' as const, label: t('amenities.wifi'), icon: Wifi },
      { id: 'parking' as const, label: t('amenities.parking'), icon: Car },
      { id: 'ac' as const, label: t('amenities.ac'), icon: Wind },
      { id: 'security' as const, label: t('amenities.security'), icon: Shield },
      { id: 'water247' as const, label: t('amenities.water247'), icon: Droplet },
      { id: 'electricity247' as const, label: t('amenities.electricity247'), icon: Zap },
      { id: 'furnished' as const, label: t('amenities.furnished'), icon: Armchair },
      { id: 'balcony' as const, label: t('amenities.balcony'), icon: Sun },
      { id: 'garden' as const, label: t('amenities.garden'), icon: TreePine },
    ],
    [t]
  );

  const toggleAmenity = (id: AmenityId) => {
    const current = form.getValues('selectedAmenities') ?? [];
    if (current.includes(id)) {
      form.setValue(
        'selectedAmenities',
        current.filter((a) => a !== id)
      );
    } else {
      form.setValue('selectedAmenities', [...current, id]);
    }
  };

  return (
    <div className="p-1">
      <div className="grid grid-cols-3 gap-3">
        {amenities.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => toggleAmenity(id)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors min-h-[72px]',
              selected.includes(id)
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
