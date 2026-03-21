'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketFiltersBuilderActions } from '@/src/store/builders/ticketFiltersBuilder';
import { TICKET_STATUS_OPTIONS } from '@/src/utils/ticket';

const formatStatusLabel = (status: string) => status.replace('_', ' ');

export const TicketFilterStatusDropdown = () => {
  const dispatch = useAppDispatch();
  const selectedStatuses = useAppSelector((state) => state.ticketFiltersBuilder.selectedStatuses);

  return (
    <div className={styles.dropdownWrapper}>
      <details className={styles.dropdown}>
        <summary className={styles.dropdownSummary}>
          Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
        </summary>
        <div className={styles.dropdownContent}>
          {TICKET_STATUS_OPTIONS.map((status) => (
            <label key={status} className={styles.dropdownItem}>
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status)}
                onChange={() => dispatch(TicketFiltersBuilderActions.toggleStatus(status))}
                className={styles.checkbox}
              />
              <span>{formatStatusLabel(status)}</span>
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
