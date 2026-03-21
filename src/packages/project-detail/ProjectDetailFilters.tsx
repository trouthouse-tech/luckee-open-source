'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { CurrentProjectDetailActions } from '@/src/store/current/currentProjectDetail';
import type { TicketStatus, TicketPriority } from '@/src/model/ticket/Ticket';

const STATUS_OPTIONS: TicketStatus[] = ['todo', 'in_progress', 'done'];
const PRIORITY_OPTIONS: TicketPriority[] = ['low', 'medium', 'high'];

/**
 * Tab-aware filter bar below project tabs. Tickets tab: search + status + priority.
 * Time entries tab: search + date range.
 */
export const ProjectDetailFilters = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.currentProjectDetail.activeTab);
  const ticketSearchTerm = useAppSelector((state) => state.currentProjectDetail.ticketSearchTerm);
  const ticketStatuses = useAppSelector((state) => state.currentProjectDetail.ticketStatuses);
  const ticketPriorities = useAppSelector((state) => state.currentProjectDetail.ticketPriorities);
  const timeEntrySearchTerm = useAppSelector((state) => state.currentProjectDetail.timeEntrySearchTerm);
  const timeEntryStartDate = useAppSelector((state) => state.currentProjectDetail.timeEntryStartDate);
  const timeEntryEndDate = useAppSelector((state) => state.currentProjectDetail.timeEntryEndDate);

  const hasTicketFilters = Boolean(
    ticketSearchTerm || ticketStatuses.length > 0 || ticketPriorities.length > 0
  );
  const hasTimeEntryFilters = Boolean(
    timeEntrySearchTerm || timeEntryStartDate || timeEntryEndDate
  );
  const hasActiveFilters = activeTab === 'tickets' ? hasTicketFilters : hasTimeEntryFilters;

  const handleClearFilters = () => {
    dispatch(CurrentProjectDetailActions.clearProjectDetailFilters());
  };

  if (activeTab === 'tickets') {
    return (
      <div className={styles.filterSection}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            placeholder="Search tickets..."
            value={ticketSearchTerm}
            onChange={(e) => dispatch(CurrentProjectDetailActions.setTicketSearchTerm(e.target.value))}
            className={styles.searchInput}
          />
          {ticketSearchTerm && (
            <button
              type="button"
              onClick={() => dispatch(CurrentProjectDetailActions.setTicketSearchTerm(''))}
              className={styles.clearButton}
            >
              ✕
            </button>
          )}
        </div>
        <div className={styles.chipGroup}>
          <span className={styles.filterLabel}>Status:</span>
          <div className={styles.chips}>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => dispatch(CurrentProjectDetailActions.toggleTicketStatus(status))}
                className={`${styles.chip} ${ticketStatuses.includes(status) ? styles.chipSelected : ''}`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.chipGroup}>
          <span className={styles.filterLabel}>Priority:</span>
          <div className={styles.chips}>
            {PRIORITY_OPTIONS.map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => dispatch(CurrentProjectDetailActions.toggleTicketPriority(priority))}
                className={`${styles.chip} ${ticketPriorities.includes(priority) ? styles.chipSelected : ''}`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>
        {hasActiveFilters && (
          <button type="button" onClick={handleClearFilters} className={styles.clearFiltersButton}>
            Clear filters
          </button>
        )}
      </div>
    );
  }

  if (activeTab === 'time_entries') {
    return (
      <div className={styles.filterSection}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            placeholder="Search time entries..."
            value={timeEntrySearchTerm}
            onChange={(e) => dispatch(CurrentProjectDetailActions.setTimeEntrySearchTerm(e.target.value))}
            className={styles.searchInput}
          />
          {timeEntrySearchTerm && (
            <button
              type="button"
              onClick={() => dispatch(CurrentProjectDetailActions.setTimeEntrySearchTerm(''))}
              className={styles.clearButton}
            >
              ✕
            </button>
          )}
        </div>
        <div className={styles.dateRangeWrapper}>
          <span className={styles.filterLabel}>Date:</span>
          <input
            type="date"
            value={timeEntryStartDate}
            onChange={(e) => dispatch(CurrentProjectDetailActions.setTimeEntryStartDate(e.target.value))}
            className={styles.dateInput}
          />
          <span className={styles.dateSeparator}>to</span>
          <input
            type="date"
            value={timeEntryEndDate}
            onChange={(e) => dispatch(CurrentProjectDetailActions.setTimeEntryEndDate(e.target.value))}
            className={styles.dateInput}
          />
        </div>
        {hasActiveFilters && (
          <button type="button" onClick={handleClearFilters} className={styles.clearFiltersButton}>
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return null;
};

const styles = {
  filterSection: `
    flex flex-wrap gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200
  `,
  searchInputWrapper: `
    relative flex items-center min-w-48
  `,
  searchInput: `
    h-7 pl-2 pr-6 py-1 text-xs border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
    placeholder-gray-400 w-full
  `,
  clearButton: `
    absolute right-1.5 top-1/2 transform -translate-y-1/2
    text-gray-400 hover:text-gray-600 text-xs
  `,
  filterLabel: `
    text-xs text-gray-600 font-medium
  `,
  chipGroup: `
    flex items-center gap-2
  `,
  chips: `
    flex flex-wrap gap-1
  `,
  chip: `
    px-2 py-0.5 text-[10px] rounded border border-gray-300
    text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer
  `,
  chipSelected: `
    bg-blue-100 border-blue-400 text-blue-700
  `,
  dateRangeWrapper: `
    flex items-center gap-1.5
  `,
  dateInput: `
    h-7 px-2 py-1 text-xs border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
  `,
  dateSeparator: `
    text-gray-400 text-xs
  `,
  clearFiltersButton: `
    h-7 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded
    hover:bg-gray-200 transition-colors font-medium ml-auto
  `,
};
