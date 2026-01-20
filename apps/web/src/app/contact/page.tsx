'use client';

import { brandConstants } from '@/components/brand';
import { PageHeader, PageSection, PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <PageSection bordered>
        <PageHeader
          title="Contactez-nous"
          description="Une question? Notre équipe est là pour vous aider."
          centered
        />
      </PageSection>

      <PageSection>
        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact Form */}
          <Card className="md:col-span-3 rounded-xl">
            <CardHeader>
              <CardTitle>Envoyez-nous un message</CardTitle>
              <CardDescription>Nous vous répondrons dans les plus brefs délais.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Message envoyé!</h3>
                  <p className="text-muted-foreground">
                    Merci de nous avoir contacté. Nous vous répondrons bientôt.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" required className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" required className="rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" required className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      className="w-full min-h-[120px] px-3 py-2 border rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="md:col-span-2 space-y-4">
            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground text-sm">{brandConstants.contact.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Nous répondons sous 24h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Téléphone</h3>
                    <p className="text-muted-foreground text-sm">{brandConstants.contact.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">Lun - Ven, 8h - 18h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <p className="text-muted-foreground text-sm">{brandConstants.contact.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">Réponse rapide</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Adresse</h3>
                    <p className="text-muted-foreground text-sm">
                      {brandConstants.contact.address}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Sur rendez-vous uniquement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="rounded-xl bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900">
              <CardContent className="p-5">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Questions fréquentes
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  Consultez notre FAQ pour des réponses rapides.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/50"
                >
                  Voir la FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageSection>
    </PublicLayout>
  );
}
