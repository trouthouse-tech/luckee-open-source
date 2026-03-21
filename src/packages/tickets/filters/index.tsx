'use client';

import { TicketFilterSearch } from './TicketFilterSearch';
import { TicketFilterCustomerDropdown } from './TicketFilterCustomerDropdown';
import { TicketFilterProjectDropdown } from './TicketFilterProjectDropdown';
import { TicketFilterStatusDropdown } from './TicketFilterStatusDropdown';
import { TicketFilterPriorityDropdown } from './TicketFilterPriorityDropdown';
import { TicketFilterDateRange } from './TicketFilterDateRange';
import { TicketFilterActions } from './TicketFilterActions';
import { TicketViewToggle } from './TicketViewToggle';
import { TicketFilterCreateButton } from './TicketFilterCreateButton';

/**
 * Ticket filters bar: search, customers, projects, status, priority (dropdowns), date range, apply/clear, view toggle, create ticket (far right).
 * Composes sub-components from separate files (one component per file, ADR 002).
 */
export const TicketFilters = () => {
  return (
    <div className={styles.filterSection}>
      <TicketFilterSearch />
      <TicketFilterCustomerDropdown />
      <TicketFilterProjectDropdown />
      <TicketFilterStatusDropdown />
      <TicketFilterPriorityDropdown />
      <TicketFilterDateRange />
      <TicketFilterActions />
      <TicketViewToggle />
      <TicketFilterCreateButton />
    </div>
  );
};

const styles = {
  filterSection: `
    flex flex-wrap gap-3 items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200
  `,
};
