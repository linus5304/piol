'use client';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { RequireRole } from '@/hooks/use-permissions';
import { parseAppLocale } from '@/i18n/config';
import { formatDate } from '@/lib/i18n-format';
import { api } from '@repo/convex/_generated/api';
import type { Id } from '@repo/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useTranslations } from 'gt-next';
import { useLocale } from 'gt-next/client';
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import { toast } from 'sonner';

function ApplicationDetailContent({
  applicationId,
}: {
  applicationId: Id<'landlordApplications'>;
}) {
  const locale = parseAppLocale(useLocale());
  const t = useTranslations();
  const application = useQuery(api.landlordApplications.getLandlordApplication, {
    applicationId,
  });
  const cniFrontUrl = useQuery(
    api.files.getFileUrl,
    application?.cniPhotoFront ? { storageId: application.cniPhotoFront } : 'skip'
  );
  const cniBackUrl = useQuery(
    api.files.getFileUrl,
    application?.cniPhotoBack ? { storageId: application.cniPhotoBack } : 'skip'
  );
  const reviewApplication = useMutation(api.landlordApplications.reviewLandlordApplication);

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewImage, setViewImage] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await reviewApplication({
        applicationId,
        decision: 'approved',
      });
      toast.success(t('admin.applicationApproved'));
      setShowApproveDialog(false);
    } catch (error) {
      toast.error('Error approving application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setIsProcessing(true);
    try {
      await reviewApplication({
        applicationId,
        decision: 'rejected',
        rejectionReason,
      });
      toast.success(t('admin.applicationRejected'));
      setShowRejectDialog(false);
    } catch (error) {
      toast.error('Error rejecting application');
    } finally {
      setIsProcessing(false);
    }
  };

  if (application === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Application not found</h2>
        <Link href="/dashboard/admin/applications">
          <Button variant="outline">Back to applications</Button>
        </Link>
      </div>
    );
  }

  const isPending = application.status === 'pending';

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/applications">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.applications')}</h1>
          <p className="text-muted-foreground">
            {application.user?.firstName} {application.user?.lastName}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={
            application.status === 'approved'
              ? 'bg-success/10 text-success'
              : application.status === 'rejected'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-warning/10 text-warning'
          }
        >
          {application.status === 'approved'
            ? 'Approved'
            : application.status === 'rejected'
              ? 'Rejected'
              : 'Pending'}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.applicant')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              {application.user?.profileImageUrl ? (
                <img
                  src={application.user.profileImageUrl}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                  {application.user?.firstName?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="font-medium">
                  {application.user?.firstName} {application.user?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{application.user?.email}</p>
              </div>
            </div>
            {application.user?._creationTime && (
              <p className="text-sm text-muted-foreground">
                Registered:{' '}
                {formatDate(application.user._creationTime, locale, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {t('admin.submittedAt')}:{' '}
              {formatDate(application._creationTime, locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </CardContent>
        </Card>

        {/* Motivation */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.motivation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{application.motivationText}</p>
          </CardContent>
        </Card>
      </div>

      {/* CNI Photos */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.cniPhotos')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('admin.cniFront')}</p>
              {cniFrontUrl ? (
                <button type="button" className="w-full" onClick={() => setViewImage(cniFrontUrl)}>
                  <img
                    src={cniFrontUrl}
                    alt="CNI Front"
                    className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </button>
              ) : (
                <Skeleton className="w-full h-48 rounded-lg" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('admin.cniBack')}</p>
              {cniBackUrl ? (
                <button type="button" className="w-full" onClick={() => setViewImage(cniBackUrl)}>
                  <img
                    src={cniBackUrl}
                    alt="CNI Back"
                    className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </button>
              ) : (
                <Skeleton className="w-full h-48 rounded-lg" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Info (if already reviewed) */}
      {!isPending && application.reviewedAt && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              {application.status === 'approved' ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {application.status === 'approved' ? 'Approved' : 'Rejected'}
                  {application.reviewer &&
                    ` by ${application.reviewer.firstName} ${application.reviewer.lastName}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(application.reviewedAt, locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {application.rejectionReason && (
                  <p className="text-sm mt-2 text-muted-foreground">
                    {application.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {isPending && (
        <div className="flex gap-4">
          <Button
            className="flex-1 bg-success hover:bg-success/90 text-white"
            onClick={() => setShowApproveDialog(true)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {t('admin.approve')}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => setShowRejectDialog(true)}
          >
            <XCircle className="h-4 w-4 mr-2" />
            {t('admin.reject')}
          </Button>
        </div>
      )}

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.confirmApprove')}</AlertDialogTitle>
            <AlertDialogDescription>{t('admin.confirmApproveDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-success hover:bg-success/90"
            >
              {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('admin.approve')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.confirmReject')}</AlertDialogTitle>
            <AlertDialogDescription>{t('admin.confirmRejectDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder={t('admin.rejectReasonPlaceholder')}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('admin.reject')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Full-size image dialog */}
      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('admin.cniPhotos')}</DialogTitle>
          </DialogHeader>
          {viewImage && <img src={viewImage} alt="CNI" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

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
      <ApplicationDetailContent applicationId={id as Id<'landlordApplications'>} />
    </RequireRole>
  );
}
