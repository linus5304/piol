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
import { useSafeUser } from '@/hooks/use-safe-auth';
import { api } from '@repo/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, isLoaded } = useSafeUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfile = useMutation(api.users.updateProfile);

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [role, setRole] = useState<'renter' | 'landlord'>(
    (user?.unsafeMetadata?.role as 'renter' | 'landlord') || 'renter'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update Clerk user
      await user?.update({
        firstName,
        lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role,
          onboardingCompleted: true,
        },
      });

      // Update Convex user with phone and language preference
      await updateProfile({
        firstName,
        lastName,
        phone: phone || undefined,
        languagePreference: language,
      });

      toast.success('Profil mis à jour avec succès!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Gérez votre profil et vos préférences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Mettez à jour vos informations de profil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.primaryEmailAddress?.emailAddress || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                L'email est géré via votre compte de connexion
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
              />
            </div>
          </CardContent>
        </Card>

        {/* Role & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
            <CardDescription>Personnalisez votre expérience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Type de compte</Label>
              <Select value={role} onValueChange={(v) => setRole(v as 'renter' | 'landlord')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renter">🏠 Locataire - Je cherche un logement</SelectItem>
                  <SelectItem value="landlord">🔑 Propriétaire - Je loue des propriétés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Langue préférée</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v as 'fr' | 'en')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Gérez vos préférences de notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications email</p>
                <p className="text-sm text-gray-500">
                  Recevoir des emails pour les nouveaux messages
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertes de propriétés</p>
                <p className="text-sm text-gray-500">
                  Être notifié des nouvelles propriétés correspondant à vos critères
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-gray-500">
                  Recevoir des conseils et actualités immobilières
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Zone de danger</CardTitle>
          <CardDescription>Actions irréversibles sur votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
