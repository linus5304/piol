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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA, formatDate } from '@/lib/i18n-format';
import {
  type EditPropertyFormInput,
  type EditPropertyFormValues,
  createEditPropertySchema,
} from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocale, useTranslations } from 'gt-next/client';
import { AlertCircle, ImageOff, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function formatPropertyDate(timestamp: number, locale: string): string {
  return formatDate(timestamp, locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations();
  const { id } = use(params);
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [removingImageId, setRemovingImageId] = useState<Id<'_storage'> | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const statusLabels = useMemo<Record<string, { label: string; color: string }>>(
    () => ({
      active: { label: t('editProperty.statusActive'), color: 'text-success' },
      draft: { label: t('editProperty.statusDraft'), color: 'text-muted-foreground' },
      pending_verification: {
        label: t('editProperty.statusPendingVerification'),
        color: 'text-warning',
      },
      verified: { label: t('editProperty.statusVerified'), color: 'text-success' },
      rented: { label: t('editProperty.statusRented'), color: 'text-primary' },
      archived: { label: t('editProperty.statusArchived'), color: 'text-muted-foreground' },
    }),
    [t]
  );

  const verificationLabels = useMemo<Record<string, { label: string; color: string }>>(
    () => ({
      approved: { label: t('editProperty.verificationApproved'), color: 'text-success' },
      pending: { label: t('editProperty.verificationPending'), color: 'text-warning' },
      in_progress: { label: t('editProperty.verificationInProgress'), color: 'text-warning' },
      rejected: { label: t('editProperty.verificationRejected'), color: 'text-destructive' },
    }),
    [t]
  );

  const property = useQuery(
    api.properties.getProperty,
    id ? { propertyId: id as Id<'properties'> } : 'skip'
  );

  // Fetch latest verification for rejection notes
  const verification = useQuery(
    api.verifications.getPropertyVerification,
    id ? { propertyId: id as Id<'properties'> } : 'skip'
  );

  const updateProperty = useMutation(api.properties.updateProperty);
  const togglePropertyStatus = useMutation(api.properties.togglePropertyStatus);
  const archiveProperty = useMutation(api.properties.archiveProperty);
  const submitForVerification = useMutation(api.properties.submitForVerification);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addPropertyImages = useMutation(api.properties.addPropertyImages);
  const removePropertyImage = useMutation(api.properties.removePropertyImage);

  // Form setup with React Hook Form + Zod
  const schema = useMemo(() => createEditPropertySchema(t), [t]);
  const form = useForm<EditPropertyFormInput, unknown, EditPropertyFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      rentAmount: '',
      cautionMonths: '',
      upfrontMonths: '',
      latitude: '',
      longitude: '',
    },
  });

  // Reset form when property loads
  useEffect(() => {
    if (property) {
      form.reset({
        title: property.title,
        description: property.description || '',
        rentAmount: property.rentAmount.toString(),
        cautionMonths: property.cautionMonths.toString(),
        upfrontMonths: property.upfrontMonths.toString(),
        latitude: property.location?.latitude?.toString() ?? '',
        longitude: property.location?.longitude?.toString() ?? '',
      });
    }
  }, [property, form]);

  const handleSave = async () => {
    const valid = await form.trigger();
    if (!valid || !property) return;

    setIsUpdating(true);
    try {
      const data = form.getValues();
      const lat = data.latitude ?? '';
      const lng = data.longitude ?? '';
      const hasLatitude = lat.trim().length > 0;
      const hasLongitude = lng.trim().length > 0;

      const latitude = Number(lat);
      const longitude = Number(lng);
      const location =
        hasLatitude && hasLongitude && Number.isFinite(latitude) && Number.isFinite(longitude)
          ? { latitude, longitude }
          : undefined;

      await updateProperty({
        propertyId: property._id,
        title: data.title,
        description: data.description || undefined,
        rentAmount: Number(data.rentAmount),
        location,
      });
      if (property.status === 'active') {
        toast.success(t('editProperty.toastUpdated'), {
          action: {
            label: t('editProperty.toastViewListing'),
            onClick: () => router.push(`/properties/${property._id}`),
          },
        });
      } else {
        toast.success(t('editProperty.toastUpdated'));
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(t('editProperty.errorUpdate'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddImages = async (files: FileList | null) => {
    if (!property || !files || files.length === 0) return;

    setIsUploadingImages(true);
    try {
      const fileArray = Array.from(files);
      const existingCount = property.images?.length ?? 0;
      const uploaded = [];

      for (const [index, file] of fileArray.entries()) {
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
        uploaded.push({ storageId, order: existingCount + index });
      }

      await addPropertyImages({ propertyId: property._id, images: uploaded });
      toast.success(t('editProperty.toastPhotosAdded'));
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(t('editProperty.errorUpload'));
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleRemoveImage = async (storageId: Id<'_storage'>) => {
    if (!property) return;

    setRemovingImageId(storageId);
    try {
      await removePropertyImage({ propertyId: property._id, storageId });
      toast.success(t('editProperty.toastPhotoRemoved'));
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error(t('editProperty.errorRemovePhoto'));
    } finally {
      setRemovingImageId(null);
    }
  };

  const handleToggleStatus = async () => {
    if (!property) return;

    setIsToggling(true);
    try {
      const isCurrentlyActive = property.status === 'active';
      await togglePropertyStatus({
        propertyId: property._id,
        active: !isCurrentlyActive,
      });
      toast.success(
        isCurrentlyActive ? t('editProperty.toastDeactivated') : t('editProperty.toastActivated')
      );
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error(t('editProperty.errorToggle'));
    } finally {
      setIsToggling(false);
    }
  };

  const handleSubmitForVerification = async () => {
    if (!property) return;

    try {
      await submitForVerification({ propertyId: property._id });
      toast.success(t('editProperty.toastSubmitted'));
    } catch (error) {
      console.error('Error submitting for verification:', error);
      toast.error(t('editProperty.errorSubmit'));
    }
  };

  const handleArchive = async () => {
    if (!property) return;

    setIsArchiving(true);
    try {
      await archiveProperty({ propertyId: property._id });
      toast.success(t('editProperty.toastArchived'));
      router.push('/dashboard/properties');
    } catch (error) {
      console.error('Error archiving property:', error);
      toast.error(t('editProperty.errorArchive'));
    } finally {
      setIsArchiving(false);
    }
  };

  // Loading state
  if (property === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-16" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found state
  if (property === null) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <ImageOff className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {t('editProperty.notFound')}
        </h1>
        <p className="text-muted-foreground mb-8">{t('editProperty.notFoundDesc')}</p>
        <Link href="/dashboard/properties">
          <Button>{t('editProperty.backToProperties')}</Button>
        </Link>
      </div>
    );
  }

  // Get images
  const images =
    property.imageUrls && property.imageUrls.length > 0
      ? property.imageUrls
          .map((img: { url: string | null; order: number; storageId: Id<'_storage'> }) => ({
            url: img.url,
            storageId: img.storageId,
          }))
          .filter((img: { url: string | null }) => Boolean(img.url))
      : (property.placeholderImages || []).map((url: string) => ({
          url,
          storageId: undefined,
        }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/properties"
            className="text-muted-foreground hover:text-foreground"
          >
            {t('editProperty.back')}
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('editProperty.title')}</h1>
            <p className="text-muted-foreground">{property.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {property.status === 'active' && (
            <Link href={`/properties/${id}`}>
              <Button variant="outline">{t('editProperty.viewListing')}</Button>
            </Link>
          )}
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('editProperty.save')}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('editProperty.status')}</CardDescription>
            <CardTitle className={`text-2xl ${statusLabels[property.status]?.color}`}>
              {statusLabels[property.status]?.label || property.status}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('editProperty.verification')}</CardDescription>
            <CardTitle
              className={`text-2xl ${verificationLabels[property.verificationStatus]?.color}`}
            >
              {verificationLabels[property.verificationStatus]?.label ||
                property.verificationStatus}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('editProperty.createdOn')}</CardDescription>
            <CardTitle className="text-lg">
              {formatPropertyDate(property._creationTime, locale)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('editProperty.rent')}</CardDescription>
            <CardTitle className="text-2xl text-primary font-mono tabular-nums">
              {formatCurrencyFCFA(property.rentAmount, locale)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Rejection Notice */}
      {property.verificationStatus === 'rejected' && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-destructive">{t('editProperty.rejectionTitle')}</p>
              {verification?.notes && (
                <p className="text-sm text-foreground mt-1">
                  <span className="font-medium">{`${t('editProperty.rejectionReason')} `}</span>
                  {verification.notes}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {t('editProperty.rejectionHint')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      <Form {...form}>
        <Card>
          <CardHeader>
            <CardTitle>{t('editProperty.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('editProperty.titleLabel')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('editProperty.descriptionLabel')}</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px] resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="rentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('editProperty.monthlyRent')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cautionMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('editProperty.cautionMonths')}</FormLabel>
                    <FormControl>
                      <Input type="number" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="upfrontMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('editProperty.advanceMonths')}</FormLabel>
                    <FormControl>
                      <Input type="number" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('editProperty.latitude')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="3.848" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('editProperty.longitude')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="11.5021" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">{t('editProperty.coordsHint')}</p>
          </CardContent>
        </Card>
      </Form>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>{t('editProperty.photos')}</CardTitle>
          <CardDescription>{t('editProperty.photosDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageOff className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
              <p>{t('editProperty.noPhotos')}</p>
              <label
                htmlFor="property-photo-upload"
                className="mt-4 inline-flex items-center justify-center rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
              >
                {isUploadingImages ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{t('editProperty.addPhotos')}</span>
                )}
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {images.map(
                (
                  image: { url: string | null; storageId?: Id<'_storage'> | undefined },
                  index: number
                ) => (
                  <div
                    key={`${image.storageId ?? image.url}-${index}`}
                    className="aspect-square bg-muted rounded-lg overflow-hidden relative group"
                  >
                    <img
                      src={image.url ?? ''}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {image.storageId && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.storageId as Id<'_storage'>)}
                        disabled={removingImageId === image.storageId}
                        className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )
              )}
              <label
                htmlFor="property-photo-upload"
                className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground hover:border-border hover:text-foreground transition-colors cursor-pointer"
              >
                {isUploadingImages ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-2xl">+</span>
                )}
              </label>
            </div>
          )}
          <input
            id="property-photo-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAddImages(e.target.files)}
            disabled={isUploadingImages}
          />
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('editProperty.archiveDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('editProperty.archiveDialogDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('editProperty.archiveDialogCancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('editProperty.archiveDialogConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('editProperty.verifyDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('editProperty.verifyDialogDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('editProperty.verifyDialogCancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitForVerification}>
              {t('editProperty.verifyDialogConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('editProperty.deactivateDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('editProperty.deactivateDialogDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('editProperty.deactivateDialogCancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
              {t('editProperty.deactivateDialogConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>{t('editProperty.actions')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {property.status === 'draft' && (
            <Button variant="outline" onClick={() => setShowVerifyDialog(true)}>
              {property.verificationStatus === 'rejected'
                ? t('editProperty.resubmitForVerification')
                : t('editProperty.submitForVerification')}
            </Button>
          )}

          {property.verificationStatus === 'approved' && (
            <Button
              variant="outline"
              onClick={
                property.status === 'active'
                  ? () => setShowDeactivateDialog(true)
                  : handleToggleStatus
              }
              disabled={isToggling}
              className={property.status === 'active' ? 'text-warning border-warning' : ''}
            >
              {isToggling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {property.status === 'active'
                ? t('editProperty.deactivate')
                : t('editProperty.activate')}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setShowArchiveDialog(true)}
            disabled={isArchiving}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            {isArchiving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('editProperty.archive')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
