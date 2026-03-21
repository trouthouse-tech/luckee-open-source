'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { getLeadContactsByLeadIdThunk } from '@/src/store/thunks/lead-contacts';
import { CurrentLeadContactActions } from '@/src/store/current';
import type { LeadContact } from '@/src/model/lead-contact';
import { LeadContactsList } from './LeadContactsList';
import { LeadContactEditor } from './LeadContactEditor';

export const LeadContactsSection = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);
  const isActive = useAppSelector(
    (state) => state.leadBuilder.activeLeadDetailTab === 'Contacts'
  );

  const leadId = currentLead?.id ?? '';

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const contacts = useMemo(() => {
    return Object.values(leadContactsRecord)
      .filter((c) => c.lead_id === leadId)
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateA - dateB;
      });
  }, [leadContactsRecord, leadId]);

  useEffect(() => {
    if (!isActive || hasLoaded || !leadId) return;
    const load = async () => {
      setIsLoading(true);
      await dispatch(getLeadContactsByLeadIdThunk(leadId));
      setIsLoading(false);
      setHasLoaded(true);
    };
    load();
  }, [dispatch, leadId, isActive, hasLoaded]);

  const handleCreateNew = () => {
    dispatch(CurrentLeadContactActions.reset());
    dispatch(
      CurrentLeadContactActions.updateCurrentLeadContact({
        lead_id: leadId,
        id: '',
        name: '',
        email: null,
        phone: null,
        role: null,
        notes: null,
        status: 'not_contacted',
        created_at: '',
        updated_at: '',
      })
    );
    setIsEditing(true);
  };

  const handleEditContact = (contact: LeadContact) => {
    dispatch(CurrentLeadContactActions.setLeadContact(contact));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    dispatch(CurrentLeadContactActions.reset());
  };

  const handleSaveComplete = () => {
    setIsEditing(false);
  };

  if (!isActive) return null;

  return (
    <div className={styles.section}>
      {isEditing ? (
        <LeadContactEditor
          leadId={leadId}
          onCancel={handleCancel}
          onSaveComplete={handleSaveComplete}
        />
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>Contacts ({contacts.length})</h2>
            <button
              type="button"
              onClick={handleCreateNew}
              className={styles.addButton}
            >
              + New Contact
            </button>
          </div>
          <LeadContactsList
            contacts={contacts}
            isLoading={isLoading}
            onEdit={handleEditContact}
          />
        </>
      )}
    </div>
  );
};

const styles = {
  section: `bg-white border border-gray-300 rounded p-4`,
  header: `flex items-center justify-between mb-4`,
  title: `text-base font-semibold text-gray-900`,
  addButton: `
    px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 transition-colors cursor-pointer border-none
  `,
};
