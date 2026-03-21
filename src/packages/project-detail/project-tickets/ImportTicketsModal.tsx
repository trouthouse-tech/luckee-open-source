'use client';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';
import { approveExtractionDuplicateThunk, extractTicketsFromTextThunk } from '@/src/store/thunks/tickets';

export const ImportTicketsModal = () => {
  const dispatch = useAppDispatch();
  const ticketBuilder = useAppSelector((state) => state.ticketBuilder);

  const handleClose = () => {
    dispatch(TicketBuilderActions.closeImportTicketsModal());
  };

  const handleExtract = () => {
    dispatch(extractTicketsFromTextThunk());
  };
  const duplicates = ticketBuilder.extractionDuplicates;
  const hasDuplicates = duplicates.length > 0;

  const handleApprove = (index: number) => {
    dispatch(approveExtractionDuplicateThunk(index));
  };

  const handleDeny = (index: number) => {
    dispatch(TicketBuilderActions.removeExtractionDuplicateAtIndex(index));
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Import tickets from text</h3>
        <p className={styles.modalDescription}>
          Paste a list of tasks or items; we&apos;ll create one ticket per line or bullet.
          Duplicates are detected and you can approve or skip them.
        </p>
        {ticketBuilder.errorMessage && (
          <div className={styles.modalError}>{ticketBuilder.errorMessage}</div>
        )}
        {!hasDuplicates && (
          <textarea
            value={ticketBuilder.importTicketsText}
            onChange={(e) => dispatch(TicketBuilderActions.setImportTicketsText(e.target.value))}
            placeholder="Paste your list here..."
            rows={12}
            className={styles.modalTextarea}
            disabled={ticketBuilder.isExtractingTickets}
          />
        )}
        {hasDuplicates && (
          <div className={styles.duplicatesSection}>
            {ticketBuilder.extractionCreatedCount > 0 && (
              <p className={styles.createdBanner}>
                Created {ticketBuilder.extractionCreatedCount} new ticket(s).
              </p>
            )}
            <p className={styles.duplicatesTitle}>
              Possible duplicates ({duplicates.length}) – approve to create anyway or skip
            </p>
            <div className={styles.duplicatesList}>
              {duplicates.map((d, i) => (
                <div key={i} className={styles.duplicateRow}>
                  <div className={styles.duplicateContent}>
                    <span className={styles.duplicateExtracted}>"{d.extracted.title}"</span>
                    <span className={styles.duplicateMatch}>
                      Possible duplicate of: {d.existingTicketTitle} (ID: {d.existingTicketId.slice(0, 8)}…)
                    </span>
                  </div>
                  <div className={styles.duplicateActions}>
                    <button
                      type="button"
                      onClick={() => handleDeny(i)}
                      className={styles.denyButton}
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(i)}
                      className={styles.approveButton}
                    >
                      Create anyway
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={handleClose}
            className={styles.modalCancelButton}
            disabled={ticketBuilder.isExtractingTickets}
          >
            {hasDuplicates ? 'Done' : 'Cancel'}
          </button>
          {!hasDuplicates && (
            <button
              type="button"
              onClick={handleExtract}
              disabled={ticketBuilder.isExtractingTickets || !ticketBuilder.importTicketsText.trim()}
              className={styles.modalSubmitButton}
            >
              {ticketBuilder.isExtractingTickets ? 'Extracting…' : 'Extract and create tickets'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  duplicatesSection: `
    mx-6 mb-4
  `,
  createdBanner: `
    text-sm text-green-700 mb-2
  `,
  duplicatesTitle: `
    text-sm font-medium text-gray-700 mb-2
  `,
  duplicatesList: `
    space-y-2 max-h-64 overflow-y-auto
  `,
  duplicateRow: `
    flex items-center justify-between gap-3 p-3 rounded border border-gray-200 bg-gray-50
  `,
  duplicateContent: `
    flex flex-col gap-1 min-w-0
  `,
  duplicateExtracted: `
    text-sm font-medium text-gray-900
  `,
  duplicateMatch: `
    text-xs text-gray-600
  `,
  duplicateActions: `
    flex gap-2 flex-shrink-0
  `,
  denyButton: `
    px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50
  `,
  approveButton: `
    px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700
  `,
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
