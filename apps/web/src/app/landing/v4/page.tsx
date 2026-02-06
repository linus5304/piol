'use client';

import { Logo } from '@/components/brand';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Eye,
  Home,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Smartphone,
  Star,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

/**
 * V4 - "Cinematic Storytelling" Landing Page
 *
 * Apple-inspired: Scroll-driven narrative, full-width cinematic sections,
 * minimal text, emotional journey through the Piol story.
 */
export default function LandingV4() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="transparent" />

      {/* ================================================================
          CHAPTER 1: THE PROBLEM
          Full-screen, dark, dramatic
          ================================================================ */}
      <section className="relative min-h-screen flex items-center justify-center bg-foreground text-background overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--background) 1px, transparent 1px), linear-gradient(90deg, var(--background) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 container mx-auto max-w-5xl px-4 md:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-background/40 mb-8 font-medium">
            Le problème
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.95] mb-8">
            Chercher un logement
            <br />
            au Cameroun ne devrait
            <br />
            pas être un
            <br />
            <span className="text-primary">combat.</span>
          </h1>

          <p className="text-lg md:text-xl text-background/50 max-w-2xl mx-auto leading-relaxed mb-12">
            Fausses annonces. Millions de FCFA en cash sans garantie. Visites qui ne correspondent
            pas aux photos. Ce cycle s'arrête ici.
          </p>

          <div className="flex items-center justify-center gap-2 text-background/30 animate-bounce">
            <ArrowDown className="h-5 w-5" />
            <span className="text-sm">Découvrez la solution</span>
          </div>
        </div>
      </section>

      {/* ================================================================
          CHAPTER 2: THE SOLUTION - Piol Introduction
          Clean, white, powerful
          ================================================================ */}
      <section className="py-28 md:py-40">
        <div className="container mx-auto max-w-5xl px-4 md:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 mx-auto mb-10 rounded-2xl bg-foreground flex items-center justify-center shadow-xl">
            <Home className="h-10 w-10 text-background" />
          </div>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Voici Piol.</h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            La première plateforme de location au Cameroun qui vérifie chaque annonce, protège
            chaque paiement, et accompagne chaque étape.
          </p>
        </div>
      </section>

      {/* ================================================================
          CHAPTER 3: VERIFIED - Full-width feature
          ================================================================ */}
      <section className="relative py-28 md:py-40 bg-muted/30 border-y overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 font-semibold">
                Vérification terrain
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] mb-6">
                Chaque annonce.
                <br />
                <span className="text-primary">Vérifiée sur place.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Notre équipe de vérificateurs visite chaque propriété avant sa mise en ligne. Photos
                authentiques, informations confirmées, propriétaire identifié. Zéro arnaque, zéro
                mauvaise surprise.
              </p>
              <div className="space-y-4">
                {[
                  'Visite physique par notre équipe',
                  'Photos prises sur place',
                  'Documents du propriétaire vérifiés',
                  'Badge de confiance visible',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=800&fit=crop"
                  alt="Verified property"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating verified card */}
              <div className="absolute -bottom-6 -left-6 p-5 rounded-2xl bg-card border shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-success-foreground" />
                  </div>
                  <div>
                    <div className="font-bold">Propriété vérifiée</div>
                    <div className="text-sm text-muted-foreground">Visitée le 15 jan. 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CHAPTER 4: PAYMENT - Full-width feature (reversed)
          ================================================================ */}
      <section className="py-28 md:py-40 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual first on desktop */}
            <div className="relative order-2 lg:order-1">
              <Card className="rounded-3xl overflow-hidden border-0 shadow-2xl bg-foreground text-background">
                <CardContent className="p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Escrow Piol</span>
                    </div>
                    <Badge className="rounded-full bg-success/20 text-success border-0">
                      Protégé
                    </Badge>
                  </div>

                  {/* Payment flow visualization */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-background/5 border border-background/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                            <Smartphone className="h-5 w-5 text-warning" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">MTN MoMo</div>
                            <div className="text-xs text-background/50">Paiement envoyé</div>
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowDown className="h-5 w-5 text-background/30" />
                    </div>

                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">Fonds en escrow</div>
                            <div className="text-xs text-background/50">Protégés par Piol</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-primary">1,500,000 FCFA</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowDown className="h-5 w-5 text-background/30" />
                    </div>

                    <div className="p-4 rounded-2xl bg-background/5 border border-background/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                            <Home className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">Clés remises</div>
                            <div className="text-xs text-background/50">Fonds libérés</div>
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 font-semibold">
                Paiement sécurisé
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] mb-6">
                Votre argent.
                <br />
                <span className="text-primary">Toujours protégé.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Fini les millions de FCFA en cash sans garantie. Payez par MTN MoMo ou Orange Money.
                Vos fonds restent en escrow jusqu'à la remise des clés. Si ça ne va pas, on vous
                rembourse.
              </p>
              <div className="space-y-4">
                {[
                  'MTN Mobile Money & Orange Money',
                  "Fonds bloqués jusqu'à la remise des clés",
                  'Remboursement garanti en cas de problème',
                  'Commission transparente de 5%',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CHAPTER 5: MESSAGING - Compact feature
          ================================================================ */}
      <section className="py-20 md:py-28 bg-muted/30 border-y">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
            Chaque conversation.
            <br />
            <span className="text-primary">Chaque détail. Sauvegardé.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            Discutez directement avec les propriétaires. Posez vos questions, planifiez les visites,
            négociez les termes. Tout est archivé en cas de litige.
          </p>

          {/* Chat preview */}
          <Card className="max-w-md mx-auto rounded-2xl border-border/50 shadow-xl text-left">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  J
                </div>
                <div>
                  <div className="font-semibold text-sm">Jean-Pierre (Propriétaire)</div>
                  <div className="text-xs text-success flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    En ligne
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%]">
                    <p className="text-sm">
                      Bonjour ! L'appartement à Akwa est-il toujours disponible ?
                    </p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%]">
                    <p className="text-sm">
                      Oui, toujours disponible ! Vous pouvez visiter demain à 10h ?
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%]">
                    <p className="text-sm">Parfait, je serai là !</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================================================================
          CHAPTER 6: STATS ROW - Big numbers
          ================================================================ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1,200+', label: 'Logements vérifiés', icon: Home },
              { value: '5,000+', label: 'Utilisateurs', icon: Users },
              { value: '10+', label: 'Villes couvertes', icon: MapPin },
              { value: '4.8/5', label: 'Note moyenne', icon: Star },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA - Cinematic, full-screen
          ================================================================ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&h=1080&fit=crop&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6">
            Votre prochain
            <br />
            <span className="text-primary">chez-vous</span> vous attend.
          </h2>
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-xl mx-auto">
            Rejoignez des milliers de Camerounais qui ont choisi la confiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-2xl"
              >
                Commencer maintenant
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-12 rounded-2xl text-lg border-white/20 text-white hover:bg-white/10"
              >
                Explorer les annonces
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  );
}
