'use client';

import { PageHeader, PageSection, PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'gt-next/client';
import { Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const t = useTranslations();

  const helpTopics = [
    {
      title: t('help.topicSearchTitle'),
      description: t('help.topicSearchDesc'),
      href: '/properties',
    },
    {
      title: t('help.topicContactTitle'),
      description: t('help.topicContactDesc'),
      href: '/contact',
    },
    {
      title: t('help.topicSecurityTitle'),
      description: t('help.topicSecurityDesc'),
      href: '/contact',
    },
    {
      title: t('help.topicPublishTitle'),
      description: t('help.topicPublishDesc'),
      href: '/sign-up?role=landlord',
    },
  ];

  return (
    <PublicLayout>
      <PageSection>
        <PageHeader title={t('help.title')} description={t('help.description')} centered />

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mt-12">
          {helpTopics.map((topic) => (
            <Card key={topic.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={topic.href}>
                  <Button variant="outline" size="sm">
                    {t('help.learnMore')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">{t('help.needMoreHelp')}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t('help.needMoreHelpDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('help.contactUs')}
              </Button>
            </Link>
            <a href="mailto:support@piol.cm">
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                support@piol.cm
              </Button>
            </a>
          </div>
        </div>
      </PageSection>
    </PublicLayout>
  );
}
