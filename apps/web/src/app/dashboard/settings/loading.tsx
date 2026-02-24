import { Skeleton } from '@/components/ui/skeleton';

const FIELD_KEYS = ['s-0', 's-1', 's-2', 's-3'];
const PREF_KEYS = ['s-0', 's-1'];

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Two-column settings layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {FIELD_KEYS.map((id) => (
          <div key={id} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Preferences section */}
      <div className="space-y-4 pt-6 border-t border-border">
        <Skeleton className="h-6 w-40" />
        <div className="grid md:grid-cols-2 gap-6">
          {PREF_KEYS.map((id) => (
            <div key={id} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="h-10 w-36" />
    </div>
  );
}
