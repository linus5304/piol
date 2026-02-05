'use client';

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
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const propertyTypes = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 Chambre' },
  { value: '2br', label: '2 Chambres' },
  { value: '3br', label: '3 Chambres' },
  { value: '4br', label: '4+ Chambres' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'villa', label: 'Villa' },
] as const;

type PropertyType = (typeof propertyTypes)[number]['value'];

const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Buea', 'Kribi', 'Limbe', 'Bamenda'];

const amenitiesList = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'parking', label: 'Parking', icon: '🚗' },
  { id: 'ac', label: 'Climatisation', icon: '❄️' },
  { id: 'security', label: 'Sécurité 24h', icon: '🔐' },
  { id: 'water247', label: 'Eau 24/7', icon: '💧' },
  { id: 'electricity247', label: 'Électricité 24/7', icon: '⚡' },
  { id: 'furnished', label: 'Meublé', icon: '🛋️' },
  { id: 'balcony', label: 'Balcon', icon: '🌅' },
  { id: 'garden', label: 'Jardin', icon: '🌳' },
] as const;

type AmenityId = (typeof amenitiesList)[number]['id'];

export default function NewPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

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

  const updateForm = (field: string, value: string | AmenityId[] | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
          toast.error("Les photos n'ont pas pu être ajoutées.");
        }
      }

      toast.success(
        saveAsDraft ? 'Brouillon enregistré avec succès' : 'Propriété créée avec succès'
      );
      router.push('/dashboard/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Erreur lors de la création de la propriété');
    } finally {
      setIsSubmitting(false);
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="text-muted-foreground hover:text-foreground">
          ← Retour
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouvelle propriété</h1>
          <p className="text-muted-foreground">Étape {step} sur 3</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
            <CardDescription>Décrivez votre propriété</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'annonce *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="Ex: Bel appartement 2 chambres à Makepe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Décrivez votre propriété en détail..."
                className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Type de propriété *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(v) => updateForm('propertyType', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
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
                <Label>Ville *</Label>
                <Select value={formData.city} onValueChange={(v) => updateForm('city', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
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
                <Label htmlFor="neighborhood">Quartier</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => updateForm('neighborhood', e.target.value)}
                  placeholder="Ex: Makepe, Bastos..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.addressLine1}
                  onChange={(e) => updateForm('addressLine1', e.target.value)}
                  placeholder="Adresse approximative"
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
                  onChange={(e) => updateForm('latitude', e.target.value)}
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
                  onChange={(e) => updateForm('longitude', e.target.value)}
                  placeholder="11.5021"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Ajoutez des coordonnees pour afficher la propriete sur la carte.
            </p>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.propertyType || !formData.city}
              >
                Suivant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Pricing & Amenities */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Prix et équipements</CardTitle>
            <CardDescription>Définissez les conditions de location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="rent">Loyer mensuel (FCFA) *</Label>
                <Input
                  id="rent"
                  type="number"
                  value={formData.rentAmount}
                  onChange={(e) => updateForm('rentAmount', e.target.value)}
                  placeholder="150000"
                />
              </div>

              <div className="space-y-2">
                <Label>Mois de caution</Label>
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
                        {n} mois
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Avance (mois)</Label>
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
                        {n} mois
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Équipements et commodités</Label>
              <div className="grid grid-cols-3 gap-3">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                      formData.selectedAmenities.includes(amenity.id)
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span>{amenity.icon}</span>
                    <span className="text-sm">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Précédent
              </Button>
              <Button onClick={() => setStep(3)} disabled={!formData.rentAmount}>
                Suivant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Photos & Submit */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Ajoutez des photos de votre propriété (recommandé: 5-10 photos)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-muted-foreground mb-4">
                Glissez vos photos ici ou cliquez pour sélectionner
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="photos"
                onChange={(e) => {
                  if (e.target.files) {
                    updateForm('images', Array.from(e.target.files));
                  }
                }}
              />
              <label htmlFor="photos">
                <Button variant="outline" asChild>
                  <span>Sélectionner des photos</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4">
                Les photos seront ajoutees lors de la creation de l'annonce
              </p>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((file, index) => (
                  <div
                    key={file.name}
                    className="aspect-square bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Récapitulatif</h4>
              <p className="text-sm text-muted-foreground">{formData.title}</p>
              <p className="text-sm text-muted-foreground">
                {formData.neighborhood ? `${formData.neighborhood}, ` : ''}
                {formData.city}
              </p>
              <p className="text-sm font-medium text-primary">
                {Number(formData.rentAmount).toLocaleString('fr-FR')} FCFA/mois
              </p>
              {formData.selectedAmenities.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formData.selectedAmenities.length} équipement(s) sélectionné(s)
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Précédent
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={isSubmitting || isSavingDraft}
                  onClick={() => handleSubmit(true)}
                >
                  {isSavingDraft && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Enregistrer brouillon
                </Button>
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || isSavingDraft}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSubmitting ? 'Création...' : "Créer l'annonce"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
