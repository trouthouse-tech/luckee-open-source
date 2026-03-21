'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { LeadContactBuilderActions } from '@/src/store/builders';
import { loadLeadContactDetailThunk } from '@/src/store/thunks/lead-contacts';
import { DetailPageTabs } from '@/src/components';
import { LEAD_DETAIL_PATH } from '@/src/config/routes';
import { LeadContactHeader, LeadContactNotesSection } from './components';
import { LeadContactEmails } from './emails/LeadContactEmails';
import type { LeadContactTab } from '@/src/store/builders/leadContactBuilder';

const CONTACT_TABS: LeadContactTab[] = ['Notes', 'Emails'];

type Props = {
  leadId: string;
  contactId: string;
};

export const LeadContactDetailPage = (props: Props) => {
  const { leadId, contactId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const activeTab = useAppSelector((s) => s.leadContactBuilder.activeTab);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setNotFound(false);
      const code = await dispatch(loadLeadContactDetailThunk(leadId, contactId));
      setLoading(false);
      if (code === 404) setNotFound(true);
    };
    void run();
  }, [dispatch, leadId, contactId]);

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.muted}>Loading contact…</p>
      </div>
    );
  }

  if (notFound || !currentLeadContact.id) {
    return (
      <div className={styles.page}>
        <p className={styles.muted}>Contact not found.</p>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => router.push(LEAD_DETAIL_PATH)}
        >
          Back to lead
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <LeadContactHeader />
      <DetailPageTabs
        tabs={[...CONTACT_TABS]}
        value={activeTab}
        onPress={(tab) =>
          dispatch(
            LeadContactBuilderActions.setActiveTab(tab as LeadContactTab)
          )
        }
      />
      <div className={styles.tabBody}>
        <LeadContactNotesSection isActive={activeTab === 'Notes'} />
        <LeadContactEmails />
      </div>
    </div>
  );
};

const styles = {
  page: `w-full `,
  muted: `text-center text-gray-500 py-12`,
  linkBtn: `
    mt-2 text-sm text-blue-600 hover:underline block mx-auto border-none bg-transparent cursor-pointer
  `,
  tabBody: `mt-4 space-y-4`,
};
