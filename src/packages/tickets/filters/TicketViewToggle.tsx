'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';

export const TicketViewToggle = () => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state) => state.ticketBuilder.viewMode);

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => dispatch(TicketBuilderActions.setTicketsViewMode('table'))}
        className={viewMode === 'table' ? styles.segmentActive : styles.segment}
        aria-label="Table view"
      >
        Table
      </button>
      <button
        type="button"
        onClick={() => dispatch(TicketBuilderActions.setTicketsViewMode('kanban'))}
        className={viewMode === 'kanban' ? styles.segmentActive : styles.segment}
        aria-label="Kanban view"
      >
        Kanban
      </button>
    </div>
  );
};

const styles = {
  container: `
    inline-flex border border-gray-300 rounded-md overflow-hidden
  `,
  segment: `
    px-3 py-2 text-xs font-medium text-gray-600 bg-white
    hover:bg-gray-50 transition-colors
  `,
  segmentActive: `
    px-3 py-2 text-xs font-medium text-white bg-gray-700
  `,
};
