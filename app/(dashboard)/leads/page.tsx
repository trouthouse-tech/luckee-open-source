'use client';

import { Leads } from '@/src/packages/leads';
import { AppLayout } from '@/src/components';

export default function LeadsPage() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Leads' }]}>
      <Leads />
    </AppLayout>
  );
}
