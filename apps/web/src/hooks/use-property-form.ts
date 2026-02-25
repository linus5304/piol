'use client';
'use no memo'; // RHF v7 form.watch() is incompatible with React Compiler

import { parseAppLocale } from '@/i18n/config';
import { type PropertyTemplate, generateTitle } from '@/lib/data/property-templates';
import { formatNumber } from '@/lib/i18n-format';
import {
  type AmenityId,
  type PropertyFormInput,
  type PropertyFormValues,
  type PropertyType,
  createPropertySchema,
} from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import { Camera, FileText, Home, MapPin, Tag, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface BlockConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  required: boolean;
  desktopColumn: 1 | 2;
  desktopRow: number;
  fullWidth?: boolean;
}

export function usePropertyForm(
  template: PropertyTemplate | null,
  onSuccess: (propertyId: Id<'properties'>) => void
) {
  const t = useTranslations();
  const locale = parseAppLocale(useLocale());

  const blocks: BlockConfig[] = useMemo(
    () => [
      {
        id: 'propertyType',
        label: t('newProperty.blockPropertyType'),
        icon: Home,
        required: true,
        desktopColumn: 1 as const,
        desktopRow: 1,
      },
      {
        id: 'location',
        label: t('newProperty.blockLocation'),
        icon: MapPin,
        required: true,
        desktopColumn: 1 as const,
        desktopRow: 2,
      },
      {
        id: 'pricing',
        label: t('newProperty.blockPricing'),
        icon: Wallet,
        required: true,
        desktopColumn: 2 as const,
        desktopRow: 1,
      },
      {
        id: 'amenities',
        label: t('newProperty.blockAmenities'),
        icon: Tag,
        required: false,
        desktopColumn: 2 as const,
        desktopRow: 2,
      },
      {
        id: 'photos',
        label: t('newProperty.blockPhotos'),
        icon: Camera,
        required: false,
        desktopColumn: 2 as const,
        desktopRow: 3,
      },
      {
        id: 'description',
        label: t('newProperty.blockDescription'),
        icon: FileText,
        required: false,
        desktopColumn: 1 as const,
        desktopRow: 3,
        fullWidth: true,
      },
    ],
    [t]
  );

  // Form setup
  const schema = useMemo(() => createPropertySchema(t), [t]);

  const getDefaults = useCallback((): PropertyFormInput => {
    if (template) {
      const typeName = t(`propertyTypes.${template.propertyType}`);
      return {
        title: generateTitle(typeName, template.city),
        description: '',
        propertyType: template.propertyType,
        city: template.city,
        neighborhood: '',
        addressLine1: '',
        latitude: '',
        longitude: '',
        rentAmount: template.defaultRent.toString(),
        cautionMonths: template.defaultCautionMonths.toString(),
        upfrontMonths: template.defaultUpfrontMonths.toString(),
        selectedAmenities: [...template.defaultAmenities],
      };
    }
    return {
      title: '',
      description: '',
      propertyType: undefined as unknown as PropertyFormValues['propertyType'],
      city: undefined as unknown as PropertyFormValues['city'],
      neighborhood: '',
      addressLine1: '',
      latitude: '',
      longitude: '',
      rentAmount: '',
      cautionMonths: '2',
      upfrontMonths: '6',
      selectedAmenities: [],
    };
  }, [template, t]);

  const form = useForm<PropertyFormInput, unknown, PropertyFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: getDefaults(),
  });

  // Image state
  const [images, setImages] = useState<File[]>([]);
  const addImages = useCallback((files: FileList) => {
    setImages((prev) => [...prev, ...Array.from(files)]);
  }, []);
  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Auto-generate title
  const propertyType = form.watch('propertyType');
  const city = form.watch('city');
  const neighborhood = form.watch('neighborhood');
  const lastGeneratedTitle = useRef<string>('');

  // biome-ignore lint/correctness/useExhaustiveDependencies: t and form methods are stable per their API contracts
  useEffect(() => {
    if (!propertyType || !city) return;
    const typeName = t(`propertyTypes.${propertyType}`);
    const generated = generateTitle(typeName, city, neighborhood || undefined);
    const currentTitle = form.getValues('title');

    if (
      generated !== currentTitle &&
      (!currentTitle || currentTitle === lastGeneratedTitle.current)
    ) {
      form.setValue('title', generated);
      lastGeneratedTitle.current = generated;
    }
  }, [propertyType, city, neighborhood]);

  // Generate description suggestion
  const watchedFields = form.watch();
  const selectedAmenities = watchedFields.selectedAmenities ?? [];
  const amenityNames = useMemo(() => {
    const map: Record<string, string> = {
      wifi: t('amenities.wifi'),
      parking: t('amenities.parking'),
      ac: t('amenities.ac'),
      security: t('amenities.security'),
      water247: t('amenities.water247'),
      electricity247: t('amenities.electricity247'),
      furnished: t('amenities.furnished'),
      balcony: t('amenities.balcony'),
      garden: t('amenities.garden'),
    };
    return selectedAmenities.map((id) => map[id]).filter(Boolean);
  }, [selectedAmenities, t]);

  const suggestedTitle = useMemo(() => {
    if (!propertyType || !city) return '';
    const typeName = t(`propertyTypes.${propertyType}`);
    return generateTitle(typeName, city, neighborhood || undefined);
  }, [propertyType, city, neighborhood, t]);

  const suggestedDescription = useMemo(() => {
    if (!propertyType || !city) return '';
    const typeName = t(`propertyTypes.${propertyType}`);
    const location = neighborhood ? `${neighborhood}, ${city}` : city;
    const amenityText = amenityNames.length > 0 ? `${amenityNames.join(', ')}. ` : '';
    const rent = watchedFields.rentAmount
      ? formatNumber(Number(watchedFields.rentAmount), locale)
      : '';
    return t('newProperty.descriptionTemplate', {
      type: typeName,
      location,
      amenities: amenityText,
      rent: rent || '...',
      caution: watchedFields.cautionMonths || '2',
    });
  }, [
    propertyType,
    city,
    neighborhood,
    amenityNames,
    watchedFields.rentAmount,
    watchedFields.cautionMonths,
    t,
    locale,
  ]);

  // Completion tracking
  const blockCompletion = useMemo(
    () => ({
      propertyType: !!watchedFields.propertyType,
      location: !!watchedFields.city,
      pricing: !!watchedFields.rentAmount && Number(watchedFields.rentAmount) > 0,
      amenities: true,
      photos: true,
      description: true,
    }),
    [watchedFields.propertyType, watchedFields.city, watchedFields.rentAmount]
  );

  const requiredComplete = [
    blockCompletion.propertyType,
    blockCompletion.location,
    blockCompletion.pricing,
  ].filter(Boolean).length;

  // Submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProperty = useMutation(api.properties.createProperty);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addPropertyImages = useMutation(api.properties.addPropertyImages);

  const uploadImages = async (propertyId: Id<'properties'>, files: File[]) => {
    const uploaded = [];
    for (const [index, file] of files.entries()) {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });
      if (!response.ok) throw new Error('Upload failed');
      const { storageId } = (await response.json()) as {
        storageId: Id<'_storage'>;
      };
      uploaded.push({ storageId, order: index });
    }
    if (uploaded.length > 0) {
      await addPropertyImages({ propertyId, images: uploaded });
    }
  };

  const handleSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error(t('newProperty.errorCreate'));
      return;
    }

    setIsSubmitting(true);
    try {
      const data = form.getValues();
      const hasLat = (data.latitude ?? '').trim().length > 0;
      const hasLng = (data.longitude ?? '').trim().length > 0;
      const lat = Number(data.latitude);
      const lng = Number(data.longitude);
      const location =
        hasLat && hasLng && Number.isFinite(lat) && Number.isFinite(lng)
          ? { latitude: lat, longitude: lng }
          : undefined;

      const amenities: Record<string, boolean> = {};
      for (const id of [
        'wifi',
        'parking',
        'ac',
        'security',
        'water247',
        'electricity247',
        'furnished',
        'balcony',
        'garden',
      ]) {
        amenities[id] = (data.selectedAmenities ?? []).includes(id as AmenityId);
      }

      const propertyId = await createProperty({
        title: data.title,
        description: data.description || undefined,
        propertyType: data.propertyType as PropertyType,
        city: data.city,
        neighborhood: data.neighborhood || undefined,
        addressLine1: data.addressLine1 || undefined,
        rentAmount: Number(data.rentAmount),
        cautionMonths: Number(data.cautionMonths),
        upfrontMonths: Number(data.upfrontMonths),
        amenities,
        location,
      });

      if (images.length > 0) {
        try {
          await uploadImages(propertyId, images);
        } catch {
          toast.error(t('newProperty.errorImageUpload'));
        }
      }

      onSuccess(propertyId);
    } catch {
      toast.error(t('newProperty.errorCreate'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Block status helpers
  const getBlockStatus = (block: BlockConfig) => {
    const complete = blockCompletion[block.id as keyof typeof blockCompletion];
    if (complete && block.required) return 'complete';
    if (!complete && block.required) return 'required';
    if (block.id === 'photos') return images.length > 0 ? 'complete' : 'recommended';
    return complete ? 'complete' : 'optional';
  };

  const getBlockSummary = (blockId: string) => {
    if (blockId === 'amenities' && selectedAmenities.length > 0) {
      return t('newProperty.blockAmenitiesCount', {
        count: selectedAmenities.length,
      });
    }
    if (blockId === 'photos' && images.length > 0) {
      return t('newProperty.blockPhotosCount', { count: images.length });
    }
    return null;
  };

  return {
    form,
    images,
    addImages,
    removeImage,
    blocks,
    blockCompletion,
    requiredComplete,
    suggestedTitle,
    suggestedDescription,
    isSubmitting,
    handleSubmit,
    getBlockStatus,
    getBlockSummary,
    template,
    t,
    locale,
    selectedAmenities,
    watchedFields,
  };
}

export type UsePropertyFormReturn = ReturnType<typeof usePropertyForm>;
