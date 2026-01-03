'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property-card';
import { LanguageSwitcher } from '@/components/language-switcher';

// Mock data for demo
const mockProperties = [
  {
    _id: 'mock-id-1',
    title: 'Beautiful Apartment in Douala',
    propertyType: '2br' as const,
    rentAmount: 150000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Makepe',
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop' }],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-1',
    landlordName: 'Jean Kamga',
    landlordVerified: true,
  },
  {
    _id: 'mock-id-2',
    title: 'Modern Studio in Yaoundé',
    propertyType: 'studio' as const,
    rentAmount: 85000,
    currency: 'XAF',
    city: 'Yaoundé',
    neighborhood: 'Bastos',
    images: [{ url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop' }],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-2',
    landlordName: 'Marie Foto',
    landlordVerified: true,
  },
  {
    _id: 'mock-id-3',
    title: 'Luxury Villa with Pool',
    propertyType: 'villa' as const,
    rentAmount: 500000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonanjo',
    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop' }],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-3',
    landlordName: 'Paul Mbarga',
    landlordVerified: true,
  },
  {
    _id: 'mock-id-4',
    title: 'Spacious 3-Bedroom Apartment',
    propertyType: '3br' as const,
    rentAmount: 250000,
    currency: 'XAF',
    city: 'Douala',
    neighborhood: 'Bonapriso',
    images: [{ url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop' }],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-4',
    landlordName: 'Alice Ngo',
    landlordVerified: true,
  },
  {
    _id: 'mock-id-5',
    title: 'Family House in Buea',
    propertyType: 'house' as const,
    rentAmount: 180000,
    currency: 'XAF',
    city: 'Buea',
    neighborhood: 'Mile 17',
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop' }],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-5',
    landlordName: 'Peter Tabi',
    landlordVerified: true,
  },
  {
    _id: 'mock-id-6',
    title: 'Student Studio near University',
    propertyType: 'studio' as const,
    rentAmount: 45000,
    currency: 'XAF',
    city: 'Yaoundé',
    neighborhood: 'Ngoa-Ekelle',
    images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop' }],
    status: 'active' as const,
    verificationStatus: 'approved' as const,
    landlordId: 'landlord-6',
    landlordName: 'Sophie Bella',
    landlordVerified: false,
  },
];

export default function HomePage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏠</span>
            <span className="text-2xl font-bold text-[#FF385C]">Piol</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {tNav('properties')}
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {tNav('about')}
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {tNav('contact')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/sign-in">
              <Button variant="ghost" className="font-medium">
                {tNav('signIn')}
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-[#FF385C] hover:bg-[#E31C5F] font-medium">
                {tNav('signUp')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF385C]/5 via-white to-[#00A699]/5" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              {t('heroTitle')}{' '}
              <span className="text-[#FF385C]">{t('heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link href="/properties">
                <Button
                  size="lg"
                  className="bg-[#FF385C] hover:bg-[#E31C5F] text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {t('exploreProperties')}
                </Button>
              </Link>
              <Link href="/sign-up?role=landlord">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-gray-50"
                >
                  {t('iAmLandlord')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-16 mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#FF385C]">1,000+</div>
                <div className="text-gray-500 mt-1">{t('statsProperties')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#FF385C]">5,000+</div>
                <div className="text-gray-500 mt-1">{t('statsUsers')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#FF385C]">98%</div>
                <div className="text-gray-500 mt-1">{t('statsSatisfaction')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            {t('whyChooseUs')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('verifiedProperties')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('verifiedPropertiesDesc')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('mobilePayment')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('mobilePaymentDesc')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('bilingualSupport')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('bilingSupportDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('recentProperties')}
            </h2>
            <Link href="/properties">
              <Button variant="outline" className="rounded-xl">
                {tNav('properties')} →
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#FF385C]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-[#FF385C] hover:bg-gray-100 text-lg px-10 py-6 rounded-xl font-bold"
            >
              {t('createFreeAccount')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl">🏠</span>
                <span className="text-2xl font-bold text-white">Piol</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {tFooter('description')}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">{tFooter('quickLinks')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/properties" className="hover:text-white transition-colors">
                    {tNav('properties')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    {tNav('about')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    {tNav('contact')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">{tFooter('legal')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    {tFooter('privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    {tFooter('terms')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">{tNav('contact')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <span>📧</span> support@piol.cm
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span> +237 6XX XXX XXX
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span> Douala, Cameroun
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            © {new Date().getFullYear()} Piol. {tFooter('copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
