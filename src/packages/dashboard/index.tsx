'use client';

import { useAppSelector } from '@/src/store/hooks';
import { AppLayout } from '@/src/components';
import { CreateTicketModal } from '@/src/packages/tickets';
import { ActionChecklist } from './action-checklist';

export const Dashboard = () => {
  const ticketBuilder = useAppSelector((state) => state.ticketBuilder);

  return (
    <>
      <AppLayout fullWidth={true}>
        <div className={styles.page}>
          <ActionChecklist />
        </div>
      </AppLayout>

      {ticketBuilder.isCreateModalOpen && <CreateTicketModal />}
    </>
  );
};

const styles = {
  page: `
    max-w-3xl mx-auto py-8 px-4
  `,
};
