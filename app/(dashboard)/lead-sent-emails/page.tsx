'use client';

import { LeadSentEmailsListPage } from '@/src/packages/lead-sent-emails-list';
import { AppLayout } from '@/src/components';

export default function LeadSentEmailsPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Leads', href: '/leads' },
        { label: 'Lead Sent Emails' },
      ]}
    >
      <LeadSentEmailsListPage />
    </AppLayout>
  );
}
