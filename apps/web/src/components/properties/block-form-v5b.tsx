'use client';
'use no memo'; // RHF v7 form.watch() is incompatible with React Compiler

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePropertyForm } from '@/hooks/use-property-form';
import type { PropertyTemplate } from '@/lib/data/property-templates';
import { formatNumber } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useTranslations } from 'gt-next';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AmenitiesBlock } from './blocks/amenities-block';
import { DescriptionBlock } from './blocks/description-block';
import { LocationBlock } from './blocks/location-block';
import { PhotosBlock } from './blocks/photos-block';
import { PricingBlock } from './blocks/pricing-block';
import { PropertyTypeBlock } from './blocks/property-type-block';

interface BlockFormV5bProps {
  template: PropertyTemplate | null;
  onSuccess: (propertyId: Id<'properties'>) => void;
}

export function BlockFormV5b({ template, onSuccess }: BlockFormV5bProps) {
  const t = useTranslations();
  const isMobile = useIsMobile();
  const {
    form,
    images,
    addImages,
    removeImage,
    blocks,
    requiredComplete,
    isSubmitting,
    handleSubmit,
    getBlockStatus,
    suggestedTitle,
    suggestedDescription,
    locale,
    selectedAmenities,
    watchedFields,
  } = usePropertyForm(template, onSuccess);

  const [activeBlock, setActiveBlock] = useState<string>(template ? 'location' : 'propertyType');

  const activeIndex = blocks.findIndex((b) => b.id === activeBlock);
  const isFirstBlock = activeIndex === 0;
  const isLastBlock = activeIndex === blocks.length - 1;

  const goNext = () => {
    if (!isLastBlock) setActiveBlock(blocks[activeIndex + 1].id);
  };
  const goBack = () => {
    if (!isFirstBlock) setActiveBlock(blocks[activeIndex - 1].id);
  };

  const blockDescriptions = useMemo<Record<string, string>>(
    () => ({
      propertyType: t('newProperty.blockPropertyTypeDesc'),
      location: t('newProperty.blockLocationDesc'),
      pricing: t('newProperty.blockPricingDesc'),
      amenities: t('newProperty.blockAmenitiesDesc'),
      photos: t('newProperty.blockPhotosDesc'),
      description: t('newProperty.blockDescriptionDesc'),
    }),
    [t]
  );

  const getLiveSummary = (blockId: string): string => {
    switch (blockId) {
      case 'propertyType':
        return watchedFields.propertyType
          ? t(`propertyTypes.${watchedFields.propertyType}`)
          : t('newProperty.notSet');
      case 'location':
        if (!watchedFields.city) return t('newProperty.notSet');
        return watchedFields.neighborhood
          ? `${watchedFields.neighborhood}, ${watchedFields.city}`
          : watchedFields.city;
      case 'pricing':
        return watchedFields.rentAmount && Number(watchedFields.rentAmount) > 0
          ? `${formatNumber(Number(watchedFields.rentAmount), locale)} FCFA`
          : t('newProperty.notSet');
      case 'amenities':
        return selectedAmenities.length > 0
          ? t('newProperty.amenitiesSelected', { count: selectedAmenities.length })
          : t('newProperty.none');
      case 'photos':
        return images.length > 0
          ? t('newProperty.photosCount', { count: images.length })
          : t('newProperty.none');
      case 'description':
        return watchedFields.title ? watchedFields.title.slice(0, 30) : t('newProperty.notSet');
      default:
        return '';
    }
  };

  const renderBlockContent = (blockId: string) => {
    switch (blockId) {
      case 'propertyType':
        return <PropertyTypeBlock form={form} locked={!!template} />;
      case 'location':
        return <LocationBlock form={form} />;
      case 'pricing':
        return <PricingBlock form={form} rentRange={template?.rentRange} />;
      case 'amenities':
        return <AmenitiesBlock form={form} />;
      case 'photos':
        return <PhotosBlock images={images} onAddImages={addImages} onRemoveImage={removeImage} />;
      case 'description':
        return (
          <DescriptionBlock
            form={form}
            suggestedTitle={suggestedTitle}
            suggestedDescription={suggestedDescription}
          />
        );
      default:
        return null;
    }
  };

  const activeBlockConfig = blocks.find((b) => b.id === activeBlock);

  // Next block name for the "Next" button label
  const nextBlockLabel = !isLastBlock ? blocks[activeIndex + 1]?.label : '';
  const prevBlockLabel = !isFirstBlock ? blocks[activeIndex - 1]?.label : '';

  if (isMobile) {
    return (
      <div className="relative flex flex-col min-h-0">
        <Form {...form}>
          {/* Step indicator */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                {t('newProperty.stepOf', { current: activeIndex + 1, total: blocks.length })}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('newProperty.progressRequired', { count: requiredComplete, total: 3 })}
              </span>
            </div>
            <div className="flex gap-1.5">
              {blocks.map((block, i) => (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => setActiveBlock(block.id)}
                  className={cn(
                    'h-1.5 rounded-full flex-1 transition-colors',
                    i === activeIndex
                      ? 'bg-primary'
                      : getBlockStatus(block) === 'complete'
                        ? 'bg-success'
                        : 'bg-muted'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Form content — fixed height with scroll */}
          <div className="flex-1 overflow-y-auto p-4 h-[480px]">
            {activeBlockConfig && (
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{activeBlockConfig.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {blockDescriptions[activeBlock]}
                  </p>
                </div>
                {renderBlockContent(activeBlock)}
              </div>
            )}
          </div>
        </Form>

        {/* Navigation bar */}
        <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-3 flex items-center justify-between gap-3 z-10">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={goBack}
            disabled={isFirstBlock}
            className="min-w-[100px]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('newProperty.previous')}
          </Button>

          {isLastBlock ? (
            <Button
              type="button"
              size="sm"
              disabled={requiredComplete < 3 || isSubmitting}
              onClick={handleSubmit}
              className="min-w-[120px]"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSubmitting ? t('newProperty.publishing') : t('newProperty.publish')}
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={goNext} className="min-w-[100px]">
              {t('newProperty.next')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <Form {...form}>
      <div className="flex flex-col rounded-xl border bg-card overflow-hidden h-[640px]">
        <div className="flex flex-1 min-h-0">
          {/* Left panel: step list */}
          <div className="w-72 shrink-0 border-r bg-muted/30 flex flex-col">
            {/* Progress header */}
            <div className="px-4 py-4 border-b">
              <p className="text-sm font-medium">
                {t('newProperty.progressRequired', { count: requiredComplete, total: 3 })}
              </p>
              <div className="flex gap-1 mt-2">
                {blocks.map((block) => {
                  const status = getBlockStatus(block);
                  return (
                    <div
                      key={block.id}
                      className={cn(
                        'h-1.5 rounded-full flex-1 transition-colors',
                        status === 'complete'
                          ? 'bg-success'
                          : block.required
                            ? 'bg-destructive/30'
                            : 'bg-muted'
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* Block list */}
            <nav className="flex-1 overflow-y-auto py-1">
              {blocks.map((block, i) => {
                const Icon = block.icon;
                const status = getBlockStatus(block);
                const isActive = activeBlock === block.id;
                const isComplete = status === 'complete';
                const summary = getLiveSummary(block.id);
                return (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => setActiveBlock(block.id)}
                    className={cn(
                      'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors',
                      isActive
                        ? 'bg-accent border-l-2 border-primary'
                        : 'hover:bg-accent/50 border-l-2 border-transparent'
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5',
                        isComplete
                          ? 'bg-success text-success-foreground'
                          : isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isComplete ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium leading-tight">{block.label}</span>
                        {block.required && !isComplete && (
                          <span className="text-[10px] text-destructive">*</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate block mt-0.5">
                        {summary}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right panel: active block form — scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeBlockConfig && (
              <div>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg">{activeBlockConfig.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {blockDescriptions[activeBlock]}
                  </p>
                </div>
                {renderBlockContent(activeBlock)}
              </div>
            )}
          </div>
        </div>

        {/* Navigation bar — inside the card */}
        <div className="shrink-0 border-t bg-card px-4 py-3 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={isFirstBlock}
            className="min-w-[140px]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {isFirstBlock ? t('newProperty.previous') : prevBlockLabel}
          </Button>

          {isLastBlock ? (
            <Button
              type="button"
              disabled={requiredComplete < 3 || isSubmitting}
              onClick={handleSubmit}
              className="min-w-[160px]"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSubmitting ? t('newProperty.publishing') : t('newProperty.publish')}
            </Button>
          ) : (
            <Button type="button" onClick={goNext} className="min-w-[140px]">
              {nextBlockLabel}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
}
