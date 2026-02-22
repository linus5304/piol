'use client';

import { EditUserDialog } from '@/components/admin/edit-user-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { PaginationFooter } from '@/components/ui/pagination-footer';
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
import { parseAppLocale } from '@/i18n/config';
import { formatDate } from '@/lib/i18n-format';
import { ROLE_COLORS, ROLE_LABELS, type UserRole } from '@/lib/permissions';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { useLocale } from 'gt-next/client';
import {
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Pencil,
  Search,
  ShieldCheck,
  ShieldX,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

function formatUserDate(timestamp: number, locale: string): string {
  return formatDate(timestamp, locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function UserManagementContent() {
  const locale = parseAppLocale(useLocale());
  const router = useRouter();
  const { isAdmin, isLoaded, canManage } = usePermissions();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Confirmation dialog state
  const [pendingStatusToggle, setPendingStatusToggle] = useState<{
    userId: Id<'users'>;
    currentlyActive: boolean;
    userName: string;
  } | null>(null);
  const [editingUser, setEditingUser] = useState<{
    _id: Id<'users'>;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email: string;
    role: string;
  } | null>(null);
  const [pendingVerification, setPendingVerification] = useState<{
    userId: Id<'users'>;
    currentlyVerified: boolean;
    userName: string;
  } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    userId: Id<'users'>;
    userName: string;
  } | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push('/dashboard');
    }
  }, [isLoaded, isAdmin, router]);

  // Fetch users with server-side role filter and pagination
  const roleArg =
    roleFilter !== 'all'
      ? { role: roleFilter as 'renter' | 'landlord' | 'admin' | 'verifier' }
      : {};
  const {
    results: users,
    status: paginationStatus,
    loadMore,
  } = usePaginatedQuery(api.users.listUsers, roleArg, { initialNumItems: 25 });

  const adminStats = useQuery(api.users.getAdminStats);

  // Mutations
  const toggleUserStatus = useMutation(api.users.toggleUserStatus);
  const verifyUserId = useMutation(api.users.verifyUserId);

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

  const handleVerifyUser = useCallback(
    async (userId: Id<'users'>, currentlyVerified: boolean) => {
      try {
        await verifyUserId({ userId, verified: !currentlyVerified });
        toast.success(currentlyVerified ? 'Vérification retirée' : 'Utilisateur vérifié');
      } catch (error) {
        toast.error('Erreur lors de la mise à jour de la vérification');
      }
    },
    [verifyUserId]
  );

  const handleDeleteUser = useCallback(
    async (userId: Id<'users'>) => {
      try {
        await toggleUserStatus({ userId, isActive: false });
        toast.success('Utilisateur supprimé (désactivé)');
      } catch (error) {
        toast.error("Erreur lors de la suppression de l'utilisateur");
      }
    },
    [toggleUserStatus]
  );

  // Filter users (role filter is server-side, search is client-side)
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
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
      <PageHeader
        backHref="/dashboard/admin"
        title="Gestion des utilisateurs"
        subtitle="Gérer les comptes, rôles et permissions des utilisateurs"
      />

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
            Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginationStatus === 'LoadingFirstPage' ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
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
                        <Badge
                          variant="secondary"
                          className={ROLE_COLORS[user.role as UserRole] || ''}
                        >
                          {ROLE_LABELS[user.role as UserRole] || user.role}
                        </Badge>
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
                        {formatUserDate(user._creationTime, locale)}
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
                                setEditingUser({
                                  _id: user._id as Id<'users'>,
                                  firstName: user.firstName,
                                  lastName: user.lastName,
                                  phone: user.phone,
                                  email: user.email,
                                  role: user.role,
                                })
                              }
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Modifier le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setPendingVerification({
                                  userId: user._id as Id<'users'>,
                                  currentlyVerified: user.idVerified,
                                  userName: user.firstName || user.email,
                                })
                              }
                            >
                              {user.idVerified ? (
                                <>
                                  <ShieldX className="h-4 w-4 mr-2" />
                                  Retirer vérification
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Vérifier identité
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setPendingStatusToggle({
                                  userId: user._id as Id<'users'>,
                                  currentlyActive: user.isActive,
                                  userName: user.firstName || user.email,
                                })
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                setPendingDelete({
                                  userId: user._id as Id<'users'>,
                                  userName: user.firstName || user.email,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
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
          <PaginationFooter
            status={paginationStatus}
            loadedCount={filteredUsers.length}
            totalCount={adminStats?.totalUsers}
            onLoadMore={() => loadMore(25)}
            itemLabel="utilisateurs"
          />
        </CardContent>
      </Card>

      {/* Status Toggle Confirmation Dialog */}
      <AlertDialog
        open={!!pendingStatusToggle}
        onOpenChange={(open) => !open && setPendingStatusToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatusToggle?.currentlyActive
                ? "Désactiver l'utilisateur"
                : "Activer l'utilisateur"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatusToggle?.currentlyActive
                ? `Voulez-vous désactiver le compte de ${pendingStatusToggle?.userName} ? L'utilisateur ne pourra plus se connecter.`
                : `Voulez-vous réactiver le compte de ${pendingStatusToggle?.userName} ?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className={
                pendingStatusToggle?.currentlyActive
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : ''
              }
              onClick={() => {
                if (pendingStatusToggle) {
                  handleToggleStatus(
                    pendingStatusToggle.userId,
                    pendingStatusToggle.currentlyActive
                  );
                  setPendingStatusToggle(null);
                }
              }}
            >
              {pendingStatusToggle?.currentlyActive ? 'Désactiver' : 'Activer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Verification Confirmation Dialog */}
      <AlertDialog
        open={!!pendingVerification}
        onOpenChange={(open) => !open && setPendingVerification(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingVerification?.currentlyVerified
                ? 'Retirer la vérification'
                : "Vérifier l'identité"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingVerification?.currentlyVerified
                ? `Voulez-vous retirer la vérification d'identité de ${pendingVerification?.userName} ?`
                : `Voulez-vous vérifier l'identité de ${pendingVerification?.userName} ? Cela ajoutera un badge de confiance à son profil.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingVerification) {
                  handleVerifyUser(
                    pendingVerification.userId,
                    pendingVerification.currentlyVerified
                  );
                  setPendingVerification(null);
                }
              }}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous supprimer le compte de {pendingDelete?.userName} ? Le compte sera
              désactivé et l'utilisateur ne pourra plus se connecter. Cette action peut être annulée
              en réactivant le compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pendingDelete) {
                  handleDeleteUser(pendingDelete.userId);
                  setPendingDelete(null);
                }
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
        />
      )}
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
