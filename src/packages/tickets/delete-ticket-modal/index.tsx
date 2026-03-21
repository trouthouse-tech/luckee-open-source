'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';
import { deleteTicketThunk } from '@/src/store/thunks/tickets';

/**
 * Confirmation modal for deleting tickets
 */
export const DeleteTicketModal = () => {
  const dispatch = useAppDispatch();
  const ticketBuilder = useAppSelector((state) => state.ticketBuilder);
  const currentTicket = useAppSelector((state) => state.currentTicket);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    dispatch(TicketBuilderActions.closeDeleteModal());
  };

  const handleConfirm = () => {
    if (!currentTicket.id) {
      return;
    }

    dispatch(deleteTicketThunk(currentTicket.id));
  };

  if (!ticketBuilder.isDeleteModalOpen || !currentTicket.id || !mounted) {
    return null;
  }

  const modalContent = (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Delete Ticket</h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            disabled={ticketBuilder.isSaving}
          >
            ×
          </button>
        </div>

        {ticketBuilder.errorMessage && (
          <div className={styles.error}>
            {ticketBuilder.errorMessage}
          </div>
        )}

        <div className={styles.content}>
          <p className={styles.message}>
            Are you sure you want to delete the ticket <strong>"{currentTicket.title || 'Untitled'}"</strong>?
            This action cannot be undone.
          </p>

          <div className={styles.actions}>
            <button
              onClick={handleClose}
              disabled={ticketBuilder.isSaving}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={ticketBuilder.isSaving}
              className={styles.deleteButton}
            >
              {ticketBuilder.isSaving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const styles = {
  overlay: `
    fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
  `,
  modal: `
    bg-white rounded-lg shadow-xl w-full max-w-md
    text-gray-900
  `,
  header: `
    flex items-center justify-between px-6 py-4 border-b border-gray-200
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  closeButton: `
    text-2xl text-gray-400 hover:text-gray-600 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
    bg-transparent border-none cursor-pointer
  `,
  error: `
    mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700
  `,
  content: `
    px-6 py-4 text-gray-900
  `,
  message: `
    text-sm text-gray-700 mb-6
  `,
  actions: `
    flex items-center justify-end gap-3
  `,
  cancelButton: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  deleteButton: `
    px-4 py-2 text-sm font-medium text-white bg-red-600 rounded
    hover:bg-red-700 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
