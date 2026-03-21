'use client';

import { useState, useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { selectFilteredTickets } from '@/src/store/selectors';
import { TicketRow } from './row';

type SortDirection = 'asc' | 'desc' | null;
type SortableColumn = 'title' | 'status' | 'priority' | 'created_at';

/**
 * Table component for displaying tickets with client-side sorting and filtering.
 */
export const TicketsTable = () => {
  const tickets = useAppSelector((state) => state.tickets);
  const filteredTickets = useAppSelector(selectFilteredTickets);

  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const ticketsArray = useMemo(() => Object.values(tickets), [tickets]);

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTickets = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredTickets;

    return [...filteredTickets].sort((a, b) => {
      const aValue = a[sortColumn] as unknown;
      const bValue = b[sortColumn] as unknown;

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return 0;
    });
  }, [filteredTickets, sortColumn, sortDirection]);

  const getSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) return '↕️';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕️';
  };

  const columns: { key: SortableColumn; label: string; width?: string }[] = [
    { key: 'title', label: 'Title', width: 'w-64' },
    { key: 'status', label: 'Status', width: 'w-32' },
    { key: 'priority', label: 'Priority', width: 'w-32' },
    { key: 'created_at', label: 'Created', width: 'w-36' },
  ];

  return (
    <div className={styles.tableWrapper}>
      {ticketsArray.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No tickets yet. Create your first ticket.</p>
        </div>
      ) : sortedTickets.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No tickets match your filters.</p>
        </div>
      ) : (
        <div className={styles.tableScrollContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map(({ key, label, width }) => (
                  <th
                    key={key}
                    className={`${styles.th} ${width || ''}`}
                    onClick={() => handleSort(key)}
                  >
                    <div className={styles.headerContent}>
                      <span>{label}</span>
                      <span className={styles.sortIcon}>{getSortIcon(key)}</span>
                    </div>
                  </th>
                ))}
                <th className={`${styles.th} ${styles.actionsColumn}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTickets.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  tableScrollContainer: `
    overflow-x-auto
  `,
  emptyState: `
    text-center py-12
  `,
  emptyText: `
    text-gray-500 text-sm
  `,
  table: `
    w-full border-collapse text-xs
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600 
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    cursor-pointer hover:bg-gray-200 transition-colors
  `,
  actionsColumn: `
    w-24
  `,
  headerContent: `
    flex items-center justify-between
  `,
  sortIcon: `
    ml-1 text-[10px]
  `,
};
