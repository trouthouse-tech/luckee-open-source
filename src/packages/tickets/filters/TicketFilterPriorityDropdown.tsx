'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketFiltersBuilderActions } from '@/src/store/builders/ticketFiltersBuilder';
import { TICKET_PRIORITY_OPTIONS } from '@/src/utils/ticket';

export const TicketFilterPriorityDropdown = () => {
  const dispatch = useAppDispatch();
  const selectedPriorities = useAppSelector((state) => state.ticketFiltersBuilder.selectedPriorities);

  return (
    <div className={styles.dropdownWrapper}>
      <details className={styles.dropdown}>
        <summary className={styles.dropdownSummary}>
          Priority {selectedPriorities.length > 0 && `(${selectedPriorities.length})`}
        </summary>
        <div className={styles.dropdownContent}>
          {TICKET_PRIORITY_OPTIONS.map((priority) => (
            <label key={priority} className={styles.dropdownItem}>
              <input
                type="checkbox"
                checked={selectedPriorities.includes(priority)}
                onChange={() => dispatch(TicketFiltersBuilderActions.togglePriority(priority))}
                className={styles.checkbox}
              />
              <span>{priority}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
};

const styles = {
  dropdownWrapper: `
    relative
  `,
  dropdown: `
    relative
  `,
  dropdownSummary: `
    h-7 px-2 py-1 text-xs border border-gray-300 rounded bg-white
    cursor-pointer hover:bg-gray-50 transition-colors list-none flex items-center
  `,
  dropdownContent: `
    absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto
    bg-white border border-gray-300 rounded shadow-lg z-10 py-1
  `,
  dropdownItem: `
    flex items-start gap-2 px-2 py-1.5
    hover:bg-gray-50 cursor-pointer text-xs
  `,
  checkbox: `
    cursor-pointer mt-0.5 flex-shrink-0
  `,
};
