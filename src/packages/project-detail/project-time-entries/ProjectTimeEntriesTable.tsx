'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { TimeEntryRow } from './TimeEntryRow';

export const ProjectTimeEntriesTable = () => {
  const projectId = useAppSelector((state) => state.currentProjectDetail.projectId);
  const timeEntrySearchTerm = useAppSelector((state) => state.currentProjectDetail.timeEntrySearchTerm);
  const timeEntryStartDate = useAppSelector((state) => state.currentProjectDetail.timeEntryStartDate);
  const timeEntryEndDate = useAppSelector((state) => state.currentProjectDetail.timeEntryEndDate);
  const timeEntries = useAppSelector((state) => state.timeEntries);

  const projectTimeEntries = useMemo(() => {
    if (!projectId) return [];
    let list = Object.values(timeEntries).filter((e) => e.project_id === projectId);

    const term = timeEntrySearchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (e) =>
          (e.title ?? '').toLowerCase().includes(term) ||
          (e.description ?? '').toLowerCase().includes(term)
      );
    }
    if (timeEntryStartDate) {
      list = list.filter((e) => e.date >= timeEntryStartDate);
    }
    if (timeEntryEndDate) {
      list = list.filter((e) => e.date <= timeEntryEndDate);
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [projectId, timeEntries, timeEntrySearchTerm, timeEntryStartDate, timeEntryEndDate]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.tableWrapper}>
        {projectTimeEntries.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No time entries for this project.</p>
          </div>
        ) : (
          <div className={styles.tableScrollContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Time</th>
                  <th className={styles.th}>Title</th>
                  <th className={styles.th}>Customer</th>
                  <th className={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {projectTimeEntries.map((entry) => (
                  <TimeEntryRow key={entry.id} entry={entry} />
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
