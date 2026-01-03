'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  Eye,
  MessageSquare,
  TrendingUp,
  Heart,
  Search,
  Bell,
  Plus,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Home,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-neutral-200 rounded-lg animate-pulse" />
        <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-neutral-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const role = (user?.unsafeMetadata?.role as string) || 'renter';
  const firstName = user?.firstName || 'Utilisateur';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-neutral-500 mt-1">
            {role === 'landlord'
              ? 'Gérez vos propriétés et suivez vos revenus'
              : 'Trouvez votre prochain logement idéal'}
          </p>
        </div>
        {role === 'landlord' && (
          <Link href="/dashboard/properties/new">
            <Button className="bg-primary hover:bg-primary-hover gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle annonce
            </Button>
          </Link>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {role === 'landlord' ? (
          <>
            <Card className="border-neutral-200 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Propriétés actives</p>
                    <p className="text-3xl font-semibold text-neutral-900 mt-1">0</p>
                    <p className="text-xs text-neutral-400 mt-1">Publiées sur Piol</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Vues ce mois</p>
                    <p className="text-3xl font-semibold text-neutral-900 mt-1">0</p>
                    <p className="text-xs text-verified mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +0% vs mois dernier
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Messages non lus</p>
                    <p className="text-3xl font-semibold text-neutral-900 mt-1">0</p>
                    <p className="text-xs text-neutral-400 mt-1">De locataires potentiels</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 hover:shadow-md transition-shadow rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Revenus ce mois</p>
                    <p className="text-3xl font-semibold text-neutral-900 mt-1">0</p>
                    <p className="text-xs text-neutral-400 mt-1">FCFA total perçu</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-neutral-200 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Favoris</p>
                    <p className="text-3xl font-semibold text-neutral-900 mt-1">0</p>
                    <p className="text-xs text-neutral-400 mt-1">Propriétés sauvegardées</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Recherches</p>
                    <p className="text-3xl font-semibold text-neutral-900 mt-1">0</p>
                    <p className="text-xs text-neutral-400 mt-1">Ces 7 derniers jours</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Messages</p>
                    <p className="text-3xl font-semibold text-neutral-900 mt-1">0</p>
                    <p className="text-xs text-neutral-400 mt-1">Conversations actives</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-neutral-200 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Alertes</p>
                    <p className="text-3xl font-semibold text-neutral-900 mt-1">0</p>
                    <p className="text-xs text-neutral-400 mt-1">Notifications actives</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Actions rapides</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {role === 'landlord' ? (
            <>
              <Link href="/dashboard/properties/new" className="group">
                <Card className="border-neutral-200 hover:border-primary/30 hover:shadow-lg transition-all rounded-2xl overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Plus className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 group-hover:text-primary transition-colors">
                          Ajouter une propriété
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          Publiez une nouvelle annonce et touchez des milliers de locataires
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/properties" className="group">
                <Card className="border-neutral-200 hover:border-primary/30 hover:shadow-lg transition-all rounded-2xl overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Building2 className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 group-hover:text-primary transition-colors">
                          Gérer mes propriétés
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          Voir et modifier vos annonces existantes
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/messages" className="group">
                <Card className="border-neutral-200 hover:border-primary/30 hover:shadow-lg transition-all rounded-2xl overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <MessageSquare className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 group-hover:text-primary transition-colors">
                          Messages
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          Répondez aux demandes des locataires
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          ) : (
            <>
              <Link href="/properties" className="group">
                <Card className="border-neutral-200 hover:border-primary/30 hover:shadow-lg transition-all rounded-2xl overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Search className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 group-hover:text-primary transition-colors">
                          Rechercher
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          Explorez des centaines de propriétés vérifiées
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/saved" className="group">
                <Card className="border-neutral-200 hover:border-primary/30 hover:shadow-lg transition-all rounded-2xl overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                        <Heart className="w-6 h-6 text-pink-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 group-hover:text-primary transition-colors">
                          Mes favoris
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          Retrouvez vos propriétés sauvegardées
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/messages" className="group">
                <Card className="border-neutral-200 hover:border-primary/30 hover:shadow-lg transition-all rounded-2xl overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <MessageSquare className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 group-hover:text-primary transition-colors">
                          Messages
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          Contactez les propriétaires directement
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Onboarding Prompt */}
      {!user?.unsafeMetadata?.onboardingCompleted && (
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-blue-50 border-primary/20 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <BadgeCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Complétez votre profil</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Ajoutez vos informations pour une meilleure expérience et accéder à toutes les
                    fonctionnalités
                  </p>
                </div>
              </div>
              <Link href="/dashboard/settings">
                <Button className="bg-primary hover:bg-primary-hover whitespace-nowrap">
                  Compléter mon profil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips for Renters */}
      {role === 'renter' && (
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">💡 Conseils pour votre recherche</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900">Visitez toujours</p>
                  <p className="text-xs text-neutral-500">Avant de payer quoi que ce soit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-verified/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="w-4 h-4 text-verified" />
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900">Privilégiez les vérifiés</p>
                  <p className="text-xs text-neutral-500">Propriétés avec le badge ✓</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900">Planifiez vos visites</p>
                  <p className="text-xs text-neutral-500">Via notre messagerie sécurisée</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
