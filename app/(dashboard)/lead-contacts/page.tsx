'use client';

import { LeadContactsListPage } from '@/src/packages/lead-contacts-list';
import { AppLayout } from '@/src/components';

export default function LeadContactsPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Leads', href: '/leads' },
        { label: 'Lead Contacts' },
      ]}
    >
      <LeadContactsListPage />
    </AppLayout>
  );
}
