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
import { toStoragePhone } from '@/lib/validations/common';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useTranslations } from 'gt-next/client';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
  const t = useTranslations();
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

      // Validate & normalize phone to storage format (+237XXXXXXXXX)
      const storagePhone = phone ? toStoragePhone(phone) : undefined;
      if (phone && !storagePhone) {
        setPhoneError(t('admin.editPhoneError'));
        return;
      }
      setPhoneError('');

      setIsSubmitting(true);
      try {
        await adminUpdateUser({
          userId: user._id,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          phone: storagePhone,
        });
        if (role !== user.role && user.role !== 'admin') {
          await updateUserRole({
            userId: user._id,
            role: role as 'renter' | 'landlord' | 'verifier',
          });
        }
        toast.success(t('admin.toastProfileUpdated'));
        onOpenChange(false);
      } catch {
        toast.error(t('admin.toastProfileError'));
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
      t,
    ]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('admin.editDialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('admin.editDialogDesc', { name: user.firstName || user.email })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-email">{t('admin.editEmail')}</Label>
            <Input id="edit-email" value={user.email} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-firstName">{t('admin.editFirstName')}</Label>
            <Input
              id="edit-firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('admin.editFirstName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-lastName">{t('admin.editLastName')}</Label>
            <Input
              id="edit-lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('admin.editLastName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">{t('admin.editPhone')}</Label>
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
            <Label htmlFor="edit-role">{t('admin.editRole')}</Label>
            <Select value={role} onValueChange={setRole} disabled={user.role === 'admin'}>
              <SelectTrigger id="edit-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="renter">{t('roles.renter')}</SelectItem>
                <SelectItem value="landlord">{t('roles.landlord')}</SelectItem>
                <SelectItem value="verifier">{t('roles.verifier')}</SelectItem>
                <SelectItem value="admin" disabled>
                  {t('roles.admin')}
                </SelectItem>
              </SelectContent>
            </Select>
            {user.role === 'admin' && (
              <p className="text-xs text-muted-foreground">{t('admin.editRoleAdminNote')}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
