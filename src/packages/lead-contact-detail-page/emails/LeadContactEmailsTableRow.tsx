'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { LeadContactEmailBuilderActions } from '@/src/store/builders';
import { CurrentLeadContactEmailActions } from '@/src/store/current';
import { formatDateTimeWithTime } from '@/src/utils/date-time';
import type { LeadSentEmail } from '@/src/model/lead-sent-email';
import type { LeadSentEmailDeliveryStatus } from '@/src/model/lead-sent-email';

type Props = { email: LeadSentEmail };

const STATUS_COLORS: Record<LeadSentEmail['status'], string> = {
  sent: 'bg-green-100 text-green-800',
  responded_won: 'bg-blue-100 text-blue-800',
  responded_lost: 'bg-red-100 text-red-800',
  not_responded: 'bg-gray-100 text-gray-800',
};

const DELIVERY_COLORS: Record<LeadSentEmailDeliveryStatus, string> = {
  sent: 'bg-gray-100 text-gray-700',
  delivered: 'bg-green-100 text-green-800',
  bounced: 'bg-red-100 text-red-800',
  deferred: 'bg-amber-100 text-amber-800',
  opened: 'bg-blue-100 text-blue-800',
};

export const LeadContactEmailsTableRow = (props: Props) => {
  const { email } = props;
  const dispatch = useAppDispatch();
  const leadContactEmails = useAppSelector((s) => s.leadContactEmails);

  const emailData = useMemo(
    () =>
      Object.values(leadContactEmails).find(
        (e) =>
          e.lead_contact_id === email.lead_contact_id &&
          e.id === email.lead_email_id
      ),
    [leadContactEmails, email.lead_contact_id, email.lead_email_id]
  );
  const delivery: LeadSentEmailDeliveryStatus =
    email.delivery_status ?? 'sent';

  const openCompose = () => {
    if (!emailData) return;
    dispatch(CurrentLeadContactEmailActions.setEmail(emailData));
    dispatch(LeadContactEmailBuilderActions.openEmailModal());
  };

  return (
    <tr
      className={`${styles.row} ${emailData ? styles.clickable : ''}`}
      onClick={openCompose}
    >
      <td className={styles.cell}>
        <span className={`${styles.badge} ${STATUS_COLORS[email.status]}`}>
          {email.status.replace(/_/g, ' ')}
        </span>
      </td>
      <td className={styles.cell}>
        <span className={`${styles.badge} ${DELIVERY_COLORS[delivery]}`}>
          {delivery}
          {delivery === 'opened' && email.opened_count
            ? ` (${email.opened_count})`
            : ''}
        </span>
      </td>
      <td className={styles.cell}>
        {emailData ? (
          emailData.subject
        ) : (
          <span className={styles.muted}>—</span>
        )}
      </td>
      <td className={styles.cell}>
        {formatDateTimeWithTime(email.sent_at)}
      </td>
      <td className={styles.cell}>{email.from_name || '—'}</td>
      <td className={styles.cell}>
        {email.campaign_id ? (
          <span className={styles.mono}>{email.campaign_id.slice(0, 8)}…</span>
        ) : (
          'Custom'
        )}
      </td>
    </tr>
  );
};

const styles = {
  row: `border-b border-gray-100 hover:bg-gray-50/80`,
  clickable: `cursor-pointer`,
  cell: `px-3 py-3 text-sm text-gray-700`,
  badge: `text-xs font-medium px-2 py-1 rounded-md inline-block`,
  muted: `text-gray-400 italic`,
  mono: `text-xs text-gray-500 font-mono`,
};
