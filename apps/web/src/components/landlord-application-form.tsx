'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useTranslations } from 'gt-next';
import { Camera, CheckCircle, Loader2, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

interface LandlordApplicationFormProps {
  onComplete?: () => void;
}

export function LandlordApplicationForm({ onComplete }: LandlordApplicationFormProps) {
  const t = useTranslations();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const submitApplication = useMutation(api.landlordApplications.submitLandlordApplication);

  const [cniFront, setCniFront] = useState<Id<'_storage'> | null>(null);
  const [cniBack, setCniBack] = useState<Id<'_storage'> | null>(null);
  const [cniFrontPreview, setCniFrontPreview] = useState<string | null>(null);
  const [cniBackPreview, setCniBackPreview] = useState<string | null>(null);
  const [motivation, setMotivation] = useState('');
  const [isUploading, setIsUploading] = useState<'front' | 'back' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File, side: 'front' | 'back') => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(t('landlordApplication.invalidFileType'));
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(t('landlordApplication.fileTooLarge'));
        return;
      }

      setError(null);
      setIsUploading(side);

      try {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!response.ok) throw new Error('Upload failed');

        const { storageId } = (await response.json()) as { storageId: Id<'_storage'> };
        const preview = URL.createObjectURL(file);

        if (side === 'front') {
          setCniFront(storageId);
          setCniFrontPreview(preview);
        } else {
          setCniBack(storageId);
          setCniBackPreview(preview);
        }
      } catch {
        setError('Upload failed. Please try again.');
      } finally {
        setIsUploading(null);
      }
    },
    [generateUploadUrl, t]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file, side);
    },
    [uploadFile]
  );

  const handleSubmit = async () => {
    if (!cniFront || !cniBack) return;
    if (motivation.trim().length < 20) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitApplication({
        cniPhotoFront: cniFront,
        cniPhotoBack: cniBack,
        motivationText: motivation,
      });
      onComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setIsSubmitting(false);
    }
  };

  const canSubmit = cniFront && cniBack && motivation.trim().length >= 20 && !isSubmitting;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{t('landlordApplication.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('landlordApplication.subtitle')}</p>
      </div>

      {/* CNI Front */}
      <div className="space-y-2">
        <Label>{t('landlordApplication.cniFrontLabel')}</Label>
        <p className="text-xs text-muted-foreground">{t('landlordApplication.cniFrontDesc')}</p>
        <input
          ref={frontInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'front')}
        />
        {cniFrontPreview ? (
          <div className="relative">
            <img
              src={cniFrontPreview}
              alt="CNI Front"
              className="w-full h-40 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={() => frontInputRef.current?.click()}
              disabled={!!isUploading}
            >
              <Camera className="h-4 w-4 mr-1" />
              {t('landlordApplication.changePhoto')}
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => frontInputRef.current?.click()}
            disabled={!!isUploading}
            className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            {isUploading === 'front' ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <Upload className="h-8 w-8" />
                <span className="text-sm">{t('landlordApplication.uploadPhoto')}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* CNI Back */}
      <div className="space-y-2">
        <Label>{t('landlordApplication.cniBackLabel')}</Label>
        <p className="text-xs text-muted-foreground">{t('landlordApplication.cniBackDesc')}</p>
        <input
          ref={backInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'back')}
        />
        {cniBackPreview ? (
          <div className="relative">
            <img
              src={cniBackPreview}
              alt="CNI Back"
              className="w-full h-40 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={() => backInputRef.current?.click()}
              disabled={!!isUploading}
            >
              <Camera className="h-4 w-4 mr-1" />
              {t('landlordApplication.changePhoto')}
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => backInputRef.current?.click()}
            disabled={!!isUploading}
            className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            {isUploading === 'back' ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <Upload className="h-8 w-8" />
                <span className="text-sm">{t('landlordApplication.uploadPhoto')}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Motivation */}
      <div className="space-y-2">
        <Label>{t('landlordApplication.motivationLabel')}</Label>
        <Textarea
          placeholder={t('landlordApplication.motivationPlaceholder')}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          rows={4}
          maxLength={2000}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t('landlordApplication.motivationHint')}</span>
          <span>{motivation.length}/2000</span>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('landlordApplication.submitting')}
          </>
        ) : (
          t('landlordApplication.submit')
        )}
      </Button>
    </div>
  );
}
