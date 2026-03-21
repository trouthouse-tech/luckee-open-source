'use client';

import { LeadDetailPage } from '@/src/packages/lead-detail-page';
import { AppLayout } from '@/src/components';

export default function LeadDetailRoute() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Leads', href: '/leads' },
        { label: 'Lead detail' },
      ]}
    >
      <LeadDetailPage />
    </AppLayout>
  );
}
