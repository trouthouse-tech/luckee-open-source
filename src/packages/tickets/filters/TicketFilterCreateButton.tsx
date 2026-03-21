'use client';

import { useAppDispatch } from '@/src/store/hooks';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';

export const TicketFilterCreateButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(TicketBuilderActions.openCreateModal());
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={handleClick} className={styles.createButton} type="button">
        Create Ticket
      </button>
    </div>
  );
};

const styles = {
  wrapper: `
    flex items-center ml-auto
  `,
  createButton: `
    h-7 px-3 py-1 text-xs bg-blue-600 text-white rounded font-medium
    hover:bg-blue-700 transition-colors
  `,
};
