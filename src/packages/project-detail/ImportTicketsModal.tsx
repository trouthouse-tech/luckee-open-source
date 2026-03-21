'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';
import { extractTicketsFromTextThunk } from '@/src/store/thunks/tickets';

export const ImportTicketsModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ticketBuilder.isImportTicketsModalOpen);
  const importTicketsText = useAppSelector((state) => state.ticketBuilder.importTicketsText);
  const isExtractingTickets = useAppSelector((state) => state.ticketBuilder.isExtractingTickets);
  const errorMessage = useAppSelector((state) => state.ticketBuilder.errorMessage);

  const handleClose = () => {
    dispatch(TicketBuilderActions.closeImportTicketsModal());
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Import tickets from text</h3>
        <p className={styles.modalDescription}>
          Paste a list of tasks or items; we&apos;ll create one ticket per line or bullet.
        </p>
        {errorMessage && (
          <div className={styles.modalError}>{errorMessage}</div>
        )}
        <textarea
          value={importTicketsText}
          onChange={(e) => dispatch(TicketBuilderActions.setImportTicketsText(e.target.value))}
          placeholder="Paste your list here..."
          rows={12}
          className={styles.modalTextarea}
          disabled={isExtractingTickets}
        />
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={handleClose}
            className={styles.modalCancelButton}
            disabled={isExtractingTickets}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => dispatch(extractTicketsFromTextThunk())}
            disabled={isExtractingTickets || !importTicketsText.trim()}
            className={styles.modalSubmitButton}
          >
            {isExtractingTickets ? 'Extracting…' : 'Extract and create tickets'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: `
    fixed inset-0 bg-black/50 flex items-center justify-center z-50
  `,
  modal: `
    bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4
  `,
  modalTitle: `
    text-lg font-semibold text-gray-900 px-6 pt-6 pb-2
  `,
  modalDescription: `
    text-sm text-gray-600 px-6 pb-4
  `,
  modalError: `
    mx-6 mb-2 px-3 py-2 text-sm text-red-700 bg-red-50 rounded
  `,
  modalTextarea: `
    mx-6 w-[calc(100%-3rem)] px-3 py-2 border border-gray-300 rounded text-sm resize-none font-mono
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  modalActions: `
    flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 mt-4
  `,
  modalCancelButton: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  modalSubmitButton: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
    disabled:bg-gray-300 disabled:cursor-not-allowed
  `,
};
