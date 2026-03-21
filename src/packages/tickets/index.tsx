'use client';

import { useAppSelector } from '@/src/store/hooks';
import { TicketsTable } from './table';
import { TicketsKanban } from './kanban';
import { CreateTicketModal } from './create-ticket-modal';
import { DeleteTicketModal } from './delete-ticket-modal';
import { TicketFilters } from './filters';

export { TicketsTable } from './table';
export { TicketRow } from './table/row';
export { TicketsKanban } from './kanban';
export { CreateTicketModal } from './create-ticket-modal';
export { DeleteTicketModal } from './delete-ticket-modal';
export { TicketForm } from './form';
export { TicketFilters } from './filters';

/**
 * Tickets package: filters bar, table or kanban view, modals. Create Ticket lives in the filter bar (far right).
 */
export const Tickets = () => {
  const ticketBuilder = useAppSelector((state) => state.ticketBuilder);

  return (
    <>
      <div className={styles.container}>
        <TicketFilters />
        {ticketBuilder.viewMode === 'table' ? <TicketsTable /> : <TicketsKanban />}
      </div>

      {ticketBuilder.isCreateModalOpen && <CreateTicketModal />}
      {ticketBuilder.isDeleteModalOpen && <DeleteTicketModal />}
    </>
  );
};

const styles = {
  container: `
    space-y-3
  `,
};
