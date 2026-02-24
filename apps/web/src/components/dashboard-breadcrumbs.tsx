'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useTranslations } from 'gt-next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const segmentLabels: Record<string, string> = {
  dashboard: 'breadcrumbs.dashboard',
  properties: 'breadcrumbs.properties',
  messages: 'breadcrumbs.messages',
  settings: 'breadcrumbs.settings',
  saved: 'breadcrumbs.saved',
  payments: 'breadcrumbs.payments',
  admin: 'breadcrumbs.admin',
  verify: 'breadcrumbs.verify',
  users: 'breadcrumbs.users',
  new: 'breadcrumbs.new',
};

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations();

  // Split the pathname into segments, filter out empty strings
  const segments = pathname.split('/').filter(Boolean);

  // Only show breadcrumbs if we're in the dashboard
  if (segments[0] !== 'dashboard') {
    return null;
  }

  // Build breadcrumb items from path segments
  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const labelKey = segmentLabels[segment];
    const label = labelKey ? t(labelKey) : segment;
    const isLast = index === segments.length - 1;

    return { href, label, isLast, segment };
  });

  return (
    <Breadcrumb data-testid="dashboard-breadcrumbs">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
