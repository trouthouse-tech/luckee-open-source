'use client';

import { TicketsAction } from './TicketsAction';
import { CustomersAction } from './CustomersAction';
import { ProjectsAction } from './ProjectsAction';
import { TimeTrackingAction } from './TimeTrackingAction';

/**
 * ActionChecklist Component
 * Displays a list of quick actions for the dashboard (BiAxis-style).
 */
export const ActionChecklist = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <svg className={styles.headerIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Quick Actions</h2>
          <p className={styles.subtitle}>Get started with common tasks</p>
        </div>
      </div>

      <div className={styles.list}>
        <TicketsAction />
        <CustomersAction />
        <ProjectsAction />
        <TimeTrackingAction />
      </div>
    </div>
  );
};

const styles = {
  container: `
    bg-white border border-slate-200 rounded-xl shadow-sm
    max-w-2xl mx-auto
    overflow-hidden
  `,
  header: `
    px-5 py-4 border-b border-slate-100
    bg-slate-50
    flex items-center gap-3
  `,
  headerIcon: `
    w-9 h-9 rounded-lg bg-slate-900
    flex items-center justify-center
    flex-shrink-0
  `,
  headerIconSvg: `
    w-4.5 h-4.5 text-white
  `,
  headerText: `
    flex flex-col
  `,
  title: `
    text-base font-semibold text-slate-900
    tracking-tight
  `,
  subtitle: `
    text-xs text-slate-500
  `,
  list: `
    divide-y divide-slate-100
  `,
};
