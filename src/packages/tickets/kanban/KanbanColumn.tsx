'use client';

import { useDroppable } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';
import type { Ticket, TicketStatus } from '@/src/model';

const STATUS_LABELS: Record<TicketStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

type KanbanColumnProps = {
  status: TicketStatus;
  tickets: Ticket[];
  onOpenDetail: (ticketId: string) => void;
};

export const KanbanColumn = (props: KanbanColumnProps) => {
  const { status, tickets, onOpenDetail } = props;
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={isOver ? styles.columnOver : styles.column}
    >
      <div className={styles.header}>
        <span className={styles.title}>{STATUS_LABELS[status]}</span>
        <span className={styles.count}>({tickets.length})</span>
      </div>
      <div className={styles.cardList}>
        {tickets.length === 0 ? (
          <p className={styles.emptyHint}>Drop here</p>
        ) : (
          tickets.map((ticket) => (
            <KanbanCard
              key={ticket.id}
              ticket={ticket}
              onOpenDetail={onOpenDetail}
            />
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  column: `
    flex flex-col min-w-[280px] w-[280px] rounded-lg border border-gray-200
    bg-gray-50/50
  `,
  columnOver: `
    flex flex-col min-w-[280px] w-[280px] rounded-lg border-2 border-gray-400
    bg-gray-100/80
  `,
  header: `
    px-3 py-2 border-b border-gray-200 bg-white rounded-t-lg
  `,
  title: `
    text-sm font-semibold text-gray-800
  `,
  count: `
    text-xs text-gray-500 ml-1
  `,
  cardList: `
    flex flex-col gap-2 p-3 min-h-[120px]
  `,
  emptyHint: `
    text-xs text-gray-400 py-4 text-center
  `,
};
