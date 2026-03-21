'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/src/store/hooks';

export type ProjectTabType = 'tickets' | 'time_entries';

type ProjectTabsProps = {
  activeTab: ProjectTabType;
  onTabChange: (tab: ProjectTabType) => void;
  /** Tab-specific action. Renders on the far right. */
  rightContent?: React.ReactNode;
};

/**
 * Tabs for project detail page. Counts from Redux (tickets and time entries with current project id).
 */
export const ProjectTabs = (props: ProjectTabsProps) => {
  const { activeTab, onTabChange, rightContent } = props;
  const currentProjectId = useAppSelector((state) => state.currentProjectDetail.projectId);
  const tickets = useAppSelector((state) => state.tickets);
  const timeEntries = useAppSelector((state) => state.timeEntries);

  const ticketsCount = useMemo(() => {
    if (!currentProjectId) return 0;
    return Object.values(tickets).filter(
      (t) => t.project_id === currentProjectId,
    ).length;
  }, [currentProjectId, tickets]);

  const timeEntriesCount = useMemo(() => {
    if (!currentProjectId) return 0;
    return Object.values(timeEntries).filter(
      (e) => e.project_id === currentProjectId,
    ).length;
  }, [currentProjectId, timeEntries]);

  return (
    <div className={styles.tabsRow}>
      <div className={styles.tabsContainer}>
        <button
          type="button"
          onClick={() => onTabChange('tickets')}
          className={activeTab === 'tickets' ? styles.tabActive : styles.tab}
        >
          Tickets ({ticketsCount})
        </button>
        <button
          type="button"
          onClick={() => onTabChange('time_entries')}
          className={activeTab === 'time_entries' ? styles.tabActive : styles.tab}
        >
          Time Entries ({timeEntriesCount})
        </button>
      </div>
      {rightContent != null ? (
        <div className={styles.rightContent}>{rightContent}</div>
      ) : null}
    </div>
  );
};

const styles = {
  tabsRow: `
    flex items-center justify-between gap-3 border-b border-gray-300 mb-3 min-w-0
  `,
  tabsContainer: `
    flex border-b-2 border-transparent -mb-[2px] overflow-x-auto min-w-0
  `,
  rightContent: `
    flex-shrink-0 pb-2
  `,
  tab: `
    px-4 py-2 text-sm font-medium text-gray-600
    hover:text-gray-900 hover:border-gray-300
    border-b-2 border-transparent transition-colors
    cursor-pointer whitespace-nowrap
  `,
  tabActive: `
    px-4 py-2 text-sm font-medium text-blue-600
    border-b-2 border-blue-600 cursor-pointer whitespace-nowrap
  `,
};
