'use client';

import { cn } from '@/lib/utils';
import type { PropertyFormInput, PropertyType } from '@/lib/validations';
import { PROPERTY_TYPES } from '@/lib/validations';
import { useTranslations } from 'gt-next';
import { Building2, Home, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

const TYPE_ICONS: Record<PropertyType, LucideIcon> = {
  studio: Home,
  '1br': Home,
  '2br': Home,
  '3br': Home,
  '4br': Home,
  house: Home,
  apartment: Building2,
  villa: Building2,
};

interface PropertyTypeBlockProps {
  form: UseFormReturn<PropertyFormInput>;
  locked?: boolean;
}

export function PropertyTypeBlock({ form, locked }: PropertyTypeBlockProps) {
  const t = useTranslations();
  const selected = form.watch('propertyType');

  const types = useMemo(
    () =>
      PROPERTY_TYPES.map((value) => ({
        value,
        label: t(`propertyTypes.${value}`),
        icon: TYPE_ICONS[value],
      })),
    [t]
  );

  return (
    <div className="space-y-3 p-1">
      {locked && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Lock className="w-3 h-3" />
          {t('newProperty.lockedByTemplate')}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {types.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            disabled={locked}
            onClick={() => form.setValue('propertyType', value, { shouldValidate: true })}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border-2 transition-colors min-h-[80px]',
              selected === value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50',
              locked && 'opacity-60 cursor-not-allowed'
            )}
          >
            <Icon className="w-6 h-6 shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
