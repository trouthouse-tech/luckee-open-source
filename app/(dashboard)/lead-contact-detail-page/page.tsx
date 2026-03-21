'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { LeadContactDetailPage } from '@/src/packages/lead-contact-detail-page';
import { AppLayout } from '@/src/components';
import { LEAD_DETAIL_PATH } from '@/src/config/routes';

const LeadContactDetailContent = () => {
  const search = useSearchParams();
  const leadId = search.get('leadId') ?? '';
  const contactId = search.get('contactId') ?? '';
  const ok = leadId && contactId;

  if (!ok) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Missing <code className="font-mono">leadId</code> or{' '}
        <code className="font-mono">contactId</code> query params.
      </div>
    );
  }

  return <LeadContactDetailPage leadId={leadId} contactId={contactId} />;
};

export default function LeadContactDetailRoute() {
  const crumbs = useMemo(
    () => [
      { label: 'Leads', href: '/leads' },
      { label: 'Lead', href: LEAD_DETAIL_PATH },
      { label: 'Contact' },
    ],
    []
  );
  return (
    <AppLayout breadcrumbs={crumbs}>
      <Suspense fallback={<p className="text-gray-500 p-8">Loading…</p>}>
        <LeadContactDetailContent />
      </Suspense>
    </AppLayout>
  );
}
