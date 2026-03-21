'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { deleteLeadContactThunk } from '@/src/store/thunks/lead-contacts';
import type { LeadContact } from '@/src/model/lead-contact';
import { formatDateShort } from '@/src/utils/date-time';
import { STATUS_CONFIG } from '@/src/utils/lead-contacts';

type LeadContactsListProps = {
  contacts: LeadContact[];
  isLoading: boolean;
  onEdit: (contact: LeadContact) => void;
};

export const LeadContactsList = ({
  contacts,
  isLoading,
  onEdit,
}: LeadContactsListProps) => {
  const dispatch = useAppDispatch();

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    await dispatch(deleteLeadContactThunk(contactId));
  };

  if (isLoading) {
    return <div className={styles.loadingState}>Loading contacts…</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No contacts yet</p>
        <p className={styles.emptyDescription}>
          Add contacts for this lead to track multiple people at the business.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rowNumberHeader}>#</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Role</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}>Email</th>
            <th className={styles.tableHeader}>Phone</th>
            <th className={styles.tableHeader}>Added</th>
            <th className={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact.id} className={styles.tableRow}>
              <td className={styles.rowNumberCell}>{index + 1}</td>
              <td className={styles.tableCell}>
                {contact.name || <span className={styles.emptyValue}>—</span>}
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
                  {STATUS_CONFIG[contact.status ?? 'not_contacted'].label}
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
                  <a href={`tel:${contact.phone}`} className={styles.phoneLink}>
                    {contact.phone}
                  </a>
                ) : (
                  <span className={styles.emptyValue}>—</span>
                )}
              </td>
              <td className={styles.tableCell}>
                {formatDateShort(contact.created_at)}
              </td>
              <td className={styles.actionsCell}>
                <button
                  type="button"
                  onClick={() => onEdit(contact)}
                  className={styles.actionButton}
                  title="Edit contact"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(contact.id)}
                  className={styles.actionButtonDanger}
                  title="Delete contact"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  loadingState: `text-center py-8 text-sm text-gray-500`,
  emptyState: `text-center py-8 bg-gray-50 rounded`,
  emptyTitle: `font-medium text-gray-700 mb-1 text-sm`,
  emptyDescription: `text-xs text-gray-500`,
  tableContainer: `overflow-x-auto`,
  table: `w-full border-collapse text-sm`,
  rowNumberHeader: `
    px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-8
  `,
  tableHeader: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300
  `,
  tableRow: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0
  `,
  rowNumberCell: `px-2 py-2 text-sm text-gray-500 font-mono`,
  tableCell: `px-3 py-2 text-gray-700`,
  actionsCell: `px-3 py-2 text-right space-x-2`,
  roleTag: `px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded`,
  statusBadge: `px-2 py-0.5 text-xs font-medium rounded`,
  emptyValue: `text-gray-400`,
  emailLink: `text-blue-600 hover:underline`,
  phoneLink: `text-blue-600 hover:underline`,
  actionButton: `
    px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors cursor-pointer border-none
  `,
  actionButtonDanger: `
    px-2 py-1 text-sm hover:bg-red-50 text-red-600 rounded transition-colors cursor-pointer border-none
  `,
};
