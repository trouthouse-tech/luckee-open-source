'use client';

import { useMemo, useState } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { getDateRangeForFilter, toTimestamp } from '@/src/utils/date-time';
import { LeadSentEmailRow } from './LeadSentEmailRow';
import type { LeadSentEmail } from '@/src/model/lead-sent-email';

type SortColumn = 'sent_at' | 'status' | 'delivery_status';
type SortDirection = 'asc' | 'desc';

export const LeadSentEmailsList = () => {
  const leadSentEmailsRecord = useAppSelector((state) => state.leadSentEmails);
  const dateRangeFilter = useAppSelector(
    (state) => state.leadSentEmailsBuilder.dateRangeFilter
  );
  const statCardFilter = useAppSelector(
    (state) => state.leadSentEmailsBuilder.statCardFilter
  );

  const [sortColumn, setSortColumn] = useState<SortColumn>('sent_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sentEmails = useMemo(() => {
    let filtered = Object.values(leadSentEmailsRecord);

    if (dateRangeFilter) {
      const range = getDateRangeForFilter(dateRangeFilter);
      if (range) {
        filtered = filtered.filter((email) => {
          const sentTime = toTimestamp(email.sent_at);
          return sentTime >= range.start && sentTime <= range.end;
        });
      }
    }

    if (statCardFilter) {
      switch (statCardFilter) {
        case 'bounced':
          filtered = filtered.filter((e) => e.delivery_status === 'bounced');
          break;
        case 'unique_opens': {
          const opened = filtered.filter((e) => e.delivery_status === 'opened');
          const seenContacts = new Set<string>();
          filtered = opened.filter((e) => {
            if (seenContacts.has(e.lead_contact_id)) return false;
            seenContacts.add(e.lead_contact_id);
            return true;
          });
          break;
        }
        case 'total_opens':
          filtered = filtered.filter((e) => e.delivery_status === 'opened');
          break;
        case 'not_opened':
          filtered = filtered.filter((e) => e.delivery_status !== 'opened');
          break;
      }
    }

    return filtered;
  }, [leadSentEmailsRecord, dateRangeFilter, statCardFilter]);

  const sortedEmails = useMemo(() => {
    return [...sentEmails].sort((a, b) => {
      let comparison = 0;
      if (sortColumn === 'sent_at') {
        comparison = toTimestamp(a.sent_at) - toTimestamp(b.sent_at);
      } else if (sortColumn === 'status') {
        const statusA = a.status ?? '';
        const statusB = b.status ?? '';
        comparison = statusA.localeCompare(statusB);
      } else if (sortColumn === 'delivery_status') {
        const deliveryA = a.delivery_status ?? '';
        const deliveryB = b.delivery_status ?? '';
        comparison = deliveryA.localeCompare(deliveryB);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sentEmails, sortColumn, sortDirection]);

  if (sortedEmails.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No sent emails found</p>
        <p className={styles.emptyDescription}>
          Sent emails will appear here once emails are sent to leads.
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
            <th
              className={styles.sortableHeader}
              onClick={() => handleSort('status')}
            >
              <span>Status</span>
              <span className={styles.sortIcon}>
                {sortColumn === 'status'
                  ? sortDirection === 'asc'
                    ? '↑'
                    : '↓'
                  : '↕'}
              </span>
            </th>
            <th
              className={styles.sortableHeader}
              onClick={() => handleSort('delivery_status')}
            >
              <span>Delivery</span>
              <span className={styles.sortIcon}>
                {sortColumn === 'delivery_status'
                  ? sortDirection === 'asc'
                    ? '↑'
                    : '↓'
                  : '↕'}
              </span>
            </th>
            <th className={styles.tableHeader}>Contact</th>
            <th className={styles.tableHeader}>Lead</th>
            <th
              className={styles.sortableHeader}
              onClick={() => handleSort('sent_at')}
            >
              <span>Sent At</span>
              <span className={styles.sortIcon}>
                {sortColumn === 'sent_at'
                  ? sortDirection === 'asc'
                    ? '↑'
                    : '↓'
                  : '↕'}
              </span>
            </th>
            <th className={styles.tableHeader}>From Name</th>
            <th className={styles.tableHeader}>Variation</th>
            <th className={styles.tableHeader}>Campaign</th>
            <th className={styles.tableHeaderCenter}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmails.map((email, index) => (
            <tr key={email.id} className={styles.tableRow}>
              <td className={styles.rowNumberCell}>{index + 1}</td>
              <LeadSentEmailRow
                email={email as LeadSentEmail & { lead_id?: string }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: `
    bg-white rounded border border-gray-300 overflow-x-auto overflow-y-visible
  `,
  table: `
    w-full border-collapse text-sm relative
  `,
  rowNumberHeader: `
    px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 border-b border-gray-300 w-8
  `,
  tableHeader: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 border-b border-gray-300
  `,
  sortableHeader: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 border-b border-gray-300
    cursor-pointer hover:bg-gray-200 transition-colors select-none
  `,
  sortIcon: `
    ml-1 text-gray-400 text-[10px]
  `,
  rowNumberCell: `
    px-2 py-2 text-sm text-gray-500 font-mono
  `,
  tableRow: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0
  `,
  emptyState: `
    bg-white rounded border border-gray-300 p-8 text-center
  `,
  emptyTitle: `
    text-lg font-semibold text-gray-900 mb-2
  `,
  emptyDescription: `
    text-sm text-gray-600
  `,
  tableHeaderCenter: `
    px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 border-b border-gray-300 w-16
  `,
};
