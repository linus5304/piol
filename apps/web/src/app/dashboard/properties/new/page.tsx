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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const propertyTypes = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 Chambre' },
  { value: '2br', label: '2 Chambres' },
  { value: '3br', label: '3 Chambres' },
  { value: '4br', label: '4+ Chambres' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'villa', label: 'Villa' },
];

const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Buea', 'Kribi', 'Limbe', 'Bamenda'];

const amenities = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'parking', label: 'Parking', icon: '🚗' },
  { id: 'ac', label: 'Climatisation', icon: '❄️' },
  { id: 'security', label: 'Sécurité 24h', icon: '🔐' },
  { id: 'water247', label: 'Eau 24/7', icon: '💧' },
  { id: 'electricity247', label: 'Électricité 24/7', icon: '⚡' },
  { id: 'furnished', label: 'Meublé', icon: '🛋️' },
  { id: 'balcony', label: 'Balcon', icon: '🌅' },
  { id: 'garden', label: 'Jardin', icon: '🌳' },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convex mutations
  const createProperty = useMutation(api.properties.createProperty);
  const addPropertyImages = useMutation(api.properties.addPropertyImages);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    city: '',
    neighborhood: '',
    addressLine1: '',
    rentAmount: '',
    cautionMonths: '2',
    upfrontMonths: '6',
    selectedAmenities: [] as string[],
    images: [] as File[],
  });

  const updateForm = (field: string, value: string | string[] | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
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

  // Upload a single image to Convex storage
  const uploadImage = async (file: File): Promise<Id<'_storage'>> => {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    const { storageId } = await response.json();
    return storageId;
  };

  // Convert amenities array to object format
  const convertAmenities = (selected: string[]) => {
    const amenityKeys = [
      'wifi',
      'parking',
      'ac',
      'security',
      'water247',
      'electricity247',
      'furnished',
      'balcony',
      'garden',
    ] as const;
    const result: Record<string, boolean> = {};
    for (const key of amenityKeys) {
      if (selected.includes(key)) {
        result[key] = true;
      }
    }
    return result;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Upload images to Convex storage
      const uploadedImages: { storageId: Id<'_storage'>; order: number }[] = [];
      for (let i = 0; i < formData.images.length; i++) {
        const storageId = await uploadImage(formData.images[i]);
        uploadedImages.push({ storageId, order: i });
      }

      // 2. Create property with status 'draft'
      const propertyId = await createProperty({
        title: formData.title,
        description: formData.description || undefined,
        propertyType: formData.propertyType as
          | 'studio'
          | '1br'
          | '2br'
          | '3br'
          | '4br'
          | 'house'
          | 'apartment'
          | 'villa',
        rentAmount: Number(formData.rentAmount),
        cautionMonths: Number(formData.cautionMonths),
        upfrontMonths: Number(formData.upfrontMonths),
        city: formData.city,
        neighborhood: formData.neighborhood || undefined,
        addressLine1: formData.addressLine1 || undefined,
        amenities: convertAmenities(formData.selectedAmenities),
      });

      // 3. Add images to property (if any)
      if (uploadedImages.length > 0) {
        await addPropertyImages({
          propertyId,
          images: uploadedImages,
        });
      }

      // 4. Redirect to property list
      router.push('/dashboard/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Erreur lors de la création de la propriété: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="text-gray-500 hover:text-gray-700">
          ← Retour
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle propriété</h1>
          <p className="text-gray-600">Étape {step} sur 3</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-[#FF385C]' : 'bg-gray-200'}`}
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
                className="w-full min-h-[120px] px-3 py-2 border rounded-md"
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
                {amenities.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                      formData.selectedAmenities.includes(amenity.id)
                        ? 'bg-[#FF385C]/10 border-[#FF385C] text-[#FF385C]'
                        : 'hover:bg-gray-50'
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
              <p className="text-gray-600 mb-4">
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
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((file, index) => (
                  <div
                    key={file.name}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
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
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Récapitulatif</h4>
              <p className="text-sm text-gray-600">{formData.title}</p>
              <p className="text-sm text-gray-600">
                {formData.neighborhood}, {formData.city}
              </p>
              <p className="text-sm font-medium text-[#FF385C]">
                {Number(formData.rentAmount).toLocaleString('fr-FR')} FCFA/mois
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Précédent
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" disabled={isSubmitting}>
                  Enregistrer brouillon
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Publication...' : "Publier l'annonce"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
