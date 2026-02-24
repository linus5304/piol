'use client';

import { useTranslations } from 'gt-next';
import { ImagePlus, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface PhotosBlockProps {
  images: File[];
  onAddImages: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
}

export function PhotosBlock({ images, onAddImages, onRemoveImage }: PhotosBlockProps) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onAddImages(e.target.files);
        e.target.value = '';
      }
    },
    [onAddImages]
  );

  // Preview URLs — created/revoked inside useEffect so Strict Mode double-fire
  // produces fresh (non-revoked) URLs on remount instead of stale cached ones.
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [images]);

  return (
    <div className="space-y-4 p-1">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {images.length === 0 ? (
        /* Empty state — large drop zone */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-accent/30 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <ImagePlus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{t('newProperty.selectPhotos')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('newProperty.photosHint')}</p>
          </div>
        </button>
      ) : (
        /* Thumbnail grid with previews */
        <>
          <div className="grid grid-cols-3 gap-3">
            {images.map((file, index) => (
              <div key={`${file.name}-${file.size}-${index}`} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden ring-1 ring-border">
                  {previews[index] ? (
                    <img
                      src={previews[index]}
                      alt={`${t('newProperty.blockPhotos')} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted animate-pulse" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-[10px] text-muted-foreground mt-1 truncate text-center">
                  {formatFileSize(file.size)}
                </p>
              </div>
            ))}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-accent/30 transition-colors"
            >
              <ImagePlus className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                {t('newProperty.addPhotos')}
              </span>
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            {t('newProperty.photosCount', { count: images.length })}
          </p>
        </>
      )}
    </div>
  );
}
