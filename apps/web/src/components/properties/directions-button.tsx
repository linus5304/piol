'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'gt-next';
import { ExternalLink, MapIcon, Navigation } from 'lucide-react';

interface DirectionsButtonProps {
  latitude: number;
  longitude: number;
}

export function DirectionsButton({ latitude, longitude }: DirectionsButtonProps) {
  const t = useTranslations();

  const destinations = [
    {
      label: t('directions.googleMaps'),
      url: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      icon: Navigation,
    },
    {
      label: t('directions.appleMaps'),
      url: `https://maps.apple.com/?daddr=${latitude},${longitude}`,
      icon: MapIcon,
    },
    {
      label: t('directions.waze'),
      url: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes&zoom=17`,
      icon: ExternalLink,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Navigation className="w-4 h-4 mr-2" />
          {t('directions.getDirections')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {destinations.map((dest) => {
          const Icon = dest.icon;
          return (
            <DropdownMenuItem key={dest.label} asChild>
              <a href={dest.url} target="_blank" rel="noopener noreferrer">
                <Icon className="w-4 h-4 mr-2" />
                {dest.label}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
