import { Timestamps } from '../shared/Timestamps';

export type TicketStatus = 'todo' | 'in_progress' | 'done';
export type TicketPriority = 'low' | 'medium' | 'high';

export type Ticket = Timestamps & {
  id: string;
  user_id: string;
  project_id: string | null;
  customer_id: string | null;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;

  // Metadata
  tags: string[];
  labels: string[];
};
