'use client';

import { PageHeader, PageSection, PublicLayout } from '@/components/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'gt-next/client';

interface ChangelogEntry {
  version: string;
  dateKey: string;
  type: 'feature' | 'improvement' | 'fix';
  titleKey: string;
  descKey: string;
}

const changelog: ChangelogEntry[] = [
  {
    version: '1.2.0',
    dateKey: 'changelog.entry1Date',
    type: 'feature',
    titleKey: 'changelog.entry1Title',
    descKey: 'changelog.entry1Desc',
  },
  {
    version: '1.1.0',
    dateKey: 'changelog.entry2Date',
    type: 'feature',
    titleKey: 'changelog.entry2Title',
    descKey: 'changelog.entry2Desc',
  },
  {
    version: '1.0.2',
    dateKey: 'changelog.entry3Date',
    type: 'improvement',
    titleKey: 'changelog.entry3Title',
    descKey: 'changelog.entry3Desc',
  },
  {
    version: '1.0.1',
    dateKey: 'changelog.entry4Date',
    type: 'fix',
    titleKey: 'changelog.entry4Title',
    descKey: 'changelog.entry4Desc',
  },
  {
    version: '1.0.0',
    dateKey: 'changelog.entry5Date',
    type: 'feature',
    titleKey: 'changelog.entry5Title',
    descKey: 'changelog.entry5Desc',
  },
];

const typeVariants = {
  feature: 'default' as const,
  improvement: 'secondary' as const,
  fix: 'outline' as const,
};

export default function ChangelogPage() {
  const t = useTranslations();

  const typeLabels = {
    feature: t('changelog.typeFeature'),
    improvement: t('changelog.typeImprovement'),
    fix: t('changelog.typeFix'),
  };

  return (
    <PublicLayout>
      <PageSection>
        <PageHeader
          title={t('changelog.title')}
          description={t('changelog.description')}
          centered
        />

        <div className="max-w-2xl mx-auto mt-12 space-y-6">
          {changelog.map((entry) => (
            <Card key={entry.version}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={typeVariants[entry.type]}>{typeLabels[entry.type]}</Badge>
                    <span className="text-sm text-muted-foreground">v{entry.version}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{t(entry.dateKey)}</span>
                </div>
                <CardTitle className="text-lg mt-2">{t(entry.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{t(entry.descKey)}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PublicLayout>
  );
}
