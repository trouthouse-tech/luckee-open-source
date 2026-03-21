'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { EmailListItem } from './components/EmailListItem';

export const SentEmailsPanel = () => {
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);
  const leadSentEmails = useAppSelector((s) => s.leadSentEmails);
  const leadContactEmails = useAppSelector((s) => s.leadContactEmails);
  const contactId = currentLeadContact.id;

  const emails = useMemo(() => {
    return Object.values(leadContactEmails)
      .filter((e) => e.lead_contact_id === contactId)
      .sort((a, b) => {
        const da =
          typeof a.created_at === 'string'
            ? new Date(a.created_at)
            : a.created_at;
        const db =
          typeof b.created_at === 'string'
            ? new Date(b.created_at)
            : b.created_at;
        return db.getTime() - da.getTime();
      });
  }, [leadContactEmails, contactId]);

  const sentByEmailId = useMemo(() => {
    const m: Record<string, (typeof leadSentEmails)[string]> = {};
    Object.values(leadSentEmails)
      .filter((se) => se.lead_contact_id === contactId)
      .forEach((se) => {
        m[se.lead_email_id] = se;
      });
    return m;
  }, [leadSentEmails, contactId]);

  return (
    <div className={styles.panel}>
      <h3 className={styles.h}>Emails ({emails.length})</h3>
      <div className={styles.list}>
        {emails.length === 0 ? (
          <p className={styles.empty}>No saved emails yet.</p>
        ) : (
          emails.map((email) => (
            <EmailListItem
              key={email.id}
              email={email}
              sentRecord={sentByEmailId[email.id] ?? null}
            />
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  panel: `
    border-l border-gray-100 p-4 overflow-y-auto bg-slate-50/80 min-h-[320px] lg:min-h-0
  `,
  h: `text-sm font-semibold text-gray-800 mb-3`,
  list: ``,
  empty: `text-sm text-gray-500 italic py-4`,
};
