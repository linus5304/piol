'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {role === 'landlord'
            ? 'Gérez vos propriétés et suivez vos revenus'
            : 'Trouvez votre prochain logement idéal'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {role === 'landlord' ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Propriétés actives</CardDescription>
                <CardTitle className="text-3xl">0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">Publiées sur Piol</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Vues ce mois</CardDescription>
                <CardTitle className="text-3xl">0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">+0% vs mois dernier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Messages non lus</CardDescription>
                <CardTitle className="text-3xl">0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">De locataires potentiels</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Revenus ce mois</CardDescription>
                <CardTitle className="text-3xl">0 FCFA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">Total perçu</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Propriétés sauvegardées</CardDescription>
                <CardTitle className="text-3xl">0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">Dans vos favoris</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Recherches récentes</CardDescription>
                <CardTitle className="text-3xl">0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">Ces 7 derniers jours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Messages</CardDescription>
                <CardTitle className="text-3xl">0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">Conversations actives</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Alertes actives</CardDescription>
                <CardTitle className="text-3xl">0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">Notifications de recherche</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {role === 'landlord' ? (
            <>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href="/dashboard/properties/new">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">➕</span>
                      <div>
                        <CardTitle className="text-base">Ajouter une propriété</CardTitle>
                        <CardDescription>Publiez une nouvelle annonce</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href="/dashboard/properties">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏘️</span>
                      <div>
                        <CardTitle className="text-base">Gérer mes propriétés</CardTitle>
                        <CardDescription>Voir et modifier vos annonces</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href="/dashboard/messages">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <CardTitle className="text-base">Messages</CardTitle>
                        <CardDescription>Répondez aux demandes</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            </>
          ) : (
            <>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href="/properties">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔍</span>
                      <div>
                        <CardTitle className="text-base">Rechercher</CardTitle>
                        <CardDescription>Trouvez votre prochain logement</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href="/dashboard/saved">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">❤️</span>
                      <div>
                        <CardTitle className="text-base">Favoris</CardTitle>
                        <CardDescription>Vos propriétés sauvegardées</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href="/dashboard/messages">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <CardTitle className="text-base">Messages</CardTitle>
                        <CardDescription>Contactez les propriétaires</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Onboarding Prompt */}
      {!user?.unsafeMetadata?.onboardingCompleted && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Complétez votre profil</CardTitle>
            <CardDescription className="text-blue-700">
              Ajoutez vos informations pour une meilleure expérience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Compléter mon profil
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

