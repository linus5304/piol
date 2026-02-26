'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RequireRole } from '@/hooks/use-permissions';
import { parseAppLocale } from '@/i18n/config';
import { formatDate } from '@/lib/i18n-format';
import { api } from '@repo/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import { AlertCircle, FileCheck } from 'lucide-react';
import Link from 'next/link';

function ApplicationsListContent() {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations();
  const applications = useQuery(api.landlordApplications.getPendingApplications);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <PageHeader title={t('admin.applications')} subtitle={t('admin.applicationsDesc')} />

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            {t('admin.pendingApplications')} ({applications?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications === undefined ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : applications.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t('admin.applicant')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('admin.motivation')}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t('admin.submittedAt')}</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {app.user?.firstName?.charAt(0) ||
                              app.user?.email.charAt(0).toUpperCase() ||
                              '?'}
                          </div>
                          <div>
                            <p className="font-medium">
                              {app.user?.firstName || ''} {app.user?.lastName || ''}
                            </p>
                            <p className="text-sm text-muted-foreground">{app.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {app.motivationText}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {formatDate(app._creationTime, locale, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/admin/applications/${app._id}`}>
                          <Button variant="outline" size="sm">
                            {t('admin.viewApplication')}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">{t('admin.noApplications')}</h3>
              <p>{t('admin.noApplicationsDesc')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ApplicationsPage() {
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
      <ApplicationsListContent />
    </RequireRole>
  );
}
