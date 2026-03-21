'use client';

import { useDraggable } from '@dnd-kit/core';
import type { Ticket } from '@/src/model';

const PRIORITY_LABELS: Record<Ticket['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const PRIORITY_STYLES: Record<Ticket['priority'], string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
};

type KanbanCardProps = {
  ticket: Ticket;
  onOpenDetail: (ticketId: string) => void;
};

export const KanbanCard = (props: KanbanCardProps) => {
  const { ticket, onOpenDetail } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: ticket.id });

  const style =
    transform != null
      ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
      : undefined;

  const handleClick = () => {
    onOpenDetail(ticket.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? styles.cardDragging : styles.card}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Ticket: ${ticket.title}`}
    >
      <p className={styles.title}>{ticket.title}</p>
      <span className={`${styles.priorityBadge} ${PRIORITY_STYLES[ticket.priority]}`}>
        {PRIORITY_LABELS[ticket.priority]}
      </span>
      {ticket.description != null && ticket.description.trim() !== '' && (
        <p className={styles.description}>{ticket.description.trim().slice(0, 80)}
          {ticket.description.length > 80 ? '…' : ''}
        </p>
      )}
    </div>
  );
};

const styles = {
  card: `
    p-3 rounded-lg border border-gray-200 bg-white shadow-sm
    cursor-grab active:cursor-grabbing
    hover:border-gray-300 hover:shadow transition-shadow
  `,
  cardDragging: `
    p-3 rounded-lg border border-gray-300 bg-white shadow-md opacity-90
    cursor-grabbing
  `,
  title: `
    text-sm font-medium text-gray-900 mb-1
  `,
  priorityBadge: `
    inline-block px-1.5 py-0.5 rounded text-[10px] font-medium
  `,
  description: `
    mt-2 text-xs text-gray-500 line-clamp-2
  `,
};
