import { PageHeader, PageSection, PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const helpTopics = [
    {
      title: 'Recherche de logement',
      description: 'Comment trouver et filtrer les propriétés qui correspondent à vos besoins.',
      href: '/properties',
    },
    {
      title: 'Contacter un propriétaire',
      description: 'Comment envoyer des messages et organiser des visites.',
      href: '/contact',
    },
    {
      title: 'Paiements Mobile Money',
      description: 'Comment payer en toute sécurité via MTN MoMo ou Orange Money.',
      href: '/contact',
    },
    {
      title: 'Publier une annonce',
      description: 'Guide pour les propriétaires souhaitant publier leurs biens.',
      href: '/sign-up?role=landlord',
    },
  ];

  return (
    <PublicLayout>
      <PageSection>
        <PageHeader
          title="Centre d'aide"
          description="Trouvez des réponses à vos questions et obtenez l'assistance dont vous avez besoin."
          centered
        />

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
                    En savoir plus
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Besoin d'aide supplémentaire?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Nous contacter
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
