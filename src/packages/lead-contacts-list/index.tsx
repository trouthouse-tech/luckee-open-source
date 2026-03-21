'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LEAD_DETAIL_PATH } from '@/src/config';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { deleteLeadContactThunk } from '@/src/store/thunks/lead-contacts';
import { setCurrentLeadThunk } from '@/src/store/thunks/leads';
import type { LeadContact } from '@/src/model/lead-contact';
import { formatPhoneNumber } from '@/src/utils/string';
import { formatDateTimeShort } from '@/src/utils/date-time';
import { STATUS_CONFIG } from '@/src/utils/lead-contacts';

export const LeadContactsListPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);
  const leads = useAppSelector((state) => state.leads);

  const contacts = useMemo(() => {
    return Object.values(leadContactsRecord).sort((a, b) => {
      const dateA =
        typeof a.created_at === 'string' ? new Date(a.created_at) : a.created_at;
      const dateB =
        typeof b.created_at === 'string' ? new Date(b.created_at) : b.created_at;
      return dateB.getTime() - dateA.getTime();
    });
  }, [leadContactsRecord]);

  const handleViewLead = (leadId: string) => {
    dispatch(setCurrentLeadThunk(leadId));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    await dispatch(deleteLeadContactThunk(contactId));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lead Contacts ({contacts.length})</h1>
      </div>

      {contacts.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No contacts found</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeaderCell}>#</th>
                <th className={styles.tableHeaderCell}>Name</th>
                <th className={styles.tableHeaderCell}>Role</th>
                <th className={styles.tableHeaderCell}>Status</th>
                <th className={styles.tableHeaderCell}>Email</th>
                <th className={styles.tableHeaderCell}>Phone</th>
                <th className={styles.tableHeaderCell}>Lead</th>
                <th className={styles.tableHeaderCell}>Added</th>
                <th className={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact: LeadContact, index: number) => {
                const lead = leads[contact.lead_id];

                return (
                  <tr key={contact.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{index + 1}</td>
                    <td className={styles.tableCell}>
                      <span
                        className={styles.clickableName}
                        onClick={() => handleViewLead(contact.lead_id)}
                      >
                        {contact.name || (
                          <span className={styles.emptyValue}>—</span>
                        )}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {contact.role ? (
                        <span className={styles.roleTag}>{contact.role}</span>
                      ) : (
                        <span className={styles.emptyValue}>—</span>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`${styles.statusBadge} ${STATUS_CONFIG[contact.status ?? 'not_contacted'].color}`}
                      >
                        {
                          STATUS_CONFIG[contact.status ?? 'not_contacted']
                            .label
                        }
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className={styles.emailLink}
                        >
                          {contact.email}
                        </a>
                      ) : (
                        <span className={styles.emptyValue}>—</span>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {contact.phone ? (
                        <a
                          href={`tel:${contact.phone}`}
                          className={styles.phoneLink}
                        >
                          {formatPhoneNumber(contact.phone)}
                        </a>
                      ) : (
                        <span className={styles.emptyValue}>—</span>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {lead ? (
                        <span
                          className={styles.clickableName}
                          onClick={() => handleViewLead(contact.lead_id)}
                          title={lead.business_name ?? lead.name ?? undefined}
                        >
                          {lead.business_name ?? lead.name ?? 'Unknown Lead'}
                        </span>
                      ) : (
                        <span className={styles.loadingText}>Loading...</span>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {formatDateTimeShort(contact.created_at)}
                    </td>
                    <td className={styles.actionsCell}>
                      {contact.notes && (
                        <span className={styles.notesIndicator} title="Has notes">
                          📝
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className={styles.deleteButton}
                        title="Delete contact"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `
    w-full space-y-3
  `,
  header: `
    flex items-center justify-between
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  emptyState: `
    bg-white border border-gray-300 rounded p-8 text-center
  `,
  emptyText: `
    text-gray-500 text-sm
  `,
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  table: `
    w-full border-collapse text-sm
  `,
  tableHeaderCell: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    whitespace-nowrap
  `,
  tableRow: `
    hover:bg-gray-50 transition-colors
    border-b border-gray-200 last:border-b-0
  `,
  tableCell: `
    px-3 py-2 text-sm text-gray-700
  `,
  clickableName: `
    font-medium text-blue-600 hover:text-blue-800 hover:underline
    transition-colors cursor-pointer
  `,
  roleTag: `
    px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded
  `,
  statusBadge: `
    px-2 py-0.5 text-xs font-medium rounded
  `,
  emptyValue: `
    text-gray-400
  `,
  emailLink: `
    text-blue-600 hover:underline
  `,
  phoneLink: `
    text-blue-600 hover:underline
  `,
  loadingText: `
    text-gray-400 text-xs italic
  `,
  actionsCell: `
    px-3 py-2 text-right
  `,
  notesIndicator: `
    mr-1
  `,
  deleteButton: `
    px-2 py-1 text-sm hover:bg-red-50 rounded transition-colors cursor-pointer
    text-red-600
  `,
};
