'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketFiltersBuilderActions } from '@/src/store/builders/ticketFiltersBuilder';

export const TicketFilterDateRange = () => {
  const dispatch = useAppDispatch();
  const ticketFilters = useAppSelector((state) => state.ticketFiltersBuilder);

  return (
    <div className={styles.dateRangeWrapper}>
      <span className={styles.filterLabel}>Date:</span>
      <input
        type="date"
        value={ticketFilters.startDate}
        onChange={(e) => dispatch(TicketFiltersBuilderActions.setStartDate(e.target.value))}
        className={styles.dateInput}
      />
      <span className={styles.dateSeparator}>to</span>
      <input
        type="date"
        value={ticketFilters.endDate}
        onChange={(e) => dispatch(TicketFiltersBuilderActions.setEndDate(e.target.value))}
        className={styles.dateInput}
      />
    </div>
  );
};

const styles = {
  dateRangeWrapper: `
    flex items-center gap-1.5
  `,
  filterLabel: `
    text-xs text-gray-600 font-medium
  `,
  dateInput: `
    h-7 px-2 py-1 text-xs border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
  `,
  dateSeparator: `
    text-gray-400 text-xs
  `,
};
