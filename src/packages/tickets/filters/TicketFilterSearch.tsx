'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketFiltersBuilderActions } from '@/src/store/builders/ticketFiltersBuilder';

export const TicketFilterSearch = () => {
  const dispatch = useAppDispatch();
  const ticketFilters = useAppSelector((state) => state.ticketFiltersBuilder);

  const handleApply = () => {
    dispatch(TicketFiltersBuilderActions.setHasQueried(true));
  };

  return (
    <div className={styles.searchInputWrapper}>
      <input
        type="text"
        placeholder="Search tickets..."
        value={ticketFilters.searchTerm}
        onChange={(e) => dispatch(TicketFiltersBuilderActions.setSearchTerm(e.target.value))}
        className={styles.searchInput}
        onKeyDown={(e) => e.key === 'Enter' && !ticketFilters.isLoading && handleApply()}
      />
      {ticketFilters.searchTerm && (
        <button
          onClick={() => dispatch(TicketFiltersBuilderActions.setSearchTerm(''))}
          className={styles.clearButton}
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
};

const styles = {
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
};
