'use client';

import { LeadContactEmailModal } from '@/src/packages/lead-contact-email-modal';

export default function DashboardLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <>
      {children}
      <LeadContactEmailModal />
    </>
  );
}
