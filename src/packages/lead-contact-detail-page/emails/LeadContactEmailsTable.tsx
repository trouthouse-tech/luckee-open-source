'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { LeadContactEmailsTableRow } from './LeadContactEmailsTableRow';

export const LeadContactEmailsTable = () => {
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);
  const leadSentEmails = useAppSelector((s) => s.leadSentEmails);

  const sentEmails = useMemo(() => {
    return Object.values(leadSentEmails)
      .filter((e) => e.lead_contact_id === currentLeadContact.id)
      .sort((a, b) => {
        const da =
          typeof a.sent_at === 'string' ? new Date(a.sent_at) : a.sent_at;
        const db =
          typeof b.sent_at === 'string' ? new Date(b.sent_at) : b.sent_at;
        return db.getTime() - da.getTime();
      });
  }, [leadSentEmails, currentLeadContact.id]);

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Delivery</th>
            <th className={styles.th}>Subject</th>
            <th className={styles.th}>Sent</th>
            <th className={styles.th}>From</th>
            <th className={styles.th}>Campaign</th>
          </tr>
        </thead>
        <tbody>
          {sentEmails.map((email) => (
            <LeadContactEmailsTableRow key={email.id} email={email} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  wrap: `overflow-x-auto rounded-lg border border-gray-200`,
  table: `w-full border-collapse`,
  headRow: `border-b border-gray-200 bg-gray-50`,
  th: `
    px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
  `,
};
