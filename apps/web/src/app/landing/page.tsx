'use client';

import { PublicLayout } from '@/components/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Eye, Layout, Palette, Sparkles, Type } from 'lucide-react';
import Link from 'next/link';

const designs = [
  {
    id: 'v1',
    title: 'Immersive Hero',
    subtitle: 'Full-bleed imagery with floating search',
    inspiration: 'Airbnb-inspired',
    icon: Sparkles,
    description:
      'Warm, inviting design centered on a stunning full-screen hero image. The search experience is front and center with a floating glass-morphism search bar. Property cards hover below with parallax scroll hints. Designed to make users feel at home immediately.',
    tags: ['Full-screen hero', 'Floating search', 'Warm tones', 'Image-forward'],
  },
  {
    id: 'v2',
    title: 'Bold Editorial',
    subtitle: 'Giant typography with asymmetric layout',
    inspiration: 'Stripe-inspired',
    icon: Type,
    description:
      'Typography-driven design with oversized headings and an asymmetric grid that creates visual tension. Strong editorial hierarchy guides the eye through content. Animated gradient accents add energy. Confident and sophisticated.',
    tags: ['Giant type', 'Asymmetric grid', 'Gradient accents', 'Editorial'],
  },
  {
    id: 'v3',
    title: 'Social Proof First',
    subtitle: 'Trust signals and numbers upfront',
    inspiration: 'Booking.com-inspired',
    icon: Eye,
    description:
      'Leads with trust: real numbers, testimonial quotes, and verification badges dominate above the fold. Urgency elements and social proof create confidence. A data-rich experience for users who need reassurance before committing.',
    tags: ['Trust-heavy', 'Testimonials', 'Data-driven', 'Urgency'],
  },
  {
    id: 'v4',
    title: 'Cinematic Storytelling',
    subtitle: 'Scroll-driven narrative experience',
    inspiration: 'Apple-inspired',
    icon: Layout,
    description:
      'Each scroll reveals a chapter of the Piol story. Full-width cinematic sections with minimal text create an emotional journey. From problem to solution, the page builds a narrative that resonates with the Cameroon housing struggle.',
    tags: ['Scroll narrative', 'Cinematic', 'Full-width', 'Emotional'],
  },
  {
    id: 'v5',
    title: 'Bento Grid Modern',
    subtitle: 'Modular grid with glassmorphism',
    inspiration: 'Linear-inspired',
    icon: Palette,
    description:
      'A modern SaaS aesthetic with a bento-box grid layout. Features are showcased in glass-morphism cards of varying sizes. Tech-forward and clean with subtle animations. Appeals to digitally native users.',
    tags: ['Bento grid', 'Glassmorphism', 'Modern SaaS', 'Animated'],
  },
];

export default function LandingIndex() {
  return (
    <PublicLayout>
      <div className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5">
              Design Review
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Landing Page <span className="text-primary">Designs</span>
            </h1>
            <p className="text-lead max-w-2xl">
              5 distinct creative directions for the Piol homepage. Each design targets a different
              emotional response while maintaining the core brand identity.
            </p>
          </div>

          {/* Design Cards */}
          <div className="grid gap-6">
            {designs.map((design, index) => {
              const Icon = design.icon;
              return (
                <Link key={design.id} href={`/landing/${design.id}`} className="group block">
                  <Card className="card-hover rounded-2xl border-border/50 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Left - Number & Icon */}
                        <div className="flex-shrink-0 w-full md:w-48 bg-muted/30 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border/50">
                          <div className="text-6xl font-bold text-primary/20 mb-2">{`0${index + 1}`}</div>
                          <Icon className="h-8 w-8 text-primary" />
                        </div>

                        {/* Right - Content */}
                        <div className="flex-1 p-8">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                                  {design.title}
                                </h2>
                                <Badge variant="outline" className="rounded-full text-xs">
                                  {design.inspiration}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground font-medium">{design.subtitle}</p>
                            </div>
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                            {design.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {design.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="rounded-full text-xs font-normal"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
