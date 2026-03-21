'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LEAD_DETAIL_PATH } from '@/src/config';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { setCurrentLeadThunk } from '@/src/store/thunks/leads';
import { deleteLeadSentEmailThunk } from '@/src/store/thunks/lead-sent-emails';
import type {
  LeadSentEmail,
  LeadSentEmailDeliveryStatus,
} from '@/src/model/lead-sent-email';
import { formatDateTimeWithTime } from '@/src/utils/date-time';

type LeadSentEmailWithLeadId = LeadSentEmail & { lead_id?: string };

type LeadSentEmailRowProps = {
  email: LeadSentEmailWithLeadId;
};

const STATUS_COLORS: Record<LeadSentEmail['status'], string> = {
  sent: 'bg-green-100 text-green-800 border-green-300',
  responded_won: 'bg-blue-100 text-blue-800 border-blue-300',
  responded_lost: 'bg-red-100 text-red-800 border-red-300',
  not_responded: 'bg-gray-100 text-gray-800 border-gray-300',
};

const DELIVERY_COLORS: Record<LeadSentEmailDeliveryStatus, string> = {
  sent: 'bg-gray-100 text-gray-700 border-gray-300',
  delivered: 'bg-green-100 text-green-800 border-green-300',
  bounced: 'bg-red-100 text-red-800 border-red-300',
  deferred: 'bg-amber-100 text-amber-800 border-amber-300',
  opened: 'bg-blue-100 text-blue-800 border-blue-300',
};

export const LeadSentEmailRow = (props: LeadSentEmailRowProps) => {
  const { email } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const leadContacts = useAppSelector((state) => state.leadContacts);
  const leads = useAppSelector((state) => state.leads);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenLead = (leadId: string) => {
    dispatch(setCurrentLeadThunk(leadId));
    router.push(LEAD_DETAIL_PATH);
  };

  const contact = leadContacts[email.lead_contact_id];
  const lead = contact?.lead_id ? leads[contact.lead_id] : undefined;
  const delivery: LeadSentEmailDeliveryStatus =
    email.delivery_status ?? 'sent';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this sent email?')) return;
    setIsDeleting(true);
    const status = await dispatch(deleteLeadSentEmailThunk(email.id));
    if (status !== 200) {
      alert('Failed to delete sent email. Please try again.');
    }
    setIsDeleting(false);
  };

  const variationDisplay =
    email.variation_id ??
    (email.campaign_email_variation_id ? '—' : null) ??
    '—';
  const campaignDisplay = email.campaign_id ? '—' : 'Custom';

  return (
    <>
      <td className={styles.tableCell}>
        <span
          className={`${styles.statusBadge} ${STATUS_COLORS[email.status]}`}
        >
          {email.status.replace('_', ' ').toUpperCase()}
        </span>
      </td>
      <td className={styles.tableCell}>
        <span
          className={`${styles.statusBadge} ${DELIVERY_COLORS[delivery]}`}
          title={
            delivery === 'opened' && email.opened_count
              ? `Opened ${email.opened_count}×`
              : undefined
          }
        >
          {delivery.toUpperCase()}
          {delivery === 'opened' && email.opened_count
            ? ` (${email.opened_count})`
            : ''}
        </span>
      </td>
      <td className={styles.tableCell}>
        {contact ? (
          email.lead_id ? (
            <button
              type="button"
              onClick={() => handleOpenLead(email.lead_id!)}
              className={styles.clickableName}
              title={contact.email ?? undefined}
            >
              {contact.name || 'Unknown Contact'}
              {contact.email ? ` (${contact.email})` : ''}
            </button>
          ) : (
            <span title={contact.email ?? undefined}>
              {contact.name || 'Unknown Contact'}
              {contact.email ? ` (${contact.email})` : ''}
            </span>
          )
        ) : (
          <span className={styles.loadingText}>Loading...</span>
        )}
      </td>
      <td className={styles.tableCell}>
        {lead ? (
          email.lead_id ? (
            <button
              type="button"
              onClick={() => handleOpenLead(email.lead_id!)}
              className={styles.clickableName}
              title={lead.business_name ?? lead.name ?? undefined}
            >
              {lead.business_name ?? lead.name ?? 'Unknown Lead'}
            </button>
          ) : (
            <span>
              {lead.business_name ?? lead.name ?? 'Unknown Lead'}
            </span>
          )
        ) : email.lead_id ? (
          <span className={styles.loadingText}>Loading...</span>
        ) : (
          <span className={styles.emptyValue}>—</span>
        )}
      </td>
      <td className={styles.tableCell}>
        {formatDateTimeWithTime(email.sent_at)}
      </td>
      <td className={styles.tableCell}>{email.from_name ?? 'N/A'}</td>
      <td className={styles.tableCell}>{String(variationDisplay)}</td>
      <td className={styles.tableCell}>{campaignDisplay}</td>
      <td className={styles.tableCellActions}>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={styles.deleteButton}
          title="Delete sent email"
          type="button"
        >
          {isDeleting ? (
            <svg className={styles.spinnerIcon} viewBox="0 0 24 24">
              <circle
                className={styles.spinnerCircle}
                cx="12"
                cy="12"
                r="10"
              />
            </svg>
          ) : (
            <svg className={styles.deleteIcon} viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </td>
    </>
  );
};

const styles = {
  tableCell: `
    px-3 py-2 text-xs text-gray-700
  `,
  tableCellActions: `
    px-3 py-2 text-xs text-gray-700 text-center
  `,
  statusBadge: `
    text-[10px] font-medium px-1.5 py-0.5 rounded border inline-block
  `,
  clickableName: `
    text-blue-600 hover:text-blue-800 hover:underline transition-colors text-xs cursor-pointer
  `,
  loadingText: `
    text-gray-400 text-xs italic
  `,
  emptyValue: `
    text-gray-400
  `,
  deleteButton: `
    p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600
    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
    inline-flex items-center justify-center
  `,
  deleteIcon: `
    w-4 h-4
  `,
  spinnerIcon: `
    w-4 h-4 animate-spin
  `,
  spinnerCircle: `
    stroke-current opacity-25 fill-none stroke-[3]
  `,
};
