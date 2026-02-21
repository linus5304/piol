'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { parseAppLocale } from '@/i18n/config';
import { formatNumber } from '@/lib/i18n-format';
import { cn } from '@/lib/utils';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import {
  Armchair,
  Camera,
  Car,
  Check,
  Droplet,
  Loader2,
  Shield,
  Sun,
  TreePine,
  Wifi,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

type PropertyType = 'studio' | '1br' | '2br' | '3br' | '4br' | 'apartment' | 'house' | 'villa';
type AmenityId =
  | 'wifi'
  | 'parking'
  | 'ac'
  | 'security'
  | 'water247'
  | 'electricity247'
  | 'furnished'
  | 'balcony'
  | 'garden';

const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Buea', 'Kribi', 'Limbe', 'Bamenda'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StepIndicator({
  currentStep,
  steps,
}: { currentStep: number; steps: readonly { number: number; label: string }[] }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, index) => (
        <div key={s.number} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                s.number < currentStep
                  ? 'bg-primary border-primary text-primary-foreground'
                  : s.number === currentStep
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-muted text-muted-foreground'
              )}
            >
              {s.number < currentStep ? <Check className="w-4 h-4" /> : s.number}
            </div>
            <span
              className={cn(
                'text-sm font-medium hidden sm:block',
                s.number <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mx-3',
                s.number < currentStep ? 'bg-primary' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function NewPropertyPage() {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations();
  const router = useRouter();

  const propertyTypes = useMemo(
    () =>
      [
        { value: 'studio', label: t('propertyTypes.studio') },
        { value: '1br', label: t('propertyTypes.1br') },
        { value: '2br', label: t('propertyTypes.2br') },
        { value: '3br', label: t('propertyTypes.3br') },
        { value: '4br', label: t('propertyTypes.4br') },
        { value: 'apartment', label: t('propertyTypes.apartment') },
        { value: 'house', label: t('propertyTypes.house') },
        { value: 'villa', label: t('propertyTypes.villa') },
      ] as const,
    [t]
  );

  const amenitiesList = useMemo(
    () =>
      [
        { id: 'wifi', label: t('amenities.wifi'), icon: Wifi },
        { id: 'parking', label: t('amenities.parking'), icon: Car },
        { id: 'ac', label: t('amenities.ac'), icon: Wind },
        { id: 'security', label: t('amenities.security'), icon: Shield },
        { id: 'water247', label: t('amenities.water247'), icon: Droplet },
        { id: 'electricity247', label: t('amenities.electricity247'), icon: Zap },
        { id: 'furnished', label: t('amenities.furnished'), icon: Armchair },
        { id: 'balcony', label: t('amenities.balcony'), icon: Sun },
        { id: 'garden', label: t('amenities.garden'), icon: TreePine },
      ] as const,
    [t]
  );

  const steps = useMemo(
    () => [
      { number: 1, label: t('newProperty.stepInfo') },
      { number: 2, label: t('newProperty.stepPricing') },
      { number: 3, label: t('newProperty.stepPhotos') },
    ],
    [t]
  );
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [createdPropertyId, setCreatedPropertyId] = useState<Id<'properties'> | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createProperty = useMutation(api.properties.createProperty);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addPropertyImages = useMutation(api.properties.addPropertyImages);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '' as PropertyType | '',
    city: '',
    neighborhood: '',
    addressLine1: '',
    latitude: '',
    longitude: '',
    rentAmount: '',
    cautionMonths: '2',
    upfrontMonths: '6',
    selectedAmenities: [] as AmenityId[],
    images: [] as File[],
  });

  // Auto-redirect on success after 5 seconds
  useEffect(() => {
    if (createdPropertyId) {
      redirectTimerRef.current = setTimeout(() => {
        router.push('/dashboard/properties');
      }, 5000);
    }
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [createdPropertyId, router]);

  const updateForm = useCallback((field: string, value: string | AmenityId[] | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleAmenity = (amenityId: AmenityId) => {
    const current = formData.selectedAmenities;
    if (current.includes(amenityId)) {
      updateForm(
        'selectedAmenities',
        current.filter((id) => id !== amenityId)
      );
    } else {
      updateForm('selectedAmenities', [...current, amenityId]);
    }
  };

  const removeImage = useCallback(
    (index: number) => {
      const updated = formData.images.filter((_, i) => i !== index);
      updateForm('images', updated);
    },
    [formData.images, updateForm]
  );

  const addImages = useCallback(
    (files: FileList) => {
      const newFiles = [...formData.images, ...Array.from(files)];
      updateForm('images', newFiles);
    },
    [formData.images, updateForm]
  );

  const uploadImages = async (propertyId: Id<'properties'>, files: File[]) => {
    const uploaded = [];

    for (const [index, file] of files.entries()) {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = (await response.json()) as { storageId: Id<'_storage'> };
      uploaded.push({ storageId, order: index });
    }

    if (uploaded.length > 0) {
      await addPropertyImages({ propertyId, images: uploaded });
    }
  };

  const handleSubmit = async (saveAsDraft = false) => {
    if (saveAsDraft) {
      setIsSavingDraft(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      const hasLatitude = formData.latitude.trim().length > 0;
      const hasLongitude = formData.longitude.trim().length > 0;

      if ((hasLatitude && !hasLongitude) || (!hasLatitude && hasLongitude)) {
        toast.error(t('newProperty.errorCoords'));
        return;
      }

      const latitude = Number(formData.latitude);
      const longitude = Number(formData.longitude);
      if (
        hasLatitude &&
        hasLongitude &&
        (!Number.isFinite(latitude) || !Number.isFinite(longitude))
      ) {
        toast.error(t('newProperty.errorCoordsInvalid'));
        return;
      }
      const location =
        hasLatitude && hasLongitude && Number.isFinite(latitude) && Number.isFinite(longitude)
          ? { latitude, longitude }
          : undefined;

      // Convert amenities to object format
      const amenities: Record<string, boolean> = {};
      for (const amenity of amenitiesList) {
        amenities[amenity.id] = formData.selectedAmenities.includes(amenity.id);
      }

      const propertyId = await createProperty({
        title: formData.title,
        description: formData.description || undefined,
        propertyType: formData.propertyType as PropertyType,
        city: formData.city,
        neighborhood: formData.neighborhood || undefined,
        addressLine1: formData.addressLine1 || undefined,
        rentAmount: Number(formData.rentAmount),
        cautionMonths: Number(formData.cautionMonths),
        upfrontMonths: Number(formData.upfrontMonths),
        amenities,
        location,
      });

      if (formData.images.length > 0) {
        try {
          await uploadImages(propertyId, formData.images);
        } catch (error) {
          console.error('Error uploading images:', error);
          toast.error(t('newProperty.errorImageUpload'));
        }
      }

      if (saveAsDraft) {
        toast.success(t('newProperty.successDraft'));
        router.push('/dashboard/properties');
      } else {
        setCreatedPropertyId(propertyId);
      }
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error(t('newProperty.errorCreate'));
    } finally {
      setIsSubmitting(false);
      setIsSavingDraft(false);
    }
  };

  // Success state after creation
  if (createdPropertyId) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-success" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('newProperty.successTitle')}</h1>
          <p className="text-muted-foreground mt-2">{t('newProperty.successDesc')}</p>
        </div>
        <div className="flex justify-center gap-3">
          <Link href={`/dashboard/properties/${createdPropertyId}`}>
            <Button>{t('newProperty.submitForVerification')}</Button>
          </Link>
          <Link href="/dashboard/properties">
            <Button variant="outline">{t('newProperty.backToProperties')}</Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">{t('newProperty.autoRedirect')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="text-muted-foreground hover:text-foreground">
          {t('newProperty.back')}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('newProperty.title')}</h1>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={step} steps={steps} />

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('newProperty.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>{t('newProperty.confirmDesc')}</p>
                <div className="bg-muted rounded-lg p-3 space-y-1 text-sm">
                  <p>
                    <span className="font-medium">{t('newProperty.confirmLabel')}</span>{' '}
                    {formData.title}
                  </p>
                  <p>
                    <span className="font-medium">{t('newProperty.confirmLocation')}</span>{' '}
                    {formData.neighborhood ? `${formData.neighborhood}, ` : ''}
                    {formData.city}
                  </p>
                  <p>
                    <span className="font-medium">{t('newProperty.confirmRent')}</span>{' '}
                    {formatNumber(Number(formData.rentAmount || 0), locale)} FCFA/mois
                  </p>
                  <p>
                    <span className="font-medium">{t('newProperty.confirmAmenities')}</span>{' '}
                    {formData.selectedAmenities.length} {t('newProperty.confirmSelected')}
                  </p>
                  <p>
                    <span className="font-medium">{t('newProperty.confirmPhotos')}</span>{' '}
                    {formData.images.length} {t('newProperty.confirmAdded')}
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('newProperty.confirmCancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit(false)}>
              {t('newProperty.confirmCreate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('newProperty.basicInfo')}</CardTitle>
            <CardDescription>{t('newProperty.basicInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('newProperty.listingTitle')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder={t('newProperty.listingTitlePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('newProperty.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder={t('newProperty.descriptionPlaceholder')}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('newProperty.propertyType')}</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(v) => updateForm('propertyType', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('newProperty.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('newProperty.city')}</Label>
                <Select value={formData.city} onValueChange={(v) => updateForm('city', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('newProperty.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="neighborhood">{t('newProperty.neighborhood')}</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => updateForm('neighborhood', e.target.value)}
                  placeholder={t('newProperty.neighborhoodPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t('newProperty.address')}</Label>
                <Input
                  id="address"
                  value={formData.addressLine1}
                  onChange={(e) => updateForm('addressLine1', e.target.value)}
                  placeholder={t('newProperty.addressPlaceholder')}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">{t('newProperty.latitude')}</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => updateForm('latitude', e.target.value)}
                  placeholder="3.848"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">{t('newProperty.longitude')}</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => updateForm('longitude', e.target.value)}
                  placeholder="11.5021"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{t('newProperty.coordsHint')}</p>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.propertyType || !formData.city}
              >
                {t('common.next')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Pricing & Amenities */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('newProperty.pricingTitle')}</CardTitle>
            <CardDescription>{t('newProperty.pricingDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="rent">{t('newProperty.monthlyRent')}</Label>
                <Input
                  id="rent"
                  type="number"
                  value={formData.rentAmount}
                  onChange={(e) => updateForm('rentAmount', e.target.value)}
                  placeholder="150000"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('newProperty.cautionMonths')}</Label>
                <Select
                  value={formData.cautionMonths}
                  onValueChange={(v) => updateForm('cautionMonths', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} {t('newProperty.months')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('newProperty.advanceMonths')}</Label>
                <Select
                  value={formData.upfrontMonths}
                  onValueChange={(v) => updateForm('upfrontMonths', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 6, 12].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} {t('newProperty.months')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>{t('newProperty.amenitiesTitle')}</Label>
              <div className="grid grid-cols-3 gap-3">
                {amenitiesList.map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(amenity.id)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg border transition-colors',
                        formData.selectedAmenities.includes(amenity.id)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{amenity.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                {t('newProperty.previous')}
              </Button>
              <Button onClick={() => setStep(3)} disabled={!formData.rentAmount}>
                {t('common.next')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Photos & Submit */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('newProperty.photosTitle')}</CardTitle>
            <CardDescription>{t('newProperty.photosDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t('newProperty.dropPhotos')}</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="photos"
                onChange={(e) => {
                  if (e.target.files) {
                    addImages(e.target.files);
                    // Reset input so selecting the same files again works
                    e.target.value = '';
                  }
                }}
              />
              <label htmlFor="photos">
                <Button variant="outline" asChild>
                  <span>{t('newProperty.selectPhotos')}</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4">{t('newProperty.photosHint')}</p>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.images.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium">{t('newProperty.summary')}</h4>
              <p className="text-sm text-muted-foreground">{formData.title}</p>
              <p className="text-sm text-muted-foreground">
                {formData.neighborhood ? `${formData.neighborhood}, ` : ''}
                {formData.city}
              </p>
              <p className="text-sm font-medium text-primary font-mono tabular-nums">
                {formatNumber(Number(formData.rentAmount || 0), locale)} FCFA/mois
              </p>
              {formData.selectedAmenities.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {t('newProperty.amenitiesCount', { count: formData.selectedAmenities.length })}
                </p>
              )}
              {formData.images.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {t('newProperty.photosCount', { count: formData.images.length })}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                {t('newProperty.previous')}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={isSubmitting || isSavingDraft}
                  onClick={() => handleSubmit(true)}
                >
                  {isSavingDraft && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('newProperty.saveDraft')}
                </Button>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isSubmitting || isSavingDraft}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSubmitting ? t('newProperty.creating') : t('newProperty.createListing')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
