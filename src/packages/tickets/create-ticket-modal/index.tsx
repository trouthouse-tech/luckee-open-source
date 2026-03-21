'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';
import { CurrentTicketActions } from '@/src/store/current/currentTicket';
import { createTicketThunk } from '@/src/store/thunks/tickets';
import { TicketForm } from '../form';
import type { Ticket } from '@/src/model';

/**
 * Modal for creating new tickets
 */
export const CreateTicketModal = () => {
  const dispatch = useAppDispatch();
  const ticketBuilder = useAppSelector((state) => state.ticketBuilder);
  const currentTicket = useAppSelector((state) => state.currentTicket);
  const user = useAppSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    dispatch(TicketBuilderActions.closeCreateModal());
    dispatch(CurrentTicketActions.reset());
  };

  const handleSubmit = (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) {
      return;
    }

    dispatch(createTicketThunk({
      ...ticket,
      user_id: user.id,
      project_id: currentTicket?.project_id ?? null,
      customer_id: currentTicket?.customer_id ?? null,
    }));
  };

  if (!ticketBuilder.isCreateModalOpen || !mounted) {
    return null;
  }

  const modalContent = (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Ticket</h2>
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
          <TicketForm
            initialValues={currentTicket}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isLoading={ticketBuilder.isSaving}
          />
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
    bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto
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
};
