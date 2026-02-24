'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'gt-next';
import { Copy, Facebook, MessageCircle } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  propertyId: string;
  title?: string;
  rent?: number;
  className?: string;
}

export function ShareButtons({ propertyId, title, rent, className }: ShareButtonsProps) {
  const t = useTranslations();

  const propertyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${propertyId}`;

  const shareText = title
    ? t('newProperty.shareText', {
        title,
        rent: rent ? rent.toLocaleString('fr-FR') : '...',
        url: propertyUrl,
      })
    : propertyUrl;

  const handleWhatsApp = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title, text: shareText, url: propertyUrl }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener');
    }
  }, [title, shareText, propertyUrl]);

  const handleFacebook = useCallback(() => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
      '_blank',
      'noopener,width=600,height=400'
    );
  }, [propertyUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success(t('newProperty.shareCopied'));
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(t('newProperty.shareCopied'));
    }
  }, [shareText, t]);

  return (
    <div className={className}>
      <p className="text-sm font-medium mb-3">{t('newProperty.shareTitle')}</p>
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={handleWhatsApp}>
          <MessageCircle className="w-4 h-4 mr-2" />
          {t('newProperty.shareWhatsapp')}
        </Button>
        <Button variant="outline" size="sm" onClick={handleFacebook}>
          <Facebook className="w-4 h-4 mr-2" />
          {t('newProperty.shareFacebook')}
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          <Copy className="w-4 h-4 mr-2" />
          {t('newProperty.shareCopyLink')}
        </Button>
      </div>
    </div>
  );
}
