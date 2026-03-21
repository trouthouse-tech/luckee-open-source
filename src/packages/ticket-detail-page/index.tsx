'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { AppLayout } from '@/src/components';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';
import { CurrentTicketActions } from '@/src/store/current/currentTicket';
import { DeleteTicketModal } from '@/src/packages/tickets/delete-ticket-modal';
import { TicketForm } from '@/src/packages/tickets/form';
import { updateTicketThunk } from '@/src/store/thunks';
import type { Ticket } from '@/src/model';

/**
 * Ticket Detail Page: full-page edit view for a ticket.
 * Replaces EditTicketModal with inline editing.
 */
export const TicketDetailPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentTicket = useAppSelector((state) => state.currentTicket);
  const tickets = useAppSelector((state) => state.tickets);
  const ticketBuilder = useAppSelector((state) => state.ticketBuilder);

  const ticket = useMemo(() => {
    const id = currentTicket?.id;
    if (!id) return null;
    return tickets[id] ?? (currentTicket as typeof tickets[string] | null) ?? null;
  }, [currentTicket, tickets]);

  const baseBreadcrumbOverride = useMemo(
    () => ({ label: 'Tickets', href: '/tickets' }),
    [],
  );

  useEffect(() => {
    if (!currentTicket?.id) {
      router.replace('/tickets');
    }
  }, [currentTicket?.id, router]);

  const handleDelete = () => {
    if (ticket) {
      dispatch(CurrentTicketActions.setCurrentTicket(ticket));
      dispatch(TicketBuilderActions.openDeleteModal());
    }
  };

  const handleSubmit = (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentTicket.id) {
      return;
    }

    dispatch(updateTicketThunk(currentTicket.id, ticketData));
  };

  const handleCancel = () => {
    router.push('/tickets');
  };

  if (!currentTicket?.id) {
    return null;
  }

  const displayTicket = ticket ?? currentTicket;

  return (
    <AppLayout baseBreadcrumbOverride={baseBreadcrumbOverride}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{displayTicket.title ?? '—'}</h1>
            <div className={styles.actions}>
              <Link href="/tickets" className={styles.backLink}>
                Back to list
              </Link>
              <button type="button" onClick={handleDelete} className={styles.deleteButton}>
                Delete
              </button>
            </div>
          </div>

          {ticketBuilder.errorMessage && (
            <div className={styles.error}>
              {ticketBuilder.errorMessage}
            </div>
          )}

          <div className={styles.formSection}>
            <TicketForm
              initialValues={displayTicket}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={ticketBuilder.isSaving}
            />
          </div>
        </div>
      </div>
      {ticketBuilder.isDeleteModalOpen && <DeleteTicketModal />}
    </AppLayout>
  );
};

const styles = {
  container: `
    w-full max-w-3xl mx-auto
  `,
  card: `
    bg-white border border-gray-200 rounded-lg p-6
  `,
  header: `
    flex flex-wrap items-start justify-between gap-4 mb-6 pb-4 border-b border-gray-200
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  actions: `
    flex items-center gap-3 flex-shrink-0
  `,
  backLink: `
    text-sm text-blue-600 hover:text-blue-700 hover:underline
  `,
  deleteButton: `
    px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded
    hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
  `,
  error: `
    mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700
  `,
  formSection: `
    text-gray-900
  `,
};
