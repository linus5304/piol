import { env } from '@/lib/env';
import type { City } from '@/lib/validations';

export const MAPBOX_ACCESS_TOKEN = env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
export const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v12';

export const CITY_CENTERS: Record<City, { lat: number; lng: number; zoom: number }> = {
  Douala: { lat: 4.0511, lng: 9.7679, zoom: 13 },
  Yaoundé: { lat: 3.848, lng: 11.5021, zoom: 13 },
  Bafoussam: { lat: 5.4764, lng: 10.4218, zoom: 14 },
  Buea: { lat: 4.156, lng: 9.2632, zoom: 14 },
  Kribi: { lat: 2.9491, lng: 9.9076, zoom: 14 },
  Limbe: { lat: 4.0244, lng: 9.2031, zoom: 14 },
  Bamenda: { lat: 5.9527, lng: 10.146, zoom: 14 },
};
