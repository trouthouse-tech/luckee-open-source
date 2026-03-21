'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { CustomerBuilderActions } from '@/src/store/builders/customerBuilder';
import { ProjectBuilderActions } from '@/src/store/builders/projectBuilder';
import { CurrentProjectActions } from '@/src/store/current/currentProject';

export type CustomerTabType = 'projects';

const DEFAULT_PROJECT_COLOR = '#2563eb';

type CustomerTabsProps = {
  activeTab: CustomerTabType;
  onTabChange: (tab: CustomerTabType) => void;
};

/**
 * Tabs for customer detail page. Projects count comes from Redux (projects with current customer id).
 * Tab-specific action buttons render on the far right, dynamic to the selected tab.
 */
export const CustomerTabs = (props: CustomerTabsProps) => {
  const { activeTab, onTabChange } = props;
  const dispatch = useAppDispatch();
  const currentCustomerId = useAppSelector((state) => state.currentCustomer.customerId);
  const projects = useAppSelector((state) => state.projects);

  const projectsCount = useMemo(() => {
    if (!currentCustomerId) return 0;
    return Object.values(projects).filter(
      (p) => p.customer_id === currentCustomerId,
    ).length;
  }, [currentCustomerId, projects]);

  const handleAddProject = () => {
    if (!currentCustomerId) return;
    dispatch(CustomerBuilderActions.openAddProjectModal());
    dispatch(
      CurrentProjectActions.setCurrentProject({
        name: '',
        color: DEFAULT_PROJECT_COLOR,
        is_active: true,
        customer_id: currentCustomerId,
      }),
    );
    dispatch(ProjectBuilderActions.openCreateModal());
  };

  const rightContent =
    activeTab === 'projects' ? (
      <button
        type="button"
        onClick={handleAddProject}
        className={styles.tabActionButton}
      >
        Add project
      </button>
    ) : undefined;

  return (
    <div className={styles.tabsRow}>
      <div className={styles.tabsContainer}>
        <button
          type="button"
          onClick={() => onTabChange('projects')}
          className={activeTab === 'projects' ? styles.tabActive : styles.tab}
        >
          Projects ({projectsCount})
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
  tabActionButton: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
  `,
};
