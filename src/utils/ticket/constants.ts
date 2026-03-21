import type { TicketStatus, TicketPriority } from '@/src/model/ticket/Ticket';

/**
 * All ticket status values for filter options (todo, in progress, done).
 */
export const TICKET_STATUS_OPTIONS: readonly TicketStatus[] = [
  'todo',
  'in_progress',
  'done',
] as const;

/**
 * All ticket priority values for filter options (low, medium, high).
 */
export const TICKET_PRIORITY_OPTIONS: readonly TicketPriority[] = [
  'low',
  'medium',
  'high',
] as const;
