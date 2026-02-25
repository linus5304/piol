'use client';
'use no memo'; // RHF v7 form.watch() is incompatible with React Compiler

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parseAppLocale } from '@/i18n/config';
import { formatNumber } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import type { PropertyFormInput } from '@/lib/validations';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

const RENT_PRESETS = [25000, 50000, 75000, 100000, 150000, 200000];

interface PricingBlockProps {
  form: UseFormReturn<PropertyFormInput>;
  rentRange?: { min: number; max: number };
}

export function PricingBlock({ form, rentRange }: PricingBlockProps) {
  const t = useTranslations();
  const locale = parseAppLocale(useLocale());
  const rentAmount = form.watch('rentAmount');
  const cautionMonths = form.watch('cautionMonths');
  const upfrontMonths = form.watch('upfrontMonths');

  const totalEntry = useMemo(() => {
    const rent = Number(rentAmount) || 0;
    const caution = Number(cautionMonths) || 0;
    const advance = Number(upfrontMonths) || 0;
    return rent * (caution + advance);
  }, [rentAmount, cautionMonths, upfrontMonths]);

  return (
    <div className="space-y-4 p-1">
      {/* Rent presets */}
      <div className="space-y-2">
        <Label>{t('newProperty.monthlyRent')}</Label>
        <div className="flex flex-wrap gap-2">
          {RENT_PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() =>
                form.setValue('rentAmount', amount.toString(), { shouldValidate: true })
              }
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-colors',
                Number(rentAmount) === amount
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {formatNumber(amount, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom rent input */}
      <FormField
        control={form.control}
        name="rentAmount"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="number" placeholder={t('newProperty.customAmount')} {...field} />
            </FormControl>
            {rentRange && (
              <p className="text-xs text-muted-foreground">
                {t('newProperty.rentRangeHint', {
                  min: formatNumber(rentRange.min, locale),
                  max: formatNumber(rentRange.max, locale),
                })}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Caution & Advance */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cautionMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('newProperty.cautionMonths')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {t('newProperty.months')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="upfrontMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('newProperty.advanceMonths')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 6, 12].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {t('newProperty.months')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Total calculator */}
      {totalEntry > 0 && (
        <div className="rounded-lg bg-muted p-3 flex justify-between items-center">
          <span className="text-sm font-medium">{t('newProperty.totalEntry')}</span>
          <span className="text-lg font-bold text-primary font-mono tabular-nums">
            {formatNumber(totalEntry, locale)} FCFA
          </span>
        </div>
      )}
    </div>
  );
}
