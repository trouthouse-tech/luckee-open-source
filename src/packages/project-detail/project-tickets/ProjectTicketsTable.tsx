'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { TicketRow } from './TicketRow';

export const ProjectTicketsTable = () => {
  const projectId = useAppSelector((state) => state.currentProjectDetail.projectId);
  const ticketSearchTerm = useAppSelector((state) => state.currentProjectDetail.ticketSearchTerm);
  const ticketStatuses = useAppSelector((state) => state.currentProjectDetail.ticketStatuses);
  const ticketPriorities = useAppSelector((state) => state.currentProjectDetail.ticketPriorities);
  const tickets = useAppSelector((state) => state.tickets);

  const projectTickets = useMemo(() => {
    if (!projectId) return [];
    let list = Object.values(tickets)
      .filter((t) => t.project_id === projectId);

    const term = ticketSearchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.description ?? '').toLowerCase().includes(term)
      );
    }
    if (ticketStatuses.length > 0) {
      list = list.filter((t) => ticketStatuses.includes(t.status));
    }
    if (ticketPriorities.length > 0) {
      list = list.filter((t) => ticketPriorities.includes(t.priority));
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [projectId, tickets, ticketSearchTerm, ticketStatuses, ticketPriorities]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.tableWrapper}>
        {projectTickets.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No tickets for this project.</p>
          </div>
        ) : (
          <div className={styles.tableScrollContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Title</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Priority</th>
                  <th className={styles.th}>Customer</th>
                  <th className={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {projectTickets.map((ticket) => (
                  <TicketRow key={ticket.id} ticket={ticket} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  tabContent: `
    space-y-3
  `,
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
    text-gray-600 text-lg
  `,
  table: `
    w-full border-collapse text-xs
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
  `,
};
