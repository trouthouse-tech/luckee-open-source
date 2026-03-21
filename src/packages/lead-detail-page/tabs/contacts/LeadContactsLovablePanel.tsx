'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Mail, Phone, Pencil } from 'lucide-react';
import { buildLeadContactDetailHref } from '@/src/config/routes';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { getLeadContactsByLeadIdThunk } from '@/src/store/thunks/lead-contacts';
import { CurrentLeadContactActions } from '@/src/store/current';
import type { LeadContact, LeadContactStatus } from '@/src/model/lead-contact';
import { LeadContactEditor } from '@/src/packages/lead-contacts/LeadContactEditor';

const STATUS_STYLES: Record<
  LeadContactStatus,
  { label: string; badge: string }
> = {
  not_contacted: {
    label: 'Not contacted',
    badge: 'bg-gray-100 text-gray-700',
  },
  contacted: {
    label: 'Contacted',
    badge: 'bg-blue-100 text-blue-800',
  },
  responded: {
    label: 'Responded',
    badge: 'bg-green-100 text-green-800',
  },
  not_responded: {
    label: 'No response',
    badge: 'bg-amber-100 text-amber-800',
  },
  won: { label: 'Won', badge: 'bg-green-100 text-green-800' },
  lost: { label: 'Lost', badge: 'bg-red-100 text-red-800' },
};

export const LeadContactsLovablePanel = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isActive = useAppSelector(
    (state) => state.leadBuilder.activeLeadDetailTab === 'Contacts'
  );
  const currentLead = useAppSelector((state) => state.currentLead);
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);

  const leadId = currentLead?.id ?? '';
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const contacts = useMemo(() => {
    return Object.values(leadContactsRecord)
      .filter((c) => c.lead_id === leadId)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
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

  useEffect(() => {
    setHasLoaded(false);
  }, [leadId]);

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

  if (!isActive || !leadId) return null;

  if (isEditing) {
    return (
      <div className={styles.tabShell}>
        <LeadContactEditor
          leadId={leadId}
          onCancel={handleCancel}
          onSaveComplete={handleSaveComplete}
        />
      </div>
    );
  }

  if (isLoading && contacts.length === 0) {
    return (
      <div className={styles.tabShell}>
        <p className={styles.loading}>Loading contacts…</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className={styles.tabShell}>
        <div className={styles.empty}>
          <Users className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No contacts</p>
          <p className={styles.emptyHint}>
            Add contacts to this lead to start outreach.
          </p>
          <button
            type="button"
            onClick={handleCreateNew}
            className={styles.addBtn}
          >
            Add contact
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabShell}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>{contacts.length} contacts</span>
        <button
          type="button"
          onClick={handleCreateNew}
          className={styles.addBtnSmall}
        >
          Add contact
        </button>
      </div>
      <div className={styles.list}>
        {contacts.map((contact) => {
          const cfg = STATUS_STYLES[contact.status];
          return (
            <div key={contact.id} className={styles.card}>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    buildLeadContactDetailHref(leadId, contact.id)
                  )
                }
                className={styles.cardMain}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitles}>
                    <p className={styles.name}>{contact.name}</p>
                    {contact.role && (
                      <p className={styles.role}>{contact.role}</p>
                    )}
                  </div>
                  <span className={`${styles.statusBadge} ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  {contact.email && (
                    <div className={styles.contactInfo}>
                      <Mail className={styles.contactIcon} />
                      <span className={styles.contactValue}>
                        {contact.email}
                      </span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className={styles.contactInfo}>
                      <Phone className={styles.contactIcon} />
                      <span className={styles.contactValue}>
                        {contact.phone}
                      </span>
                    </div>
                  )}
                </div>
                {contact.notes && (
                  <p className={styles.notes}>{contact.notes}</p>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditContact(contact);
                }}
                className={styles.editBtn}
                title="Edit contact"
              >
                <Pencil className={styles.editIcon} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  tabShell: `
    rounded-lg border border-gray-200 bg-white p-6
  `,
  loading: `text-sm text-gray-500 text-center py-8`,
  toolbar: `flex items-center justify-between mb-4`,
  toolbarLabel: `text-sm font-medium text-gray-700`,
  addBtnSmall: `
    px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg
    hover:bg-blue-700 transition-colors border-none cursor-pointer
  `,
  empty: `flex flex-col items-center justify-center py-12 gap-2`,
  emptyIcon: `h-8 w-8 text-gray-300`,
  emptyTitle: `text-base font-medium text-gray-900`,
  emptyHint: `text-sm text-gray-500 text-center max-w-sm`,
  addBtn: `
    mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
    hover:bg-blue-700 transition-colors border-none cursor-pointer
  `,
  list: `grid gap-3`,
  card: `
    relative rounded-lg border border-gray-200 bg-gray-50/50
    hover:border-gray-300 transition-colors
  `,
  cardMain: `
    w-full text-left p-4 pr-12 space-y-3 border-none bg-transparent cursor-pointer
    rounded-lg
  `,
  editBtn: `
    absolute top-3 right-3 p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50
    border border-transparent hover:border-blue-100 bg-white/80 cursor-pointer
  `,
  editIcon: `h-4 w-4`,
  cardHeader: `flex items-start justify-between gap-2`,
  cardTitles: `min-w-0`,
  name: `text-sm font-medium text-gray-900`,
  role: `text-xs text-gray-500`,
  statusBadge: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0`,
  cardBody: `flex flex-wrap gap-4`,
  contactInfo: `flex items-center gap-1.5 text-sm`,
  contactIcon: `h-3.5 w-3.5 text-gray-400 shrink-0`,
  contactValue: `text-gray-900`,
  notes: `text-xs text-gray-500 italic text-left`,
};
