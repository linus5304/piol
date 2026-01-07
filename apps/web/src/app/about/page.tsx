import { PageHeader, PageSection, PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <PageSection bordered className="py-16 md:py-20">
        <PageHeader
          title="À propos de Piol"
          description="Nous révolutionnons le marché locatif au Cameroun en rendant la location simple, transparente et digne de confiance."
          centered
        />
      </PageSection>

      {/* Mission */}
      <PageSection bordered>
        <h2 className="text-2xl font-bold mb-6">Notre Mission</h2>
        <p className="text-muted-foreground text-lg mb-6 max-w-3xl">
          Le marché locatif camerounais souffre de nombreux problèmes : annonces frauduleuses, frais
          cachés, manque de transparence et difficultés de paiement. Nous avons créé Piol pour
          résoudre ces problèmes et offrir une expérience de location moderne et sécurisée.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="w-14 h-14 bg-[#FF385C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-[#FF385C]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Propriétés Vérifiées</h3>
            <p className="text-muted-foreground">
              Chaque propriété est visitée et vérifiée par notre équipe avant publication.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-[#FF385C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-[#FF385C]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Paiements Sécurisés</h3>
            <p className="text-muted-foreground">
              Payez en toute sécurité via MTN MoMo ou Orange Money avec notre système d'escrow.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-[#FF385C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-[#FF385C]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Support Bilingue</h3>
            <p className="text-muted-foreground">
              Notre équipe parle français et anglais pour vous accompagner.
            </p>
          </div>
        </div>
      </PageSection>

      {/* Story */}
      <PageSection bg="muted" bordered>
        <h2 className="text-2xl font-bold mb-6">Notre Histoire</h2>
        <div className="max-w-3xl">
          <p className="text-muted-foreground text-lg mb-4">
            Fondée en 2024, Piol est née de la frustration de chercher un logement au Cameroun.
            Après avoir perdu de l'argent sur des annonces frauduleuses et passé des semaines à
            visiter des propriétés qui ne correspondaient pas aux descriptions, nous avons décidé de
            créer la solution que nous aurions aimé avoir.
          </p>
          <p className="text-muted-foreground text-lg">
            Aujourd'hui, Piol connecte des milliers de locataires avec des propriétaires vérifiés à
            travers Douala, Yaoundé et d'autres villes du Cameroun.
          </p>
        </div>
      </PageSection>

      {/* Stats */}
      <PageSection bordered>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#FF385C]">1,000+</div>
            <div className="text-muted-foreground mt-1">Propriétés</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#FF385C]">5,000+</div>
            <div className="text-muted-foreground mt-1">Utilisateurs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#FF385C]">8</div>
            <div className="text-muted-foreground mt-1">Villes</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#FF385C]">98%</div>
            <div className="text-muted-foreground mt-1">Satisfaction</div>
          </div>
        </div>
      </PageSection>

      {/* CTA */}
      <PageSection bg="brand">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Rejoignez la communauté Piol</h2>
          <p className="text-white/80 mb-8">
            Que vous soyez locataire ou propriétaire, nous avons une solution pour vous.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/properties">
              <Button variant="secondary" size="lg" className="rounded-xl">
                Explorer les propriétés
              </Button>
            </Link>
            <Link href="/sign-up?role=landlord">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Je suis propriétaire
              </Button>
            </Link>
          </div>
        </div>
      </PageSection>
    </PublicLayout>
  );
}
