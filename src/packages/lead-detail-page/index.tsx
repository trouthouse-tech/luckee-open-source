'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { LeadBuilderActions } from '@/src/store/builders';
import { deleteLeadThunk } from '@/src/store/thunks/leads';
import { DetailPageTabs } from '@/src/components';
import { LeadDetailHeader } from './header';
import { LeadDeleteConfirmModal } from './LeadDeleteConfirmModal';
import {
  LEAD_TABS,
  type LeadDetailTab,
  LeadOverviewTabPanel,
  LeadContactsTabPanel,
  LeadNotesTabPanel,
  LeadWebsiteScrapesTabPanel,
} from './tabs';

export const LeadDetailPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lead = useAppSelector((state) => state.currentLead);

  const activeTab = useAppSelector(
    (state) => state.leadBuilder.activeLeadDetailTab
  );
  const setActiveTab = (tab: LeadDetailTab) =>
    dispatch(LeadBuilderActions.setActiveLeadDetailTab(tab));

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteLead = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteLead = async () => {
    if (isDeleting || !lead?.id) return;
    setIsDeleting(true);
    const result = await dispatch(deleteLeadThunk(lead.id));
    if (result === 200) {
      router.push('/leads');
    } else {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      alert('Failed to delete lead. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setIsDeleting(false);
  };

  if (!lead) {
    return (
      <div className={styles.wrap}>
        <p className={styles.empty}>
          Lead not found. It may not be loaded yet or the ID may be invalid.
        </p>
      </div>
    );
  }

  const leadDisplayName =
    lead.business_name || lead.name || 'this lead';

  return (
    <div className={styles.wrap}>
      <LeadDetailHeader onDeleteClick={handleDeleteLead} />

      <DetailPageTabs
        tabs={[...LEAD_TABS]}
        value={activeTab}
        onPress={(tab) => setActiveTab(tab as LeadDetailTab)}
      />

      <LeadOverviewTabPanel />
      <LeadContactsTabPanel />
      <LeadNotesTabPanel />
      <LeadWebsiteScrapesTabPanel />

      <LeadDeleteConfirmModal
        show={showDeleteConfirm}
        leadDisplayName={leadDisplayName}
        onCancel={handleCancelDelete}
        onConfirm={confirmDeleteLead}
        isDeleting={isDeleting}
      />
    </div>
  );
};

const styles = {
  wrap: `w-full`,
  empty: `text-gray-500 py-4`,
};
