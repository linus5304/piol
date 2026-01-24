import { PageHeader, PageSection, PublicLayout } from '@/components/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'feature' | 'improvement' | 'fix';
  title: string;
  description: string;
}

const changelog: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: 'Janvier 2026',
    type: 'feature',
    title: 'Vue carte interactive',
    description:
      'Explorez les propriétés sur une carte interactive avec des marqueurs de prix et des filtres géographiques.',
  },
  {
    version: '1.1.0',
    date: 'Janvier 2026',
    type: 'feature',
    title: 'Galerie photos améliorée',
    description: 'Nouvelle galerie avec carrousel plein écran, zoom et navigation au clavier.',
  },
  {
    version: '1.0.2',
    date: 'Décembre 2025',
    type: 'improvement',
    title: 'Performance optimisée',
    description: 'Chargement des pages plus rapide et meilleure expérience sur mobile.',
  },
  {
    version: '1.0.1',
    date: 'Décembre 2025',
    type: 'fix',
    title: 'Corrections diverses',
    description: 'Corrections de bugs mineurs et améliorations de stabilité.',
  },
  {
    version: '1.0.0',
    date: 'Novembre 2025',
    type: 'feature',
    title: 'Lancement de Piol',
    description: 'Première version publique de Piol - la plateforme immobilière camerounaise.',
  },
];

const typeLabels = {
  feature: { label: 'Nouveauté', variant: 'default' as const },
  improvement: { label: 'Amélioration', variant: 'secondary' as const },
  fix: { label: 'Correction', variant: 'outline' as const },
};

export default function ChangelogPage() {
  return (
    <PublicLayout>
      <PageSection>
        <PageHeader
          title="Nouveautés"
          description="Découvrez les dernières fonctionnalités et améliorations de Piol."
          centered
        />

        <div className="max-w-2xl mx-auto mt-12 space-y-6">
          {changelog.map((entry) => (
            <Card key={entry.version}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={typeLabels[entry.type].variant}>
                      {typeLabels[entry.type].label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">v{entry.version}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                </div>
                <CardTitle className="text-lg mt-2">{entry.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{entry.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PublicLayout>
  );
}
