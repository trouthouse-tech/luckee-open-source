'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';
import { CurrentTicketActions } from '@/src/store/current/currentTicket';
import { TimeEntryBuilderActions } from '@/src/store/builders/timeEntryBuilder';
import { CurrentTimeEntryActions } from '@/src/store/current/currentTimeEntry';
import { CurrentProjectDetailActions } from '@/src/store/current/currentProjectDetail';
import { CreateTicketModal } from '@/src/packages/tickets';
import { TimeEntryModal } from '@/src/packages/time-tracking/time-entry-modal';
import type { ProjectTabType } from './ProjectTabs';
import { ProjectTabs } from './ProjectTabs';
import { ProjectDetailsCard } from './ProjectDetailsCard';
import { ProjectDetailFilters } from './ProjectDetailFilters';
import { ProjectTickets } from './project-tickets';
import { ProjectTimeEntries } from './project-time-entries';
import { ImportTicketsModal } from './project-tickets/ImportTicketsModal';

/**
 * Project detail view. Reads currentProjectDetail from Redux and displays project info.
 * Tabs: Tickets and Time Entries (from Redux, filtered by current project id).
 */
export const ProjectDetail = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.currentProjectDetail.activeTab);
  const currentProjectId = useAppSelector((state) => state.currentProjectDetail.projectId);
  const projects = useAppSelector((state) => state.projects);
  const ticketBuilder = useAppSelector((state) => state.ticketBuilder);

  const setActiveTab = (tab: ProjectTabType) => {
    dispatch(CurrentProjectDetailActions.setActiveTab(tab));
  };

  const project = useMemo(() => {
    if (!currentProjectId) return null;
    return projects[currentProjectId] ?? null;
  }, [currentProjectId, projects]);

  const handleAddTicket = () => {
    if (!currentProjectId || !project) return;
    dispatch(TicketBuilderActions.setErrorMessage(null));
    dispatch(CurrentTicketActions.reset());
    dispatch(
      CurrentTicketActions.updateTicketField({
        project_id: currentProjectId,
        customer_id: project.customer_id ?? null,
      }),
    );
    dispatch(TicketBuilderActions.openCreateModal());
  };

  const handleAddTimeEntry = () => {
    if (!currentProjectId || !project) return;
    const today = new Date().toISOString().split('T')[0];
    dispatch(TimeEntryBuilderActions.setErrorMessage(null));
    dispatch(
      CurrentTimeEntryActions.setCurrentTimeEntry({
        project_id: currentProjectId,
        customer_id: project.customer_id ?? null,
        date: today,
        time: 0,
        title: '',
        description: '',
      }),
    );
    dispatch(TimeEntryBuilderActions.openCreateModal());
  };

  if (!currentProjectId || !project) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyText}>No project selected</p>
        <Link href="/projects" className={styles.emptyLink}>
          Go to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <ProjectDetailsCard />

      <ProjectTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightContent={
          activeTab === 'tickets' ? (
            <div className={styles.tabButtonsRow}>
              <button
                type="button"
                onClick={() => dispatch(TicketBuilderActions.openImportTicketsModal())}
                className={styles.tabButtonSecondary}
              >
                Import from text
              </button>
              <button
                type="button"
                onClick={handleAddTicket}
                className={styles.tabButton}
              >
                Add ticket
              </button>
            </div>
          ) : activeTab === 'time_entries' ? (
            <button
              type="button"
              onClick={handleAddTimeEntry}
              className={styles.tabButton}
            >
              Add time entry
            </button>
          ) : undefined
        }
      />

      <ProjectDetailFilters />

      <ProjectTickets />
      <ProjectTimeEntries />

      <CreateTicketModal />
      <TimeEntryModal />

      {ticketBuilder.isImportTicketsModalOpen && <ImportTicketsModal />}
    </div>
  );
};

const styles = {
  pageWrapper: `
    w-full max-w-[1400px] mx-auto flex flex-col gap-4
  `,
  tabButtonsRow: `
    flex items-center gap-2
  `,
  tabButton: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
  `,
  tabButtonSecondary: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
  `,
  emptyContainer: `
    flex flex-col items-center justify-center h-full space-y-4
  `,
  emptyText: `
    text-gray-600 text-lg
  `,
  emptyLink: `
    text-sm text-blue-600 hover:text-blue-700 hover:underline
  `,
};
