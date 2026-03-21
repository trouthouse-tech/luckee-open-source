import type { RootState } from '../store';
import type { Ticket } from '@/src/model';

/**
 * Returns tickets filtered by ticketFiltersBuilder (search, status, priority, project, customer, date range).
 * No sorting; table and kanban apply their own presentation.
 */
export const selectFilteredTickets = (state: RootState): Ticket[] => {
  const tickets = state.tickets;
  const ticketFilters = state.ticketFiltersBuilder;

  let filtered = Object.values(tickets);

  if (ticketFilters.searchTerm) {
    const searchLower = ticketFilters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(searchLower) ||
        (ticket.description != null &&
          ticket.description.toLowerCase().includes(searchLower)),
    );
  }

  if (ticketFilters.selectedStatuses.length > 0) {
    filtered = filtered.filter((ticket) =>
      ticketFilters.selectedStatuses.includes(ticket.status),
    );
  }

  if (ticketFilters.selectedPriorities.length > 0) {
    filtered = filtered.filter((ticket) =>
      ticketFilters.selectedPriorities.includes(ticket.priority),
    );
  }

  if (ticketFilters.selectedProjects.length > 0) {
    filtered = filtered.filter(
      (ticket) =>
        ticket.project_id != null &&
        ticketFilters.selectedProjects.includes(ticket.project_id),
    );
  }

  if (ticketFilters.selectedCustomers.length > 0) {
    filtered = filtered.filter(
      (ticket) =>
        ticket.customer_id != null &&
        ticketFilters.selectedCustomers.includes(ticket.customer_id),
    );
  }

  if (ticketFilters.startDate) {
    const startDate = new Date(ticketFilters.startDate);
    filtered = filtered.filter(
      (ticket) => new Date(ticket.created_at) >= startDate,
    );
  }

  if (ticketFilters.endDate) {
    const endDate = new Date(ticketFilters.endDate);
    endDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(
      (ticket) => new Date(ticket.created_at) <= endDate,
    );
  }

  return filtered;
};
