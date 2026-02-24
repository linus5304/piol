'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { PropertyFormInput } from '@/lib/validations';
import { useTranslations } from 'gt-next';
import { Sparkles } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

interface DescriptionBlockProps {
  form: UseFormReturn<PropertyFormInput>;
  suggestedTitle: string;
  suggestedDescription: string;
}

export function DescriptionBlock({
  form,
  suggestedTitle,
  suggestedDescription,
}: DescriptionBlockProps) {
  const t = useTranslations();

  const applyTitleSuggestion = () => {
    if (suggestedTitle) {
      form.setValue('title', suggestedTitle, { shouldValidate: true });
    }
  };

  const applyDescriptionSuggestion = () => {
    if (suggestedDescription) {
      form.setValue('description', suggestedDescription, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4 p-1">
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>{t('newProperty.listingTitle')}</FormLabel>
              {suggestedTitle && field.value !== suggestedTitle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={applyTitleSuggestion}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t('newProperty.useSuggestion')}
                </Button>
              )}
            </div>
            <FormControl>
              <Input placeholder={t('newProperty.listingTitlePlaceholder')} {...field} />
            </FormControl>
            <p className="text-xs text-muted-foreground">{t('newProperty.autoTitleHint')}</p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>{t('newProperty.description')}</FormLabel>
              {suggestedDescription && field.value !== suggestedDescription && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={applyDescriptionSuggestion}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t('newProperty.useSuggestion')}
                </Button>
              )}
            </div>
            <FormControl>
              <Textarea
                placeholder={t('newProperty.descriptionPlaceholder')}
                className="min-h-[120px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
