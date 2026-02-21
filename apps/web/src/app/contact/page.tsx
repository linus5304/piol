'use client';

import { brandConstants } from '@/components/brand';
import { PageHeader, PageSection, PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  type ContactFormInput,
  type ContactFormValues,
  createContactSchema,
} from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'gt-next';
import { CheckCircle, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactPage() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const schema = useMemo(() => createContactSchema(t), [t]);
  const form = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (_data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <PageSection bordered>
        <PageHeader title={t('contact.title')} description={t('contact.subtitle')} centered />
      </PageSection>

      <PageSection>
        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact Form */}
          <Card className="md:col-span-3 rounded-xl">
            <CardHeader>
              <CardTitle>{t('contact.sendMessage')}</CardTitle>
              <CardDescription>{t('contact.weWillRespond')}</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t('contact.messageSent')}</h3>
                  <p className="text-muted-foreground">{t('contact.thankYou')}</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.firstName')}</FormLabel>
                            <FormControl>
                              <Input className="rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.lastName')}</FormLabel>
                            <FormControl>
                              <Input className="rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" className="rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.phone')}</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                                +237
                              </span>
                              <Input
                                type="tel"
                                placeholder="6XX XXX XXX"
                                className="rounded-l-none rounded-r-xl"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.subject')}</FormLabel>
                          <FormControl>
                            <Input className="rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.message')}</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[120px] rounded-xl resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('contact.sending') : t('contact.send')}
                    </Button>
                  </form>
                </Form>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('contact.respondIn24h')}
                    </p>
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
                    <h3 className="font-semibold">Telephone</h3>
                    <p className="text-muted-foreground text-sm">{brandConstants.contact.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('contact.workingHours')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <p className="text-muted-foreground text-sm">{brandConstants.contact.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('contact.quickResponse')}
                    </p>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('contact.byAppointment')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="rounded-xl dusk-info-card">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">{t('contact.faq')}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t('contact.faqDesc')}</p>
                <Link href="/help">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-border text-primary hover:bg-accent"
                  >
                    {t('contact.viewFaq')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageSection>
    </PublicLayout>
  );
}
