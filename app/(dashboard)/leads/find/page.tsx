'use client';

import Link from 'next/link';
import { AppLayout } from '@/src/components';
import { FindLeads } from '@/src/packages/find-leads';

export default function FindLeadsPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Leads', href: '/leads' },
        { label: 'Find Leads' },
      ]}
    >
      <div className={styles.top}>
        <Link href="/leads" className={styles.back}>
          ← Leads
        </Link>
      </div>
      <h1 className={styles.title}>Find leads</h1>
      <FindLeads />
    </AppLayout>
  );
}

const styles = {
  top: `mb-2`,
  back: `text-sm text-blue-600 hover:text-blue-800 hover:underline`,
  title: `text-xl font-bold text-gray-900 mb-4`,
};
