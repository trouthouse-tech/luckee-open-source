'use client';

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { LeadSentEmailsBuilderActions } from '@/src/store/builders';
import { getAllLeadSentEmailsThunk } from '@/src/store/thunks/lead-sent-emails';
import type { DateRangeFilter } from '@/src/utils/date-time';
import type { StatCardFilter } from '@/src/store/builders/leadSentEmailsBuilder';

const formatFilterLabel = (filter: StatCardFilter): string => {
  switch (filter) {
    case 'bounced':
      return 'Bounced';
    case 'unique_opens':
      return 'Unique Opens';
    case 'total_opens':
      return 'Total Opens';
    case 'not_opened':
      return 'Not Opened';
    default:
      return '';
  }
};

export const LeadSentEmailsFilters = () => {
  const dispatch = useAppDispatch();
  const dateRangeFilter = useAppSelector(
    (state) => state.leadSentEmailsBuilder.dateRangeFilter
  );
  const statCardFilter = useAppSelector(
    (state) => state.leadSentEmailsBuilder.statCardFilter
  );

  const handleDateRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const filter: DateRangeFilter =
        value === '' ? null : (value as DateRangeFilter);
      dispatch(LeadSentEmailsBuilderActions.setDateRangeFilter(filter));
    },
    [dispatch]
  );

  const handleClearStatFilter = useCallback(() => {
    dispatch(LeadSentEmailsBuilderActions.clearStatCardFilter());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    await dispatch(getAllLeadSentEmailsThunk());
  }, [dispatch]);

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow}>
        <div className={styles.leftFilters}>
          <select
            value={dateRangeFilter ?? ''}
            onChange={handleDateRangeChange}
            className={styles.filterSelect}
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="last_week">Last Week</option>
            <option value="l30">L30</option>
          </select>
          {statCardFilter && (
            <div className={styles.activeFilterBadge}>
              <span>Filtered: {formatFilterLabel(statCardFilter)}</span>
              <button
                type="button"
                onClick={handleClearStatFilter}
                className={styles.clearButton}
                aria-label="Clear filter"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className={styles.refreshButton}
          aria-label="Refresh emails"
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  );
};

const styles = {
  filtersContainer: `
    mb-4
  `,
  filtersRow: `
    flex gap-2 items-center justify-between flex-wrap
  `,
  leftFilters: `
    flex gap-2 items-center flex-wrap
  `,
  filterSelect: `
    px-3 py-1.5
    text-sm text-gray-900
    bg-white border border-gray-300 rounded
    hover:border-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    cursor-pointer
  `,
  activeFilterBadge: `
    inline-flex items-center gap-1.5
    px-3 py-1.5
    text-sm text-gray-700
    bg-blue-50 border border-blue-300 rounded
  `,
  clearButton: `
    text-lg leading-none font-medium text-gray-500
    hover:text-gray-800 transition-colors
    cursor-pointer
  `,
  refreshButton: `
    px-3 py-1.5
    text-sm text-gray-900
    bg-white border border-gray-300 rounded
    hover:bg-gray-50 hover:border-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    cursor-pointer
    transition-colors
  `,
};
