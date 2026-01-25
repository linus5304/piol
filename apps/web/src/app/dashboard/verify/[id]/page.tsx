'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { RequireRole, usePermissions } from '@/hooks/use-permissions';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
  AlertCircle,
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  Calendar,
  CheckCircle,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}

const propertyTypeLabels: Record<string, string> = {
  studio: 'Studio',
  '1br': '1 Chambre',
  '2br': '2 Chambres',
  '3br': '3 Chambres',
  '4br': '4 Chambres',
  house: 'Maison',
  apartment: 'Appartement',
  villa: 'Villa',
};

// Verification checklist items
const verificationChecklist = [
  { id: 'photos', label: 'Photos conformes et récentes', required: true },
  { id: 'description', label: 'Description exacte et complète', required: true },
  { id: 'price', label: 'Prix correspondant au marché', required: true },
  { id: 'address', label: 'Adresse vérifiable', required: true },
  { id: 'landlord', label: 'Identité du propriétaire vérifiée', required: true },
  { id: 'amenities', label: 'Équipements confirmés', required: false },
  { id: 'availability', label: 'Disponibilité confirmée', required: false },
];

function VerifyPropertyContent({ propertyId }: { propertyId: string }) {
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
    if (!allRequiredChecked) {
      toast.error('Veuillez compléter tous les éléments requis de la checklist');
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
        notes: notes || 'Propriété vérifiée et approuvée.',
      });

      toast.success('Propriété approuvée avec succès');
      router.push('/dashboard/verify');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already assigned')) {
        toast.error('Cette propriété est déjà en cours de vérification');
      } else {
        toast.error("Erreur lors de l'approbation");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [allRequiredChecked, claimVerification, completeVerification, propertyId, notes, router]);

  const handleReject = useCallback(async () => {
    if (!notes.trim()) {
      toast.error('Veuillez indiquer la raison du rejet');
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

      toast.success('Propriété rejetée');
      router.push('/dashboard/verify');
    } catch (error) {
      if (error instanceof Error && error.message.includes('already assigned')) {
        toast.error('Cette propriété est déjà en cours de vérification');
      } else {
        toast.error('Erreur lors du rejet');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [claimVerification, completeVerification, propertyId, notes, router]);

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
        <h2 className="text-xl font-semibold mb-2">Propriété non trouvée</h2>
        <p className="text-muted-foreground mb-4">
          Cette propriété n'existe pas ou a été supprimée.
        </p>
        <Link href="/dashboard/verify">
          <Button>Retour aux vérifications</Button>
        </Link>
      </div>
    );
  }

  const images = property.images?.filter((img) => img.url) || [];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/verify">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {property.neighborhood}, {property.city}
          </p>
        </div>
        <Badge variant="secondary" className="bg-warning/10 text-warning">
          En attente de vérification
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
                Photos ({images.length})
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
                  <p>Aucune photo</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Détails de la propriété
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">
                    {propertyTypeLabels[property.propertyType] || property.propertyType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loyer mensuel</p>
                  <p className="font-medium font-mono tabular-nums">
                    {formatCurrency(property.rentAmount)}
                  </p>
                </div>
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span>{property.bedrooms} chambre(s)</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span>{property.bathrooms} salle(s) de bain</span>
                  </div>
                )}
              </div>

              {property.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{property.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">Adresse complète</p>
                <p className="text-sm">
                  {property.addressLine1}
                  {property.addressLine2 && <>, {property.addressLine2}</>}
                  <br />
                  {property.neighborhood}, {property.city}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Soumis le</p>
                <p className="text-sm">{formatDate(property._creationTime)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Landlord Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations du propriétaire
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
                            Identité vérifiée
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Non vérifié</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {property.landlord.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">{property.landlord.phone}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Informations non disponibles</p>
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
                Checklist de vérification
              </CardTitle>
              <CardDescription>
                Cochez les éléments vérifiés. Les éléments marqués * sont obligatoires.
              </CardDescription>
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
                    {item.label}
                    {item.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Ajoutez des observations ou la raison du rejet</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes de vérification..."
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
                Approuver
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
                Rejeter
              </Button>
              <Link href={`/properties/${propertyId}`} target="_blank" className="block">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir la page publique
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
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
    <RequireRole
      roles={['admin', 'verifier']}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <Link href="/dashboard">
            <Button>Retour au tableau de bord</Button>
          </Link>
        </div>
      }
    >
      <VerifyPropertyContent propertyId={id} />
    </RequireRole>
  );
}
