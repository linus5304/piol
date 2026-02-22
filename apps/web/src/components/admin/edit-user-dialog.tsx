'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const CM_PHONE_RE = /^\+237[62]\d{8}$/;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    _id: Id<'users'>;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email: string;
    role: string;
  };
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const [firstName, setFirstName] = useState(user.firstName ?? '');
  const [lastName, setLastName] = useState(user.lastName ?? '');
  const [phone, setPhone] = useState(user.phone ?? '');
  const [role, setRole] = useState(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const adminUpdateUser = useMutation(api.users.adminUpdateUser);
  const updateUserRole = useMutation(api.users.updateUserRole);

  // Sync state when user prop changes
  useEffect(() => {
    if (open) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setPhone(user.phone ?? '');
      setRole(user.role);
      setPhoneError('');
    }
  }, [open, user]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate phone
      if (phone && !CM_PHONE_RE.test(phone)) {
        setPhoneError('Format attendu: +237 6XXXXXXXX ou +237 2XXXXXXXX');
        return;
      }
      setPhoneError('');

      setIsSubmitting(true);
      try {
        await adminUpdateUser({
          userId: user._id,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          phone: phone.trim() || undefined,
        });
        if (role !== user.role && user.role !== 'admin') {
          await updateUserRole({
            userId: user._id,
            role: role as 'renter' | 'landlord' | 'verifier',
          });
        }
        toast.success('Profil mis à jour avec succès');
        onOpenChange(false);
      } catch (error) {
        toast.error('Erreur lors de la mise à jour du profil');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      adminUpdateUser,
      updateUserRole,
      user._id,
      user.role,
      firstName,
      lastName,
      phone,
      role,
      onOpenChange,
    ]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
            Modifier les informations de {user.firstName || user.email}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" value={user.email} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-firstName">Prénom</Label>
            <Input
              id="edit-firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-lastName">Nom</Label>
            <Input
              id="edit-lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Téléphone</Label>
            <Input
              id="edit-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError('');
              }}
              placeholder="+237 6XXXXXXXX"
            />
            {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Rôle</Label>
            <Select value={role} onValueChange={setRole} disabled={user.role === 'admin'}>
              <SelectTrigger id="edit-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="renter">Locataire</SelectItem>
                <SelectItem value="landlord">Propriétaire</SelectItem>
                <SelectItem value="verifier">Vérificateur</SelectItem>
                <SelectItem value="admin" disabled>
                  Administrateur
                </SelectItem>
              </SelectContent>
            </Select>
            {user.role === 'admin' && (
              <p className="text-xs text-muted-foreground">
                Le rôle administrateur ne peut être modifié que depuis la base de données
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
