'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { ImageOff, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'text-success' },
  draft: { label: 'Brouillon', color: 'text-muted-foreground' },
  pending_verification: { label: 'En vérification', color: 'text-warning' },
  verified: { label: 'Vérifié', color: 'text-success' },
  rented: { label: 'Loué', color: 'text-primary' },
  archived: { label: 'Archivé', color: 'text-muted-foreground' },
};

const verificationLabels: Record<string, { label: string; color: string }> = {
  approved: { label: '✓ Vérifié', color: 'text-success' },
  pending: { label: '⏳ En attente', color: 'text-warning' },
  in_progress: { label: '🔍 En cours', color: 'text-warning' },
  rejected: { label: '✗ Rejeté', color: 'text-destructive' },
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [removingImageId, setRemovingImageId] = useState<Id<'_storage'> | null>(null);

  const property = useQuery(
    api.properties.getProperty,
    id ? { propertyId: id as Id<'properties'> } : 'skip'
  );

  const updateProperty = useMutation(api.properties.updateProperty);
  const togglePropertyStatus = useMutation(api.properties.togglePropertyStatus);
  const archiveProperty = useMutation(api.properties.archiveProperty);
  const submitForVerification = useMutation(api.properties.submitForVerification);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addPropertyImages = useMutation(api.properties.addPropertyImages);
  const removePropertyImage = useMutation(api.properties.removePropertyImage);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rentAmount: '',
    cautionMonths: '',
    upfrontMonths: '',
    latitude: '',
    longitude: '',
  });

  // Update form when property loads
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description || '',
        rentAmount: property.rentAmount.toString(),
        cautionMonths: property.cautionMonths.toString(),
        upfrontMonths: property.upfrontMonths.toString(),
        latitude: property.location?.latitude?.toString() ?? '',
        longitude: property.location?.longitude?.toString() ?? '',
      });
    }
  }, [property]);

  const handleSave = async () => {
    if (!property) return;

    setIsUpdating(true);
    try {
      const hasLatitude = formData.latitude.trim().length > 0;
      const hasLongitude = formData.longitude.trim().length > 0;

      if ((hasLatitude && !hasLongitude) || (!hasLatitude && hasLongitude)) {
        toast.error('Veuillez renseigner la latitude et la longitude.');
        return;
      }

      const latitude = Number(formData.latitude);
      const longitude = Number(formData.longitude);
      if (
        hasLatitude &&
        hasLongitude &&
        (!Number.isFinite(latitude) || !Number.isFinite(longitude))
      ) {
        toast.error('Coordonnees invalides.');
        return;
      }
      const location =
        hasLatitude && hasLongitude && Number.isFinite(latitude) && Number.isFinite(longitude)
          ? { latitude, longitude }
          : undefined;

      await updateProperty({
        propertyId: property._id,
        title: formData.title,
        description: formData.description || undefined,
        rentAmount: Number(formData.rentAmount),
        location,
      });
      toast.success('Propriété mise à jour');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Erreur lors de la mise à jour');
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
      toast.success('Photos ajoutées');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error("Erreur lors de l'upload des photos");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleRemoveImage = async (storageId: Id<'_storage'>) => {
    if (!property) return;

    setRemovingImageId(storageId);
    try {
      await removePropertyImage({ propertyId: property._id, storageId });
      toast.success('Photo supprimée');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Erreur lors de la suppression');
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
      toast.success(isCurrentlyActive ? 'Propriété désactivée' : 'Propriété activée');
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Erreur lors du changement de statut');
    } finally {
      setIsToggling(false);
    }
  };

  const handleSubmitForVerification = async () => {
    if (!property) return;

    try {
      await submitForVerification({ propertyId: property._id });
      toast.success('Propriété soumise pour vérification');
    } catch (error) {
      console.error('Error submitting for verification:', error);
      toast.error('Erreur lors de la soumission');
    }
  };

  const handleArchive = async () => {
    if (!property) return;

    if (!window.confirm('Êtes-vous sûr de vouloir archiver cette propriété ?')) {
      return;
    }

    setIsArchiving(true);
    try {
      await archiveProperty({ propertyId: property._id });
      toast.success('Propriété archivée');
      router.push('/dashboard/properties');
    } catch (error) {
      console.error('Error archiving property:', error);
      toast.error("Erreur lors de l'archivage");
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
        <h1 className="text-2xl font-semibold text-foreground mb-2">Propriété introuvable</h1>
        <p className="text-muted-foreground mb-8">
          Cette propriété n'existe pas ou vous n'avez pas accès.
        </p>
        <Link href="/dashboard/properties">
          <Button>Retour aux propriétés</Button>
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
            ← Retour
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Modifier la propriété</h1>
            <p className="text-muted-foreground">{property.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {property.status === 'active' && (
            <Link href={`/properties/${id}`}>
              <Button variant="outline">Voir l'annonce</Button>
            </Link>
          )}
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Statut</CardDescription>
            <CardTitle className={`text-2xl ${statusLabels[property.status]?.color}`}>
              {statusLabels[property.status]?.label || property.status}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vérification</CardDescription>
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
            <CardDescription>Créé le</CardDescription>
            <CardTitle className="text-lg">{formatDate(property._creationTime)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Loyer</CardDescription>
            <CardTitle className="text-2xl text-primary font-mono tabular-nums">
              {property.rentAmount.toLocaleString('fr-FR')} FCFA
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rent">Loyer mensuel (FCFA)</Label>
              <Input
                id="rent"
                type="number"
                value={formData.rentAmount}
                onChange={(e) => setFormData((prev) => ({ ...prev, rentAmount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caution">Mois de caution</Label>
              <Input
                id="caution"
                type="number"
                value={formData.cautionMonths}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cautionMonths: e.target.value }))
                }
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upfront">Avance (mois)</Label>
              <Input
                id="upfront"
                type="number"
                value={formData.upfrontMonths}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, upfrontMonths: e.target.value }))
                }
                disabled
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                placeholder="3.848"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                placeholder="11.5021"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Ajoutez des coordonnees pour afficher la propriete sur la carte.
          </p>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>Gérez les photos de votre propriété</CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">📷</div>
              <p>Aucune photo pour le moment</p>
              <label
                htmlFor="property-photo-upload"
                className="mt-4 inline-flex items-center justify-center rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
              >
                {isUploadingImages ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Ajouter des photos</span>
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

      {/* Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {property.status === 'draft' && (
            <Button variant="outline" onClick={handleSubmitForVerification}>
              Soumettre pour vérification
            </Button>
          )}

          {property.verificationStatus === 'approved' && (
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              disabled={isToggling}
              className={property.status === 'active' ? 'text-warning border-warning' : ''}
            >
              {isToggling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {property.status === 'active' ? "Désactiver l'annonce" : "Activer l'annonce"}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleArchive}
            disabled={isArchiving}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            {isArchiving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Archiver l'annonce
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
