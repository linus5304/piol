'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { RequireRole, usePermissions } from '@/hooks/use-permissions';
import { parseAppLocale } from '@/i18n/config';
import { formatCurrencyFCFA, formatDate } from '@/lib/i18n-format';
import { validateApproval, validateRejection } from '@/lib/validations';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocale, useTranslations } from 'gt-next/client';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Shield,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

function formatVerificationDate(timestamp: number, locale: string): string {
  return formatDate(timestamp, locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatVerificationCurrency(amount: number, locale: string): string {
  return formatCurrencyFCFA(amount, locale);
}

const propertyTypeKeys: Record<string, string> = {
  studio: 'property.typeStudio',
  '1br': 'property.type1br',
  '2br': 'property.type2br',
  '3br': 'property.type3br',
  '4br': 'property.type4br',
  house: 'property.typeHouse',
  apartment: 'property.typeApartment',
  villa: 'property.typeVilla',
};

// Verification checklist items
const verificationChecklist = [
  { id: 'photos', labelKey: 'verify.checkPhotos', required: true },
  { id: 'description', labelKey: 'verify.checkDescription', required: true },
  { id: 'price', labelKey: 'verify.checkPrice', required: true },
  { id: 'address', labelKey: 'verify.checkAddress', required: true },
  { id: 'landlord', labelKey: 'verify.checkLandlord', required: true },
  { id: 'amenities', labelKey: 'verify.checkAmenities', required: false },
  { id: 'availability', labelKey: 'verify.checkAvailability', required: false },
];

function VerifyPropertyContent({ propertyId }: { propertyId: string }) {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations();
  const router = useRouter();
  const { isVerifier, isLoaded } = usePermissions();

  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not verifier
  useEffect(() => {
    if (isLoaded && !isVerifier) {
      router.push('/dashboard');
    }
  }, [isLoaded, isVerifier, router]);

  // Fetch property details
  const property = useQuery(api.properties.getProperty, {
    propertyId: propertyId as Id<'properties'>,
  });

  // Mutations
  const claimVerification = useMutation(api.verifications.claimVerification);
  const completeVerification = useMutation(api.verifications.completeVerification);

  const handleChecklistChange = useCallback((id: string, checked: boolean) => {
    setChecklist((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const allRequiredChecked = verificationChecklist
    .filter((item) => item.required)
    .every((item) => checklist[item.id]);

  const handleApprove = useCallback(async () => {
    const requiredIds = verificationChecklist
      .filter((item) => item.required)
      .map((item) => item.id);
    const error = validateApproval(checklist, requiredIds, t);
    if (error) {
      toast.error(error);
      return;
    }

    setIsSubmitting(true);
    try {
      // First claim the verification if not already claimed
      const verificationId = await claimVerification({
        propertyId: propertyId as Id<'properties'>,
        verificationType: 'property_visit',
      });

      // Then complete it
      await completeVerification({
        verificationId,
        status: 'approved',
        notes: notes || t('verify.defaultApprovalNote'),
      });

      toast.success(t('verify.toastApproved'));
      router.push('/dashboard/verify');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already assigned')) {
        toast.error(t('verify.toastAlreadyAssigned'));
      } else {
        toast.error(t('verify.toastApproveError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [checklist, t, claimVerification, completeVerification, propertyId, notes, router]);

  const handleReject = useCallback(async () => {
    const error = validateRejection(notes, t);
    if (error) {
      toast.error(error);
      return;
    }

    setIsSubmitting(true);
    try {
      // First claim the verification
      const verificationId = await claimVerification({
        propertyId: propertyId as Id<'properties'>,
        verificationType: 'property_visit',
      });

      // Then complete it as rejected
      await completeVerification({
        verificationId,
        status: 'rejected',
        notes,
      });

      toast.success(t('verify.toastRejected'));
      router.push('/dashboard/verify');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already assigned')) {
        toast.error(t('verify.toastAlreadyAssigned'));
      } else {
        toast.error(t('verify.toastRejectError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [notes, t, claimVerification, completeVerification, propertyId, router]);

  if (!isLoaded || !isVerifier) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (property === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('verify.propertyNotFound')}</h2>
        <p className="text-muted-foreground mb-4">{t('verify.propertyNotFoundDesc')}</p>
      </div>
    );
  }

  const images = property.imageUrls?.filter((img) => img.url) || [];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {property.neighborhood}, {property.city}
          </p>
        </div>
        <Badge variant="secondary" className="bg-warning/10 text-warning">
          {t('verify.pendingVerificationBadge')}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                {t('verify.photos')} ({images.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div
                      key={image.storageId || index}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted"
                    >
                      <Image
                        src={image.url || ''}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{t('verify.noPhotos')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t('verify.propertyDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('verify.type')}</p>
                  <p className="font-medium">
                    {propertyTypeKeys[property.propertyType]
                      ? t(propertyTypeKeys[property.propertyType])
                      : property.propertyType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('verify.monthlyRent')}</p>
                  <p className="font-medium font-mono tabular-nums">
                    {formatVerificationCurrency(property.rentAmount, locale)}
                  </p>
                </div>
              </div>

              {property.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('verify.description')}</p>
                  <p className="text-sm">{property.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('verify.fullAddress')}</p>
                <p className="text-sm">
                  {property.addressLine1}
                  {property.addressLine2 && <>, {property.addressLine2}</>}
                  <br />
                  {property.neighborhood}, {property.city}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('verify.submittedOnLabel')}</p>
                <p className="text-sm">{formatVerificationDate(property._creationTime, locale)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Landlord Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('verify.landlordInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {property.landlord ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                      {property.landlord.firstName?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-medium">
                        {property.landlord.firstName} {property.landlord.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {property.landlord.idVerified ? (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {t('verify.identityVerified')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">{t('verify.notVerified')}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t('verify.infoUnavailable')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Verification Sidebar */}
        <div className="space-y-6">
          {/* Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('verify.verificationChecklist')}
              </CardTitle>
              <CardDescription>{t('verify.checklistDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationChecklist.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <Checkbox
                    id={item.id}
                    checked={checklist[item.id] || false}
                    onCheckedChange={(checked) =>
                      handleChecklistChange(item.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={item.id} className="text-sm leading-none cursor-pointer">
                    {t(item.labelKey)}
                    {item.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>{t('verify.notes')}</CardTitle>
              <CardDescription>{t('verify.notesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('verify.notesPlaceholder')}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button
                className="w-full bg-success hover:bg-success/90"
                onClick={handleApprove}
                disabled={isSubmitting || !allRequiredChecked}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {t('verify.approve')}
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleReject}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                {t('verify.reject')}
              </Button>
              <Link href={`/properties/${propertyId}`} target="_blank" className="block">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('verify.viewPublicPage')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function VerifyPropertyAccessDenied() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">{t('common.accessDenied')}</h2>
      <p className="text-muted-foreground mb-4">{t('common.accessDeniedDesc')}</p>
      <Link href="/dashboard">
        <Button>{t('common.backToDashboard')}</Button>
      </Link>
    </div>
  );
}

export default function VerifyPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <RequireRole roles={['admin', 'verifier']} fallback={<VerifyPropertyAccessDenied />}>
      <VerifyPropertyContent propertyId={id} />
    </RequireRole>
  );
}
