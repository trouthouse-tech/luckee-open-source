'use client';

import { useRouter } from 'next/navigation';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectFilteredTickets } from '@/src/store/selectors';
import { updateTicketThunk, setCurrentTicketThunk } from '@/src/store/thunks';
import { TICKET_STATUS_OPTIONS } from '@/src/utils/ticket/constants';
import type { TicketStatus } from '@/src/model';
import { KanbanColumn } from './KanbanColumn';

export { KanbanColumn } from './KanbanColumn';
export { KanbanCard } from './KanbanCard';

export const TicketsKanban = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const filteredTickets = useAppSelector(selectFilteredTickets);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over == null) return;

    const ticketId = active.id as string;
    const newStatus = over.id as TicketStatus;
    const validStatuses = [...TICKET_STATUS_OPTIONS];
    if (!validStatuses.includes(newStatus)) return;

    const ticket = filteredTickets.find((t) => t.id === ticketId);
    if (ticket != null && ticket.status !== newStatus) {
      void dispatch(updateTicketThunk(ticketId, { status: newStatus }));
    }
  };

  const handleOpenDetail = (ticketId: string) => {
    void dispatch(setCurrentTicketThunk(ticketId));
    router.push('/tickets/detail');
  };

  if (filteredTickets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No tickets match your filters.</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        {TICKET_STATUS_OPTIONS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tickets={filteredTickets.filter((t) => t.status === status)}
            onOpenDetail={handleOpenDetail}
          />
        ))}
      </div>
    </DndContext>
  );
};

const styles = {
  board: `
    flex gap-4 overflow-x-auto pb-4
  `,
  emptyState: `
    text-center py-12
  `,
  emptyText: `
    text-gray-500 text-sm
  `,
};
