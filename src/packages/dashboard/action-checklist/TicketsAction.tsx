'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/src/store/hooks';
import { TicketBuilderActions } from '@/src/store/builders/ticketBuilder';

/**
 * Action item for tickets: view all or create new.
 */
export const TicketsAction = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleViewAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/tickets');
  };

  const handleCreate = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(TicketBuilderActions.openCreateModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.iconWrapper}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5v2" strokeLinecap="round"/>
            <path d="M15 11v2" strokeLinecap="round"/>
            <path d="M15 17v2" strokeLinecap="round"/>
            <path d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={styles.textGroup}>
          <span className={styles.label}>Tickets</span>
          <span className={styles.sublabel}>View or create tickets</span>
        </div>
      </div>
      <div className={styles.right}>
        <button type="button" onClick={handleViewAll} className={styles.linkButton}>
          View all
        </button>
        <button type="button" onClick={handleCreate} className={styles.primaryButton}>
          Create
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: `
    flex items-center justify-between px-5 py-4
    hover:bg-slate-50 transition-colors
    group
  `,
  left: `
    flex items-center gap-4
  `,
  iconWrapper: `
    w-10 h-10 rounded-lg bg-amber-50
    flex items-center justify-center
    group-hover:bg-amber-100 transition-colors
  `,
  icon: `
    w-5 h-5 text-amber-600
  `,
  textGroup: `
    flex flex-col
  `,
  label: `
    text-sm font-medium text-slate-900
  `,
  sublabel: `
    text-xs text-slate-500
  `,
  right: `
    flex items-center gap-2
  `,
  linkButton: `
    text-sm font-medium text-slate-600
    hover:text-slate-900
    px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors
  `,
  primaryButton: `
    text-sm font-medium text-white bg-slate-900
    px-3 py-1.5 rounded-lg
    hover:bg-slate-800 transition-colors
  `,
};
