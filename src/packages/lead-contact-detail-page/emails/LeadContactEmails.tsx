'use client';

import { useEffect, useMemo } from 'react';
import { Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { LeadContactEmailBuilderActions } from '@/src/store/builders';
import { CurrentLeadContactEmailActions } from '@/src/store/current';
import { getLeadSentEmailsByContactIdThunk } from '@/src/store/thunks/lead-sent-emails';
import { getLeadContactEmailsByContactIdThunk } from '@/src/store/thunks/lead-contact-emails';
import { LeadContactEmailsTable } from './LeadContactEmailsTable';

export const LeadContactEmails = () => {
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector((s) => s.leadContactBuilder);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);
  const currentLead = useAppSelector((s) => s.currentLead);
  const leadSentEmails = useAppSelector((s) => s.leadSentEmails);

  const isActive = activeTab === 'Emails';

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

  useEffect(() => {
    if (isActive && currentLeadContact.id) {
      void dispatch(getLeadSentEmailsByContactIdThunk(currentLeadContact.id));
      void dispatch(getLeadContactEmailsByContactIdThunk(currentLeadContact.id));
    }
  }, [dispatch, isActive, currentLeadContact.id]);

  const compose = () => {
    dispatch(CurrentLeadContactEmailActions.reset());
    dispatch(
      CurrentLeadContactEmailActions.updateFields({
        lead_id: currentLead?.id ?? '',
        lead_contact_id: currentLeadContact.id,
        subject: '',
      })
    );
    dispatch(LeadContactEmailBuilderActions.openEmailModal());
  };

  if (!isActive) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Sent emails ({sentEmails.length})</h2>
        <button type="button" onClick={compose} className={styles.compose}>
          <Mail className={styles.composeIcon} />
          Compose email
        </button>
      </div>
      {sentEmails.length === 0 ? (
        <div className={styles.empty}>
          <Mail className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No emails sent yet</p>
          <p className={styles.emptyHint}>
            Compose an email to reach this contact.
          </p>
          <button type="button" onClick={compose} className={styles.compose2}>
            Compose email
          </button>
        </div>
      ) : (
        <LeadContactEmailsTable />
      )}
    </div>
  );
};

const styles = {
  container: `
    rounded-xl border border-gray-200 bg-white p-6 shadow-sm
  `,
  header: `
    flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100
  `,
  title: `text-lg font-semibold text-gray-900`,
  compose: `
    inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white
    bg-blue-600 rounded-lg hover:bg-blue-700 border-none cursor-pointer
  `,
  composeIcon: `h-4 w-4`,
  empty: `flex flex-col items-center py-12 text-center`,
  emptyIcon: `h-14 w-14 text-gray-200 mb-3`,
  emptyTitle: `text-base font-medium text-gray-900`,
  emptyHint: `text-sm text-gray-500 mt-1 max-w-sm`,
  compose2: `
    mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg
    hover:bg-blue-100 border border-blue-100 cursor-pointer
  `,
};
