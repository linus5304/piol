'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RequireRole, usePermissions } from '@/hooks/use-permissions';
import { ROLE_COLORS, ROLE_LABELS, type UserRole } from '@/lib/permissions';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  MoreHorizontal,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function UserManagementContent() {
  const router = useRouter();
  const { isAdmin, isLoaded, canManage } = usePermissions();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Redirect non-admins
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push('/dashboard');
    }
  }, [isLoaded, isAdmin, router]);

  // Fetch all users
  const users = useQuery(api.users.listUsers, { limit: 100 });

  // Mutations
  const updateUserRole = useMutation(api.users.updateUserRole);
  const toggleUserStatus = useMutation(api.users.toggleUserStatus);

  const handleRoleChange = useCallback(
    async (userId: Id<'users'>, newRole: UserRole) => {
      try {
        await updateUserRole({ userId, role: newRole });
        toast.success('Rôle mis à jour avec succès');
      } catch (error) {
        toast.error('Erreur lors de la mise à jour du rôle');
      }
    },
    [updateUserRole]
  );

  const handleToggleStatus = useCallback(
    async (userId: Id<'users'>, currentlyActive: boolean) => {
      try {
        await toggleUserStatus({ userId, isActive: !currentlyActive });
        toast.success(currentlyActive ? 'Utilisateur désactivé' : 'Utilisateur activé');
      } catch (error) {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    },
    [toggleUserStatus]
  );

  // Filter users
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (!isLoaded || !isAdmin) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérer les comptes, rôles et permissions des utilisateurs
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="renter">Locataires</SelectItem>
                <SelectItem value="landlord">Propriétaires</SelectItem>
                <SelectItem value="verifier">Vérificateurs</SelectItem>
                <SelectItem value="admin">Administrateurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utilisateurs ({filteredUsers?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users === undefined ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="hidden md:table-cell">Statut</TableHead>
                    <TableHead className="hidden lg:table-cell">Vérifié</TableHead>
                    <TableHead className="hidden md:table-cell">Inscrit le</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.firstName || 'Utilisateur'} {user.lastName || ''}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) =>
                            handleRoleChange(user._id as Id<'users'>, value as UserRole)
                          }
                          disabled={user.role === 'admin'}
                        >
                          <SelectTrigger className="w-32">
                            <Badge
                              variant="secondary"
                              className={ROLE_COLORS[user.role as UserRole] || ''}
                            >
                              {ROLE_LABELS[user.role as UserRole] || user.role}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="renter">Locataire</SelectItem>
                            <SelectItem value="landlord">Propriétaire</SelectItem>
                            <SelectItem value="verifier">Vérificateur</SelectItem>
                            <SelectItem value="admin">Administrateur</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.isActive ? (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                            Inactif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.idVerified ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatDate(user._creationTime)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleStatus(user._id as Id<'users'>, user.isActive)
                              }
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            {!user.idVerified && (
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" />
                                Vérifier identité
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">Aucun utilisateur trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function UsersManagementPage() {
  return (
    <RequireRole
      requiredRole="admin"
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <Link href="/dashboard">
            <Button>Retour au tableau de bord</Button>
          </Link>
        </div>
      }
    >
      <UserManagementContent />
    </RequireRole>
  );
}
