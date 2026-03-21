'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import {
  getAllLeadContactEmailQueueThunk,
  deleteQueueItemThunk,
  processEmailQueueThunk,
} from '@/src/store/thunks';
import { LEAD_DETAIL_PATH } from '@/src/config';
import { setCurrentLeadThunk } from '@/src/store/thunks/leads';
import type { LeadContactEmailQueue } from '@/src/model/lead-contact-email-queue';
import { formatDateTimeWithTime } from '@/src/utils/date-time';

const STATUS_OPTIONS: {
  value: 'all' | LeadContactEmailQueue['status'];
  label: string;
}[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'queued', label: 'Queued' },
  { value: 'sending', label: 'Sending' },
  { value: 'sent', label: 'Sent' },
  { value: 'failed', label: 'Failed' },
];

export const LeadContactEmailQueueList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queueItemsState = useAppSelector((state) => state.leadContactEmailQueue);
  const leadContacts = useAppSelector((state) => state.leadContacts);
  const leads = useAppSelector((state) => state.leads);

  const [filterStatus, setFilterStatus] = useState<
    'all' | LeadContactEmailQueue['status']
  >('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortColumn, setSortColumn] = useState<
    'status' | 'contact' | 'lead' | 'scheduled_at' | 'sent_at' | 'error'
  >('scheduled_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const queueItems = useMemo(
    () => Object.values(queueItemsState),
    [queueItemsState]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getAllLeadContactEmailQueueThunk());
    setIsRefreshing(false);
  };

  const handleProcessQueue = async () => {
    setIsProcessing(true);
    const result = await dispatch(processEmailQueueThunk());
    if (result === 200) {
      await dispatch(getAllLeadContactEmailQueueThunk());
    } else {
      alert(
        'Process next is not available on this server or the request failed.'
      );
    }
    setIsProcessing(false);
  };

  const filteredItems = useMemo(() => {
    let filtered =
      filterStatus === 'all'
        ? queueItems
        : queueItems.filter((item) => item.status === filterStatus);

    filtered = [...filtered].sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortColumn) {
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'contact': {
          const aContact = leadContacts[a.lead_contact_id];
          const bContact = leadContacts[b.lead_contact_id];
          aValue = (
            aContact?.name ||
            aContact?.email ||
            'Unknown Contact'
          ).toLowerCase();
          bValue = (
            bContact?.name ||
            bContact?.email ||
            'Unknown Contact'
          ).toLowerCase();
          break;
        }
        case 'lead': {
          const aLead = leads[a.lead_id];
          const bLead = leads[b.lead_id];
          aValue = (
            aLead?.business_name ||
            aLead?.name ||
            'Unknown Lead'
          ).toLowerCase();
          bValue = (
            bLead?.business_name ||
            bLead?.name ||
            'Unknown Lead'
          ).toLowerCase();
          break;
        }
        case 'scheduled_at':
          aValue = new Date(a.scheduled_at).getTime();
          bValue = new Date(b.scheduled_at).getTime();
          break;
        case 'sent_at':
          aValue = a.sent_at ? new Date(a.sent_at).getTime() : 0;
          bValue = b.sent_at ? new Date(b.sent_at).getTime() : 0;
          break;
        case 'error':
          aValue = (a.error_message || '').toLowerCase();
          bValue = (b.error_message || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    queueItems,
    filterStatus,
    sortColumn,
    sortDirection,
    leadContacts,
    leads,
  ]);

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-100 text-yellow-700';
      case 'sending':
        return 'bg-blue-100 text-blue-700';
      case 'sent':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewLead = (leadId: string) => {
    dispatch(setCurrentLeadThunk(leadId));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleViewContact = (leadId: string, _contactId: string) => {
    dispatch(setCurrentLeadThunk(leadId));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleDelete = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this queue item?')) return;

    const result = await dispatch(deleteQueueItemThunk(itemId));
    if (result !== 200) alert('Failed to delete queue item');
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.filters}>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as typeof filterStatus)
            }
            className={styles.filterSelect}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.rightControls}>
          <span className={styles.count}>
            {filteredItems.length}{' '}
            {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
          <button
            onClick={handleProcessQueue}
            disabled={isProcessing || isRefreshing}
            className={styles.processButton}
            title="Process the next item in the queue (force send, if supported)"
          >
            {isProcessing ? 'Processing...' : 'Process Next in Queue'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isProcessing}
            className={styles.refreshButton}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No queue items found</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('status')}
                >
                  <div className={styles.headerContent}>
                    Status
                    {sortColumn === 'status' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('contact')}
                >
                  <div className={styles.headerContent}>
                    Contact
                    {sortColumn === 'contact' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('lead')}
                >
                  <div className={styles.headerContent}>
                    Lead
                    {sortColumn === 'lead' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('scheduled_at')}
                >
                  <div className={styles.headerContent}>
                    Scheduled At
                    {sortColumn === 'scheduled_at' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('sent_at')}
                >
                  <div className={styles.headerContent}>
                    Sent At
                    {sortColumn === 'sent_at' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
                  onClick={() => handleSort('error')}
                >
                  <div className={styles.headerContent}>
                    Error
                    {sortColumn === 'error' && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const contact = leadContacts[item.lead_contact_id];
                const lead = leads[item.lead_id];

                return (
                  <tr key={item.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <span
                        className={`${styles.statusBadge} ${getStatusColor(item.status)}`}
                      >
                        {String(item.status).toUpperCase()}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {contact ? (
                        <span
                          className={styles.clickableName}
                          onClick={() =>
                            handleViewContact(item.lead_id, item.lead_contact_id)
                          }
                          title={contact.email ?? undefined}
                        >
                          {contact.name ||
                            contact.email ||
                            'Unknown Contact'}
                        </span>
                      ) : (
                        <span className={styles.loadingText}>
                          Loading...
                        </span>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {lead ? (
                        <span
                          className={styles.clickableName}
                          onClick={() => handleViewLead(item.lead_id)}
                          title={lead.business_name || lead.name || undefined}
                        >
                          {lead.business_name ||
                            lead.name ||
                            'Unknown Lead'}
                        </span>
                      ) : (
                        <span className={styles.loadingText}>
                          Loading...
                        </span>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {formatDateTimeWithTime(item.scheduled_at)}
                    </td>
                    <td className={styles.tableCell}>
                      {item.sent_at
                        ? formatDateTimeWithTime(item.sent_at)
                        : 'N/A'}
                    </td>
                    <td className={styles.tableCell}>
                      {item.error_message ? (
                        <span
                          className={styles.errorText}
                          title={item.error_message}
                        >
                          {item.error_message.length > 50
                            ? `${item.error_message.substring(0, 50)}...`
                            : item.error_message}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td
                      className={styles.tableCell}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className={styles.deleteButton}
                        title="Delete queue item"
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
  controls: `
    flex items-center justify-between gap-4
  `,
  filters: `
    flex gap-2 items-center
  `,
  rightControls: `
    flex items-center gap-3
  `,
  count: `
    text-xs text-gray-500
  `,
  processButton: `
    h-7 px-3 text-xs font-medium
    text-white bg-blue-600 border border-blue-600 rounded
    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500
    cursor-pointer
  `,
  refreshButton: `
    h-7 px-3 text-xs font-medium
    text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500
    cursor-pointer
  `,
  filterSelect: `
    h-7 px-2 py-1 text-xs
    border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500
    bg-white
  `,
  emptyState: `
    bg-white border border-gray-300 rounded p-8 text-center
  `,
  emptyText: `
    text-gray-500 text-xs
  `,
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  table: `
    w-full border-collapse text-xs
  `,
  tableHeaderCell: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    whitespace-nowrap
  `,
  sortableHeader: `
    cursor-pointer hover:bg-gray-200 transition-colors
    user-select-none
  `,
  headerContent: `
    flex items-center gap-1
  `,
  sortIndicator: `
    text-gray-500 text-xs
  `,
  tableRow: `
    hover:bg-gray-50 transition-colors
    border-b border-gray-200 last:border-b-0
  `,
  tableCell: `
    px-3 py-2 text-xs text-gray-700
  `,
  statusBadge: `
    text-[10px] font-medium px-1.5 py-0.5 rounded border
    inline-block
  `,
  clickableName: `
    text-blue-600 hover:text-blue-800 hover:underline
    transition-colors text-xs cursor-pointer
  `,
  loadingText: `
    text-gray-400 text-xs italic
  `,
  errorText: `
    text-red-600 text-xs
  `,
  deleteButton: `
    px-2 py-1 text-sm hover:bg-red-50 rounded transition-colors cursor-pointer
    text-red-600
  `,
};
