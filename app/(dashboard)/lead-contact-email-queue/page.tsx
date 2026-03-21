'use client';

import { LeadContactEmailQueueList } from '@/src/packages/lead-contact-email-queue-list';
import { AppLayout } from '@/src/components';

export default function LeadContactEmailQueuePage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Leads', href: '/leads' },
        { label: 'Email Queue' },
      ]}
    >
      <LeadContactEmailQueueList />
    </AppLayout>
  );
}
