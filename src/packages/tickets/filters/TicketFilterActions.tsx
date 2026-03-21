'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketFiltersBuilderActions } from '@/src/store/builders/ticketFiltersBuilder';

export const TicketFilterActions = () => {
  const dispatch = useAppDispatch();
  const ticketFilters = useAppSelector((state) => state.ticketFiltersBuilder);

  const hasActiveFilters = Boolean(
    ticketFilters.searchTerm ||
    ticketFilters.selectedStatuses.length > 0 ||
    ticketFilters.selectedPriorities.length > 0 ||
    ticketFilters.selectedProjects.length > 0 ||
    ticketFilters.selectedCustomers.length > 0 ||
    ticketFilters.startDate ||
    ticketFilters.endDate
  );

  const handleApply = () => {
    dispatch(TicketFiltersBuilderActions.setHasQueried(true));
  };

  const handleClear = () => {
    dispatch(TicketFiltersBuilderActions.clearFilters());
    dispatch(TicketFiltersBuilderActions.setHasQueried(false));
  };

  return (
    <div className={styles.actionButtons}>
      <button
        onClick={handleApply}
        className={styles.applyButton}
        type="button"
        disabled={ticketFilters.isLoading}
      >
        {ticketFilters.isLoading ? 'Loading...' : 'Apply'}
      </button>
      {hasActiveFilters && (
        <button onClick={handleClear} className={styles.clearFiltersButton} type="button">
          Clear
        </button>
      )}
    </div>
  );
};

const styles = {
  actionButtons: `
    flex items-center gap-2
  `,
  applyButton: `
    h-7 px-3 py-1 text-xs bg-blue-600 text-white rounded
    hover:bg-blue-700 transition-colors font-medium
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  clearFiltersButton: `
    h-7 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded
    hover:bg-gray-200 transition-colors font-medium
  `,
};
